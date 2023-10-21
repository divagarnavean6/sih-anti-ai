import { secureDocument } from '../sanitizers/SanitizeConfiguration';
export const GMAIL_SIGNATURE = 'gmail_signature';
const HS_SIGNATURE = 'hs_signature'; // gmail class is covered separately

export const SIGNATURE_CLASSLIST = [// HubSpot
HS_SIGNATURE];

const hasSignatureClass = classList => classList && classList.contains && SIGNATURE_CLASSLIST.some(className => classList.contains(className));

export const getNodeHasContent = node => {
  return Boolean(node && node.innerHTML && node.innerHTML.length);
};
/**
 * Users can insert content into the gmail_signature div, in situations where
 * all the content is in that div (i.e. no siblings) we should display the signature
 */

const isGmailSignatureAndHasSibling = node => {
  return node.classList && node.classList.contains && node.classList.contains(GMAIL_SIGNATURE) && (getNodeHasContent(node.nextElementSibling) || getNodeHasContent(node.previousElementSibling));
};

export const removeEmailSignature = ({
  node
}) => {
  const {
    classList
  } = node;
  const shouldRemoveSignature = isGmailSignatureAndHasSibling(node) || hasSignatureClass(classList);

  if (shouldRemoveSignature) {
    const span = secureDocument.createElement('span');
    span.innerHTML = '';
    return {
      node: span
    };
  }

  return null;
};