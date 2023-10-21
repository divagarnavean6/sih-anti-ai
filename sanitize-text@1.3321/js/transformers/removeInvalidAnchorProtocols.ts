// eslint-disable-next-line no-script-url
const BLOCKLISTED_PROTOCOLS = ['javascript:', 'vbscript:', 'data:']; // Sanitize any anchor tags that are not external links. This prevents any XSS, see
// https://issues.hubspotcentral.com/browse/HMSP-2657
// https://issues.hubspotcentral.com/browse/HMSP-4160

export const removeInvalidAnchorProtocols = ({
  node
}) => {
  if (!node || !node.href || node.nodeName !== 'A' || !BLOCKLISTED_PROTOCOLS.includes(node.protocol)) {
    return null;
  }

  const replacementSpan = document.createElement('span');
  replacementSpan.innerText = node.innerText;
  return {
    node: replacementSpan
  };
};