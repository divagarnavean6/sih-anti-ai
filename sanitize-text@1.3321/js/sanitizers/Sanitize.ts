import { secureDocument, config as SanitizeConfig } from './SanitizeConfiguration';
import memoize from 'transmute/memoize';
import { removeStyles } from 'sanitize-text/transformers/removeStyles';
import { standardizeBlockQuoteStyling } from 'sanitize-text/transformers/standardizeBlockQuoteStyling';
import { removeInvalidAnchorProtocols } from 'sanitize-text/transformers/removeInvalidAnchorProtocols';
import { buildSanitizer } from './buildSanitizer';
import { addLinkTargetAttribute } from '../transformers/addLinkTargetAttribute';
export const hasImage = memoize(text => {
  const containsImageRegex = /(<img *src="(.*)"(\s)*(\/)?>)/;
  return containsImageRegex.test(text);
});
export const sanitize = memoize((text, config, transformers = []) => {
  const element = secureDocument.body;

  try {
    secureDocument.domain = window.location.hostname.indexOf('qa') >= 0 ? 'hubspotqa.com' : 'hubspot.com';
  } catch (e) {// IE11 needs to have this but it throws an error in Chrome.
  }

  const div = secureDocument.createElement('div');

  if (text && text !== '') {
    element.innerHTML = text;
    const newConfig = Object.assign({}, config);
    newConfig.transformers = [standardizeBlockQuoteStyling, removeStyles, addLinkTargetAttribute, removeInvalidAnchorProtocols, ...transformers]; // For specific documentation on the Sanitize.js library, config, or transformers, see: https://github.com/gbirke/Sanitize.js

    try {
      const sanitizer = buildSanitizer(newConfig);
      const fragment = sanitizer.clean_node(element).cloneNode(true);
      div.appendChild(fragment);
    } catch (e) {
      console.error(e);
    }
  }

  const isTextContentOnly = config === SanitizeConfig.TEXTONLY;

  if (isTextContentOnly) {
    return div.textContent || '';
  }

  return div.innerHTML;
});
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking
// @ts-expect-error module/module.exports aren't currently supported

if (!!module && !!module.exports) {
  // @ts-expect-error module/module.exports aren't currently supported
  module.exports.default = Object.assign({}, module.exports);
}