/* eslint-disable no-console */
import Raven from 'raven-js';
import getIn from 'transmute/getIn';
import { LogLevel } from './constants/LogLevel';
import { getExtraErrorData } from './getExtraErrorData';
/**
 * @description
 * Report an error to sentry and new relic for more info on fingerprints see
 * https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints
 *
 * For help with tagging, see:
 * https://docs.sentry.io/enriching-error-data/context/?platform=javascript#tagging-events
 *
 * To enable local debugging, set the following option:
 * `localStorage.setItem('SENTRY_DEPLOYED', true);`
 *
 * Per the following Sentry issue, Sentry will automatically combine and throw out messages that
 * share similar stack traces. This makes it impossible to debug local errors since React will
 * cause errors to bubble up through `componentDidCatch` methods, forcing Sentry to effectively log
 * these errors twice. In order to work around this, building a new error in place inside the
 * `componentDidCatch` and attaching the stacktrace as a custom field of that error allows it to
 * reach Sentry.
 * https://github.com/getsentry/sentry-javascript/issues/1249
 *
 * @returns {string} Sentry event id
 */

export const reportError = ({
  error,
  fingerprint,
  tags = {},
  componentData = {},
  extra = {},
  level = LogLevel.error,
  shouldIgnoreStatusZero = true
}) => {
  const isNetworkError = getIn(['networkError', 'status'], error) === 0 || getIn(['status'], error) === 0;

  if (isNetworkError && shouldIgnoreStatusZero) {
    console.error(`Error with: '${error.message}'`);
    return '';
  }

  const errorTags = Object.assign({
    // default tag values
    componentDidCatch: 'false'
  }, tags);
  const extraData = getExtraErrorData(error) || {};
  const errorContext = Object.assign({}, errorTags, {}, extraData, {}, extra); // See: https://hubspot.slack.com/archives/C017FT4P2Q0/p1627310334063600
  // @ts-expect-error custom window types aren't available in all builds

  const newrelic = window.newrelic;

  if (newrelic && typeof newrelic.noticeError === 'function') {
    // note: newrelic strips any fields that don't match it's base JavaScriptError format,
    // so we need to pass extra fields as a second param
    newrelic.noticeError(error, errorContext);
  }

  Raven.captureException(error, {
    fingerprint,
    tags: errorTags,
    extra: Object.assign({
      error: errorContext,
      componentData
    }, extra),
    level
  });
  const lastEventId = Raven.lastEventId();
  console.error(`(Event Id: ${lastEventId})\nError reported with '${error.message}'`);

  if (errorContext) {
    Object.keys(errorContext).forEach(key => {
      if (errorContext[key]) {
        console.error(`Extra Data [${key}]: `, errorContext[key]);
      }
    });
  }

  return lastEventId;
};