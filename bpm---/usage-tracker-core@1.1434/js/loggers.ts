import * as helpers from './common/helpers';
import * as errors from './common/errors';
export const createLog = (type, message, details) => {
  let logMessage = `[usage-tracker-core "${type}"] ${message}`;

  if (details && details.trim().length > 0) {
    logMessage += `\n----------------------------------------\n${details}\n----------------------------------------`;
  }

  return logMessage;
};
export const createDebugLogger = logMessage => (eventKey, message, event) => {
  const {
    where_app: namespace,
    what_event: name
  } = event || {};
  const eventType = `[${helpers.prettyPrint(namespace)}] ` + `${helpers.prettyPrint(name)}`;
  const eventDetails = `eventKey: ${eventKey}\neventType: ${eventType}`;
  const prettifiedPayload = JSON.parse(JSON.stringify(event || {}));
  prettifiedPayload.what_extra_json = JSON.parse(prettifiedPayload.what_extra_json || '{}');
  logMessage(createLog('debug log', message, eventDetails), prettifiedPayload);
};
export const createErrorLogger = (logError, onError) => (error, options) => {
  logError(error);
  helpers.ensureFn(onError)(error, options);
};
export const createWarningLogger = (logWarning, onWarning) => (warning, options) => {
  logWarning(warning);
  helpers.ensureFn(onWarning)(warning, options);
};
export const createPropertyResolutionFailedLogger = (logError, logWarning, onError) => eventKey => (propertyName, error) => {
  logError(error);
  const warningMessage = errors.genericWarning(`Property "${propertyName}" failed to resolve asynchronously and will fallback to "null".`);
  logWarning(warningMessage);
  helpers.ensureFn(onError)(error, {
    extra: {
      propertyName
    },
    fingerprint: ['usage-tracker-js', 'tracker:failedResolveProperty', `event:${eventKey}`]
  });
};