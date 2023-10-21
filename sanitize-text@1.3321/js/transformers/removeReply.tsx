import { secureDocument } from '../sanitizers/SanitizeConfiguration';
export const GMAIL_QUOTE = 'gmail_quote';
export const REPLY_CLASSLIST = [// Gmail
'gmail_extra', GMAIL_QUOTE, // HubSpot
'hs_reply', 'x_hs_reply_wrap'];
export const OFFICE_365_REPLY_ID = 'divRplyFwdMsg';
/**
 *
 * All Gmail email bodies are wrapped in a div that specifies the direction (dir) of the text
 * in the email like so:
 *
 * @example
 * <div dir="ltr">
 *
 * Thus, a formatted quote in a Gmail email is wrapped in such a div (we want to leave these in tact)
 *
 * @example
 * <div dir="ltr">
 *   <blockquote class="gmail_quote"> my quote </blockquote>
 * </div>
 *
 * However, Gmail replies are wrapped the other way around (we want to remove these replies)
 *
 * @example
 * <blockquote class="gmail_quote">
 *   <div dir="ltr"> my reply </div>
 * </blockquote>
 *
 * @description
 * Thus, if a blockquote has a child <div dir="ltr">, we can assume that it is
 * a reply that we want to remove. Otherwise, it is a formatted quote that we
 * want to leave in tact.
 *
 */

export const isGmailReplyBlockquote = node => {
  return node.querySelector('div[dir]');
};

const isReply = (classList, id) => id === OFFICE_365_REPLY_ID || classList && classList.contains && REPLY_CLASSLIST.some(className => classList.contains(className));

export const removeReply = ({
  node
}) => {
  const {
    classList,
    id,
    attributes = []
  } = node;

  if (isReply(classList, id)) {
    if (classList.contains(GMAIL_QUOTE) && !isGmailReplyBlockquote(node)) {
      return null;
    }

    const span = secureDocument.createElement('span');
    Object.values(attributes).forEach(attribute => {
      if (attribute.nodeValue) {
        span.setAttribute(attribute.nodeName, attribute.nodeValue);
      }
    });
    span.innerHTML = '';
    span.setAttribute('data-email-reply', '');
    return {
      node: span
    };
  }

  return null;
};