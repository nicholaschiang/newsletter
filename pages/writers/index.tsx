import Link from 'next/link';
import cn from 'classnames';
import { useMemo } from 'react';

import Avatar from 'components/avatar';
import Empty from 'components/empty';
import Layout from 'components/layout';
import Page from 'components/page';

import { Contact } from 'lib/model/subscription';
import useMessages from 'lib/hooks/messages';
import { useUser } from 'lib/context/user';

interface WriterRowProps {
  writer?: Contact;
}

function WriterRow({ writer }: WriterRowProps): JSX.Element {
  return (
    <Link href={`/writers/${writer?.email}`}>
      <a>
        <li className={cn({ disabled: !writer })}>
          <Avatar src={writer?.photo} loading={!writer} size={36} />
          {!writer && <span className='name loading' />}
          {writer && <span className='name nowrap'>{writer?.name}</span>}
        </li>
        <style jsx>{`
          a {
            text-decoration: none;
            color: unset;
          }

          li {
            display: flex;
            align-items: center;
            margin: 16px 0;
            cursor: pointer;
          }

          li.disabled {
            cursor: wait;
          }

          li:first-child {
            margin-top: 0;
          }

          li > :global(.avatar) {
            flex: none;
          }

          .name {
            flex: 1 1 auto;
            width: 0;
            font-size: 16px;
            font-weight: 400;
            line-height: 18px;
            height: 18px;
            margin: 0 24px;
          }

          .name.loading {
            border-radius: 6px;
          }
        `}</style>
      </a>
    </Link>
  );
}

export default function WritersPage(): JSX.Element {
  const { user, loggedIn } = useUser();
  const { data } = useMessages();

  const subscriptions = useMemo(
    () =>
      user.subscriptions.sort((a, b) => {
        if (!data) {
          if (a.from.name < b.from.name) return -1;
          if (a.from.name > b.from.name) return 1;
          return 0;
        }
        const messages = data
          .flat()
          .sort(
            (c, d) => new Date(d.date).valueOf() - new Date(c.date).valueOf()
          );
        const idxA = messages.findIndex((l) => l.from.email === a.from.email);
        const idxB = messages.findIndex((l) => l.from.email === b.from.email);
        // B goes after A because B isn't in the feed
        if (idxA !== -1 && idxB === -1) return -1;
        // A goes after B because A isn't in the feed
        if (idxA === -1 && idxB !== -1) return 1;
        // Neither are in the feed; sort alphabetically.
        if (idxA === -1 && idxB === -1) {
          if (a.from.name < b.from.name) return -1;
          if (a.from.name > b.from.name) return 1;
          return 0;
        }
        // B goes after A because it appears later in the feed
        if (idxA < idxB) return -1;
        // A goes after B because it appears later in the feed
        if (idxA > idxB) return 1;
        return 0;
      }),
    [data, user.subscriptions]
  );

  const loader = useMemo(() => {
    const empty = Array(5).fill(null);
    // eslint-disable-next-line react/no-array-index-key
    return empty.map((_, idx) => <WriterRow key={idx} />);
  }, []);

  return (
    <Page name='Writers' login sync>
      <Layout>
        {!loggedIn && <ul>{loader}</ul>}
        {loggedIn && !!subscriptions.length && (
          <ul>
            {subscriptions.map(({ from: writer }) => (
              <WriterRow key={writer.email} writer={writer} />
            ))}
          </ul>
        )}
        {loggedIn && !subscriptions.length && (
          <Empty>No writers to show.</Empty>
        )}
        <style jsx>{`
          ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          @media (max-width: 800px) {
            ul {
              margin-top: 24px;
            }
          }
        `}</style>
      </Layout>
    </Page>
  );
}
