export const createError = (name, msg, cause) => {
  const error = new Error(msg); // Overrides the name/type of the Error

  error.name = name; // Overrides the StackTrace to be `ErrorType: Message`

  error.stack = `${name}: ${msg}`; // Adds Extra information to the Error object that can be used by the logger

  error.cause = cause;
  return error;
};
export const isUsageTrackerError = error => {
  if (error && error.name && error.stack && typeof error.cause === 'object') {
    const errorCause = error.cause;
    return Boolean(errorCause && errorCause.type && errorCause.dangerLevel);
  }

  return false;
};
export const mergeErrorCauseWithSentry = (err, options) => {
  if (!isUsageTrackerError(err)) {
    return options;
  }

  if (typeof options === 'object' && typeof options.extra === 'object') {
    return Object.assign({}, options, {
      extra: Object.assign({}, options.extra, {}, err.cause)
    });
  }

  return Object.assign({}, options, {
    extra: Object.assign({}, err.cause)
  });
};
export const genericWarning = message => createError('UsageTrackerGenericWarning', message, {
  type: 'generic warning',
  dangerLevel: 'This error does not break tracking or the execution thread.'
});
export const genericError = message => createError('UsageTrackerError', message, {
  type: 'generic error',
  dangerLevel: 'This error breaks the execution thread.'
});
export const configError = message => createError('UsageTrackerConfigError', message, {
  type: 'config error',
  dangerLevel: 'This error breaks the execution thread.'
});
export const eventError = message => createError('UsageTrackerEventError', message, {
  type: 'event error',
  dangerLevel: 'This error breaks tracking, but not the execution thread.'
});