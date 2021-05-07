import atob from 'atob';
import utf8 from 'utf8';
import he from 'he';

import { Category, Contact } from 'lib/model/letter';
import { hasWhitelistDomain, whitelist } from 'lib/whitelist';
import { GmailMessage } from 'lib/api/gmail';
import { Message } from 'lib/model/message';

export function getIcon(name: string, email: string): string {
  const result = whitelist[name.toLowerCase()];
  if (result && result !== true && result.asset_url) return result.asset_url;
  let domain = email.slice(email.indexOf('@') + 1);
  if (domain.startsWith('e.')) {
    domain = domain.slice(2);
  }
  if (domain.startsWith('email.')) {
    domain = domain.slice(6);
  }
  if (domain.startsWith('mail.')) {
    domain = domain.slice(5);
  }
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
}

/**
 * Parses the given from header (from Gmail's API) into a name and email.
 * @param The from header from Gmail's API.
 * @return The from header parsed into name and email strings.
 */
export function parseFrom(from: string): Contact {
  const matches = /(.*) <(.*)>/.exec(from);
  if (!matches) return { name: from, email: from, photo: '' };
  let name = matches[1].trim();
  if (name.startsWith('"')) {
    name = name.substr(1);
  }
  if (name.endsWith('"')) {
    name = name.substr(0, name.length - 1);
  }
  const email = matches[2].toLowerCase();
  return { name, email, photo: getIcon(name, email) };
}

export function getMessageBody(message: GmailMessage): string {
  let bodyData = '';
  if (message?.payload?.mimeType === 'text/html') {
    bodyData = message?.payload?.body?.data || '';
  } else {
    // Probably multipart?
    const parts = message.payload?.parts || [];
    const htmlPart = parts.find((p) => p.mimeType === 'text/html');
    const textPart = parts.find((p) => p.mimeType === 'text/plain');
    if (htmlPart) {
      bodyData = htmlPart.body?.data || '';
    } else if (textPart) {
      bodyData = textPart.body?.data || '';
    } else if ((message.payload?.parts || []).length > 0) {
      // Super multipart?
      const subpart = (message.payload?.parts || [])[0];
      const subparts = subpart.parts;
      const htmlSubart = subparts?.find((p) => p.mimeType === 'text/html');
      const textSubpart = subparts?.find((p) => p.mimeType === 'text/plain');
      if (htmlSubart) {
        bodyData = htmlSubart.body?.data || '';
      } else if (textSubpart) {
        bodyData = textSubpart.body?.data || '';
      }
    }
  }
  return utf8.decode(atob(bodyData.replace(/-/g, '+').replace(/_/g, '/')));
}

export function getSnippet(message: GmailMessage): string {
  if (!message.snippet) return '';
  let cleanedUp: string = he.decode(message.snippet);
  if (!cleanedUp.endsWith('.')) cleanedUp += '...';
  return cleanedUp;
}

/**
 * Converts a GmailMessage into our Message data type.
 * @param gmailMessage - The GmailMessage to convert.
 * @return The converted message (with sanitized HTML and all).
 */
export function messageFromGmail(gmailMessage: GmailMessage): Message {
  function getHeader(header: string): string {
    return (
      gmailMessage.payload?.headers?.find(
        (h) => h?.name?.toLowerCase() === header
      )?.value || ''
    );
  }

  const { name, email, photo } = parseFrom(getHeader('from'));
  let category: Category | undefined;
  if (whitelist[name.toLowerCase()] || hasWhitelistDomain(email)) {
    category = 'important';
  } else if (getHeader('list-unsubscribe')) {
    category = 'other';
  }

  return new Message({
    category,
    id: gmailMessage.id || '',
    date: new Date(Number(gmailMessage.internalDate)),
    from: { name, email, photo },
    subject: getHeader('subject'),
    snippet: getSnippet(gmailMessage),
    html: getMessageBody(gmailMessage),
    time: 0, // TODO: Estimate reading time (in minutes) by character count.
  });
}