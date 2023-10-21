/* hs-eslint ignored failing-rules */

/* eslint-disable conversations/no-dynamic-i18n */
import I18n from 'I18n';
// FIXME changes runtime
export function makeStandardResponse({
  standardResponse
}) {
  return I18n.text(`conversations-internal-schema.typicalResponseTime.standardResponses.${standardResponse}`);
}