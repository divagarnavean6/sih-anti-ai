// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'sani... Remove this comment to see the full error message
import Sanitize from 'sanitize';
// For specific documentation on the Sanitize.js library, config, or transformers, see: https://github.com/gbirke/Sanitize.js
export const buildSanitizer = config => {
  return new Sanitize(config);
};