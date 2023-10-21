import { config, getIframeHtmlConfig } from './SanitizeConfiguration';
import memoize from 'transmute/memoize';
import Autolinker from './Autolinker';
import { sanitize } from './Sanitize';
import { fixImages } from '../transformers/fixImages';
import { removeOutlookLineBreaks } from '../transformers/removeOutlookLineBreaks';
import { removeReply, REPLY_CLASSLIST, OFFICE_365_REPLY_ID } from '../transformers/removeReply';
import { replaceGmailDivs } from '../transformers/replaceGmailDivs';
import { removeGmailLineBreakBeforeReply } from '../transformers/removeGmailLineBreakBeforeReply';
import { openLinksInNewTab } from '../transformers/openLinksInNewTab';
import { removeEmailSignature, SIGNATURE_CLASSLIST, GMAIL_SIGNATURE } from '../transformers/removeEmailSignature';
import { allowlistIframes } from '../transformers/allowlistIframes';
import { getTextContentFromHtml as TextSanitizer_getTextContentFromHtml } from './TextSanitizer';
export const hasReplyOrSignature = memoize(body => {
  return !![...REPLY_CLASSLIST, OFFICE_365_REPLY_ID, ...SIGNATURE_CLASSLIST, GMAIL_SIGNATURE].find(replyIdentifier => body.includes(replyIdentifier));
}); // Continue to export `getTextContentFromHtml` from `HtmlSanitizer` for backwards-compatibility,
// until all usages are updated to import from `TextSanitizer`.
// See https://git.hubteam.com/HubSpot/CRM-Issues/issues/8699

export const getTextContentFromHtml = TextSanitizer_getTextContentFromHtml;
export const formatThreadedEmailPreview = memoize((text, charLimit = 400) => {
  const transformers = [removeOutlookLineBreaks, replaceGmailDivs, removeReply];
  const formattedText = sanitize(text, config.TEXTONLY, transformers);
  return formattedText && formattedText.length > charLimit ? formattedText.substring(0, charLimit) : formattedText;
});
const cleanHtmlWithoutEmailReplies = memoize(({
  text,
  shouldRemoveGmailLineBreakBeforeReply = false,
  shouldRemoveEmailSignature = true,
  htmlConfig = config.HTML,
  shouldOpenLinksInNewTab = false,
  allowedDomainsForIframe = []
}) => {
  const optionalTransformers = [...(shouldRemoveGmailLineBreakBeforeReply ? [removeGmailLineBreakBeforeReply] : []), ...(shouldRemoveEmailSignature ? [removeEmailSignature] : []), ...(shouldOpenLinksInNewTab ? [openLinksInNewTab] : [])];
  const transformers = [removeOutlookLineBreaks, replaceGmailDivs, removeReply, fixImages, args => allowlistIframes(Object.assign({}, args, {
    allowedDomainsForIframe
  })), ...optionalTransformers];
  return sanitize(text, htmlConfig, transformers);
});
const cleanHtmlWithEmailReplies = memoize(({
  text,
  shouldRemoveGmailLineBreakBeforeReply = false,
  shouldRemoveEmailSignature = false,
  htmlConfig = config.HTML,
  shouldOpenLinksInNewTab = false,
  allowedDomainsForIframe = []
}) => {
  const optionalTransformers = [...(shouldRemoveGmailLineBreakBeforeReply ? [removeGmailLineBreakBeforeReply] : []), ...(shouldRemoveEmailSignature ? [removeEmailSignature] : []), ...(shouldOpenLinksInNewTab ? [openLinksInNewTab] : [])];
  const transformers = [removeOutlookLineBreaks, replaceGmailDivs, fixImages, args => allowlistIframes(Object.assign({}, args, {
    allowedDomainsForIframe
  })), ...optionalTransformers];
  return sanitize(text, htmlConfig, transformers);
});
export const escapeBrackets = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const formatHtml = (body, formattingOptions = {}) => {
  const {
    allowedDomainsForIframe,
    isPlainText,
    shouldAutolinkTwitter,
    shouldIncludeReplies,
    shouldOpenLinksInNewTab,
    shouldPreserveNewlines,
    shouldPreventAutoLinker,
    shouldRemoveEmailSignature,
    shouldRemoveGmailLineBreakBeforeReply
  } = formattingOptions;

  if (!body) {
    return '';
  }

  const htmlConfig = allowedDomainsForIframe ? getIframeHtmlConfig() : config.HTML;
  const bodyToFormat = isPlainText ? escapeBrackets(body) : body;
  let formattedBody = shouldIncludeReplies ? cleanHtmlWithEmailReplies({
    text: bodyToFormat,
    shouldRemoveGmailLineBreakBeforeReply,
    shouldRemoveEmailSignature,
    shouldOpenLinksInNewTab,
    htmlConfig,
    allowedDomainsForIframe
  }) : cleanHtmlWithoutEmailReplies({
    text: bodyToFormat,
    shouldRemoveEmailSignature,
    shouldRemoveGmailLineBreakBeforeReply,
    shouldOpenLinksInNewTab,
    htmlConfig,
    allowedDomainsForIframe
  });
  formattedBody = formattedBody === null || isPlainText || shouldPreserveNewlines ? formattedBody : formattedBody.replace('\n', '');
  const autolinker = shouldAutolinkTwitter ? Autolinker.getTwitter() : Autolinker.get();
  return shouldPreventAutoLinker ? formattedBody : autolinker.link(formattedBody);
};
export { OFFICE_365_REPLY_ID };
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking
// @ts-expect-error module/module.exports aren't currently supported

if (!!module && !!module.exports) {
  // @ts-expect-error module/module.exports aren't currently supported
  module.exports.default = Object.assign({}, module.exports);
}