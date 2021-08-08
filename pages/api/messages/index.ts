import { NextApiRequest as Req, NextApiResponse as Res } from 'next';

import { Message, MessageInterface, MessageJSON } from 'lib/model/message';
import { APIErrorJSON } from 'lib/model/error';
import { db } from 'lib/api/firebase';
import { handle } from 'lib/api/error';
import logger from 'lib/api/logger';
import segment from 'lib/api/segment';
import verifyAuth from 'lib/api/verify/auth';

export type MessagesQuery = {
  lastMessageId?: string;
  quickRead?: 'true' | 'false';
  archive?: 'true' | 'false';
  resume?: 'true' | 'false';
  writer?: string;
};

export type MessagesRes = MessageJSON[];

/**
 * GET - Lists the messages for the given user.
 *
 * Requires a JWT; will return the messages for that user.
 */
export default async function messagesAPI(
  req: Req,
  res: Res<MessagesRes | APIErrorJSON>
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method as string} Not Allowed`);
  } else {
    try {
      console.time('get-messages-api');
      const { lastMessageId, quickRead, archive, resume, writer } =
        req.query as MessagesQuery;
      const user = await verifyAuth(req);
      console.time('fetch-messages');
      logger.verbose(`Fetching messages for ${user}...`);
      const ref = db.collection('users').doc(user.id).collection('messages');
      let query = ref.where('archived', '==', archive === 'true');
      if (quickRead === 'true') query = query.where('quickRead', '==', true);
      if (resume === 'true') query = query.where('resume', '==', true);
      if (writer) query = query.where('from.email', '==', writer);
      query = query.orderBy('date', 'desc').limit(5);
      if (lastMessageId) {
        const lastMessageDoc = await ref.doc(lastMessageId).get();
        query = query.startAfter(lastMessageDoc);
      }
      const messages = (await query.get()).docs.map(Message.fromFirestoreDoc);
      console.timeEnd('fetch-messages');
      res.status(200).json(messages.map((m) => m.toJSON()));
      logger.info(`Fetched ${messages.length} messages for ${user}.`);
      console.timeEnd('get-messages-api');
      segment.track({
        userId: user.id,
        event: 'Messages Listed',
        properties: messages.map((m) => m.toSegment()),
      });
    } catch (e) {
      handle(e, res);
    }
  }
}
