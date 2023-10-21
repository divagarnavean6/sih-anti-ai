import { REPLY_CLASSLIST, OFFICE_365_REPLY_ID } from 'sanitize-text/transformers/removeReply';
import { secureDocument } from '../sanitizers/SanitizeConfiguration';

const isReply = (classList, id) => id === OFFICE_365_REPLY_ID || classList && classList.contains && REPLY_CLASSLIST.some(className => classList.contains(className));

export const removeGmailLineBreakBeforeReply = ({
  node
}) => {
  if (!node || !node.tagName || node.tagName.toLowerCase() !== 'br') {
    return null;
  }

  if (!node.nextElementSibling || !node.nextElementSibling.tagName) {
    return null;
  } // check to see if the next sibling is a reply


  const {
    classList,
    id
  } = node.nextElementSibling;

  if (!isReply(classList, id)) {
    return null;
  } // replace <br /> with <span> so it doesn't take up any veritcal space


  const span = secureDocument.createElement('span');
  span.innerHTML = '';
  return {
    node: span
  };
};