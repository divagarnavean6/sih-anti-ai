// For specific documentation on the Sanitize.js library, config, or transformers, see: https://github.com/gbirke/Sanitize.js
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'sani... Remove this comment to see the full error message
import Sanitize from 'sanitize';
import set from 'transmute/set';
import memoize from 'transmute/memoize'; // createHTMLDocument MUST be passed a title or else sanitized content will break in Internet Explorer: https://issues.hubspotcentral.com/browse/CRM-17134

export const secureDocument = document.implementation.createHTMLDocument('sanitize');
export const config = {
  HTML: {
    elements: ['a', 'b', 'blockquote', 'br', 'bdi', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'dl', 'dt', 'em', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'img', 'li', 'ol', 'p', 'pre', 'q', 'small', 'strike', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul', 'font', 'div', 'span', 's'],
    dom: secureDocument,
    attributes: {
      __ALL__: ['style', 'align', 'valign', 'color', 'width', 'height'],
      a: ['href', 'title', 'target'],
      blockquote: ['cite'],
      col: ['span'],
      colgroup: ['span'],
      div: ['dir'],
      font: ['size', 'face'],
      iframe: ['style', 'src', 'scrolling', 'frameborder', 'allowtransparency', 'allowfullscreen'],
      img: ['alt', 'data-original-height', 'data-original-width', 'src', 'title'],
      ol: ['start', 'type'],
      q: ['cite'],
      span: ['data-at-mention', 'data-owner-id', 'contenteditable', 'data-email-reply', 'data-timestamp', 'data-value'],
      table: ['summary', 'bgcolor', 'cellpadding', 'cellspacing'],
      td: ['abbr', 'axis', 'bgcolor', 'colspan', 'rowspan'],
      th: ['abbr', 'axis', 'bgcolor', 'colspan', 'rowspan', 'scope'],
      tr: ['bgcolor'],
      ul: ['type']
    },
    add_attributes: {
      a: {
        rel: 'nofollow noopener noreferrer'
      }
    },
    protocols: {
      a: {
        href: ['ftp', 'http', 'https', 'mailto', 'tel', 'mms', 'sms', Sanitize.RELATIVE]
      },
      blockquote: {
        cite: ['http', 'https', Sanitize.RELATIVE]
      },
      img: {
        src: ['data', 'http', 'https', Sanitize.RELATIVE]
      },
      q: {
        cite: ['http', 'https', Sanitize.RELATIVE]
      }
    },
    // 'title' added below to fix https://issues.hubspotcentral.com/browse/CRMMAIL-5367
    remove_contents: ['script', 'style', 'title']
  },
  TEXTONLY: {
    dom: secureDocument,
    elements: [],
    remove_contents: ['style', 'script']
  }
}; // returns a copy of config.HTML with `iframe` added to the list of allowed elements

export const getIframeHtmlConfig = memoize(() => {
  const htmlConfig = config.HTML;
  const allowedElements = [...htmlConfig.elements];
  allowedElements.push('iframe');
  return set('elements', allowedElements, htmlConfig);
});