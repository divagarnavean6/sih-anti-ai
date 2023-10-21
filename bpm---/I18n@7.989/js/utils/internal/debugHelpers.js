'use es6';

export const debugLog = function debugLog(...args) {
  if (!document) {
    return;
  }

  let enabled = this.I18N_DEBUG_LOG || window.I18N_DEBUG;

  try {
    enabled = localStorage.I18N_DEBUG_LOG === 'true' || localStorage.I18N_DEBUG === 'true';
  } catch (e) {// Do nothing
  }

  if (!enabled) return;
  args.unshift('I18n:');
  /*
  # To help prevent confusion in Marketing Grader, prefix iframe if this isn't
  # the top frame on the page
  */

  if (window.parent !== window) args.unshift('(IFRAME)');
  console.log(...args);
};