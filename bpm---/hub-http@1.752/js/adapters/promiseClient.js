"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.enableMockAuth = exports._originalClientImplCalled = exports.maybeWithIframeXMLHttpRequest = void 0;

var _update = require("../helpers/update");

var _adapterUtils = require("./adapterUtils");

var _staticAppInfo = require("../middlewares/staticAppInfo");

var _mockAuth = require("../middlewares/mockAuth");

var _index = require("../index");

var _trackRequests = require("../tracking/trackRequests");

var _metrics = require("../tracking/metrics");

var _url = require("../helpers/url");

const maybeWithIframeXMLHttpRequest = options => {
  const canUseSyncIframeRequest = options.useIframeRequest && window.iframeXMLHttpRequest && window.apiIframe && window.apiIframe.contentDocument;
  const canUseAsyncIframeRequest = options.useIframeRequest && window.iframeXMLHttpRequestPromise;
  const canUseIframeHack = canUseSyncIframeRequest || canUseAsyncIframeRequest;

  if (!canUseIframeHack) {
    return (0, _update.set)('Request', options.Request || XMLHttpRequest)(options);
  } // see https://git.hubteam.com/HubSpot/hub-http/pull/372


  window.apiIframeUsed = true;
  const newHeaders = Object.assign({
    'X-HS-Referer': window.location.href
  }, options.headers);
  const optionsWithAdditionalHeaders = (0, _staticAppInfo.withStaticAppInfo)((0, _update.set)('headers', newHeaders)(options)); // If iframeXMLHttpRequestPromise is set, wait for it to resolve before issuing a request
  // This is done when all appropriate requests must be sent via the frame

  if (canUseAsyncIframeRequest) {
    return window.iframeXMLHttpRequestPromise.then(iframeXMLHttpRequest => (0, _update.set)('Request', iframeXMLHttpRequest)(optionsWithAdditionalHeaders)).catch(() => (0, _update.set)('Request', options.Request || XMLHttpRequest)(options));
  }

  return (0, _update.set)('Request', window.iframeXMLHttpRequest)(optionsWithAdditionalHeaders);
};

exports.maybeWithIframeXMLHttpRequest = maybeWithIframeXMLHttpRequest;

const withOptions = options => {
  return new Promise(resolve => {
    const Request = options.Request || XMLHttpRequest;
    const xhr = new Request();

    if (options.error) {
      resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, options.error.message, 'OPTIONSERROR'), options));
      return;
    } // the http request was done by a separate client and is being piped back
    // into this one for response handling


    if (options.externalResponse) {
      const fromExternalResponse = options.externalResponse instanceof XMLHttpRequest ? (0, _adapterUtils.buildResponse)(options.externalResponse) : Object.assign((0, _adapterUtils.buildResponse)(xhr), options.externalResponse);
      resolve((0, _adapterUtils.withResponseHandlers)(fromExternalResponse, options));
      return;
    }

    (0, _trackRequests.reportDomain)(options.url);
    xhr.open(options.method || 'GET', options.url, true);

    if (typeof options.timeout === 'number') {
      xhr.timeout = options.timeout;
    }

    xhr.withCredentials = options.withCredentials;

    if (options.responseType) {
      xhr.responseType = options.responseType;
    }

    if (typeof options.withXhr === 'function') {
      options.withXhr(xhr);
    }

    Object.keys(options.headers || {}).forEach(headerName => {
      if (options.headers[headerName] !== false) {
        xhr.setRequestHeader(headerName, options.headers[headerName]);
      }
    });
    const sendTime = performance.now();
    xhr.addEventListener('load', () => {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime,
        statusCode: xhr.status
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildResponse)(xhr), options));
    });
    xhr.addEventListener('error', () => {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime,
        statusCode: xhr.status,
        statusDesc: 'NETWORKERROR'
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, 'Network request failed', 'NETWORKERROR'), options));
    });
    xhr.addEventListener('timeout', () => {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime,
        statusCode: xhr.status,
        statusDesc: 'TIMEOUT'
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, 'Request timeout', 'TIMEOUT'), options));
    });
    xhr.addEventListener('abort', () => {
      (0, _trackRequests.reportStatusCode)({
        url: xhr.responseURL,
        sendTime,
        statusCode: xhr.status,
        statusDesc: 'ABORT'
      });
      return resolve((0, _adapterUtils.withResponseHandlers)((0, _adapterUtils.buildErrorResponse)(xhr, 'Request aborted', 'ABORT'), options));
    });
    xhr.send(typeof options.data === 'undefined' ? null : options.data);
  });
};

const handleRequestErrors = reason => Promise.reject((0, _adapterUtils.buildRequestError)(reason));

const essentialMiddleware = (0, _index.createStack)(_adapterUtils.withTracking, maybeWithIframeXMLHttpRequest, _staticAppInfo.ensureStaticAppInfo);
let _originalClientImplCalled = false;
exports._originalClientImplCalled = _originalClientImplCalled;
let mockAuth = false;

const createClientImpl = optionMiddleware => {
  exports._originalClientImplCalled = _originalClientImplCalled = true;

  const client = (url, options) => {
    const parsed = (0, _url.parseUrl)(url);

    if (parsed.hostname && parsed.hostname.match(/^api(-[a-z]{2}\d{1})?\.hubspot(qa)?\.com/)) {
      _metrics.Metrics.counter('hardcoded-api-hubspot-domain').increment();
    }

    return (0, _adapterUtils.withRetry)(Object.assign({}, options, {
      url
    }), o => optionMiddleware(o).catch(handleRequestErrors).then(essentialMiddleware).then(withOptions)).then(_adapterUtils.trackSuccess, response => Promise.reject((0, _adapterUtils.trackFailureBasedOnErrorResponse)(response)));
  };

  const responseWithMethod = method => (url, options) => client(url, Object.assign({}, options, {
    method
  }));

  const withMethod = method => (url, options) => responseWithMethod(method)(url, options).then(({
    data
  }) => data);

  return Object.assign(client, {
    get: withMethod('GET'),
    post: withMethod('POST'),
    put: withMethod('PUT'),
    patch: withMethod('PATCH'),
    delete: withMethod('DELETE'),
    options: withMethod('OPTIONS'),
    getWithResponse: responseWithMethod('GET'),
    postWithResponse: responseWithMethod('POST'),
    putWithResponse: responseWithMethod('PUT'),
    patchWithResponse: responseWithMethod('PATCH'),
    deleteWithResponse: responseWithMethod('DELETE'),
    optionsWithResponse: responseWithMethod('OPTIONS')
  });
};
/**
 * Should only be invoked by the fe test runner
 */


const enableMockAuth = () => {
  mockAuth = true;
};

exports.enableMockAuth = enableMockAuth;

var _default = optionMiddleware => createClientImpl((0, _index.createStack)((0, _mockAuth.setMockAuth)(mockAuth), optionMiddleware));

exports.default = _default;