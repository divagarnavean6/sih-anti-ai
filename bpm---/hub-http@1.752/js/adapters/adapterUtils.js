"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackSuccess = exports.withRetry = exports.trackFailureBasedOnErrorResponse = exports.withTracking = exports.requestIdKey = exports.buildRequestError = exports.buildErrorResponse = exports.buildResponse = exports.withResponseHandlers = exports.getResponseHeaders = exports.handleResponse = void 0;

var _response = require("../helpers/response");

var _update = require("../helpers/update");

var requestTracker = _interopRequireWildcard(require("../helpers/requestTracker"));

// Only importing via wildcard for unit test's sake
const handleResponse = (response, handlers) => {
  return handlers.reduce((previous, handler) => handler(previous), response);
};

exports.handleResponse = handleResponse;

const getResponseHeaders = xhr => (xhr.getAllResponseHeaders() || '').trim().split('\n').reduce((headers, current) => {
  const split = current.trim().split(':');
  const key = split.shift().trim();
  const value = split.join(':').trim();
  headers[key] = value;
  return headers;
}, {});

exports.getResponseHeaders = getResponseHeaders;

const withResponseHandlers = (response, options) => {
  response = (0, _update.set)('options', options)(response);
  const handlers = (0, _response.responseHandlers)(options);
  return handlers && handlers.length ? handleResponse(Promise.resolve(response), handlers) : Promise.resolve(response);
};

exports.withResponseHandlers = withResponseHandlers;

const getJSONResponse = xhr => {
  try {
    return xhr.getResponseHeader('content-type').indexOf('application/json') === 0 ? JSON.parse(xhr.responseText) : undefined;
  } catch (err) {
    return undefined;
  }
};

const buildResponse = xhr => ({
  status: xhr.status,
  statusText: xhr.statusText,
  data: 'response' in xhr ? xhr.response : xhr.responseText,
  headers: getResponseHeaders(xhr),
  xhr,
  responseText: xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : '',
  responseJSON: getJSONResponse(xhr)
}); // create an error with XHR and response information.


exports.buildResponse = buildResponse;

const buildErrorResponse = (xhr, message, code) => {
  const response = buildResponse(xhr);
  return Object.assign(response, {
    statusText: response.statusText || message,
    responseJSON: getJSONResponse(xhr),
    errorMessage: message,
    errorCode: code
  });
};

exports.buildErrorResponse = buildErrorResponse;

const buildRequestError = reason => {
  let error;
  const errorCode = 'REQUEST ERROR';

  if (reason instanceof Error) {
    error = reason;
  } else if (typeof reason === 'string' || reason instanceof String) {
    error = new Error(reason);
  }

  return Object.assign(error, {
    code: errorCode,
    status: 0,
    statusText: error.message
  });
};

exports.buildRequestError = buildRequestError;
const requestIdKey = Symbol('requestId');
exports.requestIdKey = requestIdKey;

const withTracking = options => {
  if (options.doNotTrack === true) {
    return options;
  } else {
    const requestId = requestTracker.startTrackingRequest(options.url, 'hub-http');
    const optionsClone = Object.assign({}, options);
    optionsClone[requestIdKey] = requestId;
    return optionsClone;
  }
};

exports.withTracking = withTracking;

const trackFailureBasedOnErrorResponse = (response, {
  willBeRetried = false,
  retryReason,
  retryAttempt
} = {}) => {
  if (response.options && response.options[requestIdKey] !== undefined) {
    if (response.errorCode === 'ABORT') {
      requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'aborted', {
        status: response.status
      });
    } else if (response.errorCode === 'TIMEOUT') {
      requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'timedOut', {
        status: response.status
      });
    } else {
      requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'failed', {
        status: response.status,
        statusText: response.statusText,
        willBeRetried,
        retryReason,
        retryAttempt
      });
    }
  }

  return response;
};

exports.trackFailureBasedOnErrorResponse = trackFailureBasedOnErrorResponse;

const withRetry = (options, fn) => {
  const attempt = options.retryAttempts || 0;
  return fn(Object.assign({}, options, {
    retryAttempts: attempt
  })).catch(response => {
    if (response.retry && response.retry.exceededRetries) {
      return Promise.reject((0, _response.responseError)(response, `Request for ${response.options.method} ${response.options.url} failed with status code ${response.status} after max retries exceeded (${response.retry.maxRetries}). ${response.statusText || ''}`));
    } else if (response.retry) {
      const reasonMessage = response.retry.reason ? ` Reason: ${response.retry.reason}` : ''; // Try retries (the final attempt will not have `response.retry` and will be tracked
      // by the normal handlers)

      trackFailureBasedOnErrorResponse(response, {
        willBeRetried: true,
        retryReason: reasonMessage,
        retryAttempt: attempt + 1
      }); // eslint-disable-next-line no-console

      console.log(`Retrying. Retry attempt ${attempt + 1} of ${response.retry.maxRetries}.${reasonMessage}`);
      return new Promise(resolve => {
        setTimeout(() => resolve(withRetry(Object.assign({}, options, {
          retryAttempts: attempt + 1
        }), fn)), response.retry.delay);
      });
    } // Just in case some other rejection/error comes through unrelated to retries


    return Promise.reject(response);
  });
};

exports.withRetry = withRetry;

const trackSuccess = response => {
  if (response.options && response.options[requestIdKey] !== undefined) {
    requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'succeeded', {
      status: response.status,
      statusText: response.statusText
    });
  }

  return response;
};

exports.trackSuccess = trackSuccess;