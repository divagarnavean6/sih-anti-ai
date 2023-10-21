"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableMigrationCheckBypass = exports.redirectOnPortalMoved = exports.redirectOnMigrationInProgress = exports.redirectOn = exports.safeMode = exports.retry = exports.validateStatus = exports.reportOptionsError = exports.jsonResponse = exports.responseInterceptor = exports.onResponseError = exports.onResponse = exports.jsonBody = exports.bodyType = exports.hubletApi = exports.hubletSubdomainPostfix = exports.withApiAsOption = exports.environmentUrl = exports.httpsOnly = exports.withQuery = exports.query = exports.base = exports.header = exports.method = exports.defaultTo = exports.withOptions = exports.withUrl = exports.resolveApi = exports.validateOptions = exports.services = void 0;

var _enviro = _interopRequireDefault(require("enviro"));

var _index = require("../index");

var _update = require("../helpers/update");

var _response = require("../helpers/response");

var _url = require("../helpers/url");

var params = _interopRequireWildcard(require("../helpers/params"));

var headers = _interopRequireWildcard(require("../helpers/headers"));

var _authMocked = require("../helpers/authMocked");

var _iframe = require("../helpers/iframe");

var _location = require("../helpers/location");

// defensive over accessing localStorage because http://meyerweb.com/eric/thoughts/2012/04/25/firefox-failing-localstorage/
const getLocalStorage = () => {
  try {
    return window.localStorage;
  } catch (error) {
    return undefined;
  }
};

const getAppInfo = () => {
  return window.hubspot && window.hubspot.bender ? {
    name: window.hubspot.bender.currentProject,
    version: window.hubspot.bender.currentProjectVersion
  } : null;
};

const services = options => Object.assign({
  location: window.location,
  cookies: window.document.cookie,
  localStorage: getLocalStorage(),
  document: window.document,
  appInfo: getAppInfo()
}, options);

exports.services = services;

const validateOptions = (validator, errorMessage) => options => {
  if (!validator || typeof validator !== 'function') {
    throw new Error('validator must be a function');
  }

  if (!validator(options)) throw new Error(errorMessage);
  return options;
};

exports.validateOptions = validateOptions;

const resolveApi = api => {
  const environment = _enviro.default.getShort('hub-http');

  const location = environment === 'local' ? 'local' : 'deployed';
  const hostname = api[location] ? api[location][environment] : null;

  if (!hostname) {
    throw new Error(`No hostname defined for environment ${environment} and ${location}`);
  }

  return hostname;
};

exports.resolveApi = resolveApi;
const parsedUrl = Symbol('url'); // ensures consistant handling of the parsed url object when making url modifications
// without losing information

const withUrl = urlMutator => options => {
  let descriptor = options[parsedUrl] || (0, _url.parseUrl)(options.url);
  descriptor = urlMutator(descriptor);
  options = (0, _update.set)(parsedUrl, descriptor)(options);
  options = (0, _update.set)('url', (0, _url.buildUrl)(descriptor))(options);
  return options;
};

exports.withUrl = withUrl;

const withOptions = (options, newOptions) => {
  return Object.assign({}, options, newOptions);
}; // TODO: REVIEW


exports.withOptions = withOptions;

const fromInput = (propertyName, options) => {
  /**
   * If options.input exists, this is a composed middleware's options, and we want to check if
   * the initial arguments had the property name. Otherwise, there's only one middleware
   * current options === initial options.
   */
  const input = options && options._input ? options._input : options;
  return input[propertyName] !== undefined ? input[propertyName] : undefined;
};

const defaultTo = (propertyName, value) => options => fromInput(propertyName, options) === undefined ? (0, _update.set)(propertyName, value)(options) : options;

exports.defaultTo = defaultTo;

const method = verb => defaultTo('method', verb);

exports.method = method;

const header = (name, value, override) => options => {
  return override || headers.getHeader(name, options) === undefined ? headers.setHeader(name, value, options) : options;
};

exports.header = header;

const base = baseUrl => options => (0, _update.set)('url', baseUrl + options.url)(options);

exports.base = base;
const initialQuery = Symbol('initialQuery');
const notOverridableQuery = Symbol('noOverrideQuery');
const overridableQuery = Symbol('overrideQuery');

const query = (obj, allowOverride = true) => {
  return withUrl(url => {
    let descriptor = url;

    if (typeof descriptor[initialQuery] === 'undefined') {
      descriptor = (0, _update.set)(initialQuery, url.query || '')(descriptor);
    }

    const [key, baseObj, superset] = allowOverride ? [overridableQuery, descriptor[overridableQuery], obj] : [notOverridableQuery, obj, descriptor[notOverridableQuery]];
    descriptor = (0, _update.setIn)([key], Object.assign({}, baseObj, {}, superset))(descriptor);
    return (0, _update.set)('query', [descriptor[initialQuery], params.stringify(Object.assign({}, descriptor[overridableQuery], {}, descriptor[notOverridableQuery]))].filter(Boolean).join('&'))(descriptor);
  });
};

exports.query = query;

const withQuery = options => query(options.query, false)(options);

exports.withQuery = withQuery;
const httpsOnly = withUrl((0, _update.set)('protocol', 'https'));
exports.httpsOnly = httpsOnly;

const environmentUrl = defaultApi => options => withUrl(url => {
  if (!url.protocol && options.location) {
    url.protocol = options.location.protocol.slice(0, -1);
  }

  if (!url.hostname) {
    const api = options.api || defaultApi;
    url.hostname = resolveApi(api);
  }

  return url;
})(options);

exports.environmentUrl = environmentUrl;

const withApiAsOption = options => {
  if (!options.api) {
    throw new Error('Missing api option. Expected api object (you can create one with the hubletApi function');
  }

  return environmentUrl(null)(options);
};

exports.withApiAsOption = withApiAsOption;

const hubletSubdomainPostfix = hubletOverride => {
  if (hubletOverride && hubletOverride !== 'na1') {
    return `-${hubletOverride}`;
  }

  const currentHublet = _enviro.default.getHublet();

  if (currentHublet === 'na1' || hubletOverride === 'na1') {
    return '';
  }

  return `-${currentHublet}`;
};

exports.hubletSubdomainPostfix = hubletSubdomainPostfix;

const hubletApi = (name, domainPrefix, hubletOverride) => {
  const targetHublet = hubletSubdomainPostfix(hubletOverride);
  return {
    local: {
      qa: `local${targetHublet}.${domainPrefix}qa.com`,
      prod: `local${targetHublet}.${domainPrefix}.com`
    },
    deployed: {
      qa: `${name}${targetHublet}.${domainPrefix}qa.com`,
      prod: `${name}${targetHublet}.${domainPrefix}.com`
    }
  };
};

exports.hubletApi = hubletApi;

const bodyType = (contentType, stringifyFn) => options => {
  options = header('content-type', contentType)(options);

  if (options.rawData) {
    options.data = options.rawData;
  } else if (typeof stringifyFn === 'function' && headers.getHeader('content-type', options) === contentType) {
    options.data = stringifyFn(options.data);
  }

  return options;
};

exports.bodyType = bodyType;

const jsonBody = options => // null will stringify to "null", whereas undefined will stringify to ""
// (a body with content-length: 0), which is invalid json.
options.data !== undefined || options.rawData !== undefined ? bodyType('application/json', JSON.stringify)(options) : options;

exports.jsonBody = jsonBody;

const wrapResponseHandler = handler => response => {
  try {
    return handler(response);
  } catch (error) {
    error.response = response;
    throw error;
  }
};

const onResponse = handler => (0, _response.handleResponse)(response => response.then(wrapResponseHandler(handler)));

exports.onResponse = onResponse;

const onResponseError = handler => (0, _response.handleResponse)(response => response.catch(wrapResponseHandler(handler)));

exports.onResponseError = onResponseError;

const responseInterceptor = (handler, alwaysRejectOnCatch = true) => (0, _response.handleResponse)(response => response.then(wrapResponseHandler(handler), r => alwaysRejectOnCatch ? Promise.reject(handler(r)) : handler(r)));

exports.responseInterceptor = responseInterceptor;

const getContentType = response => {
  if (!response || !response.headers) return '';
  return headers.getHeader('content-type', response) || '';
};

const jsonResponse = (0, _index.createStack)(header('Accept', 'application/json, text/javascript, */*; q=0.01'), onResponse(response => (0, _update.setIf)(typeof response.data === 'string' && getContentType(response).indexOf('application/json') === 0, 'data', () => response.data.length ? JSON.parse(response.data) : undefined)(response)));
exports.jsonResponse = jsonResponse;
const reportOptionsError = onResponse(response => {
  if (response.errorCode === 'OPTIONSERROR') {
    return Promise.reject((0, _response.responseError)(response, `hub-http error building request options: ${response.options.error.message}`));
  }

  return response;
});
exports.reportOptionsError = reportOptionsError;

const addQueryParamToResponseError = (response, url) => {
  const error = (0, _response.responseError)(response, `Request for ${url.split('?')[0]} failed with status ${response.status}. ${response.statusText || ''}`);
  error._hsAdditionalProperties = {
    queryParamsString: url.split('?')[1]
  };
  return error;
};

const validateStatus = options => onResponse(response => response.status >= 200 && response.status < 300 ? response : Promise.reject(addQueryParamToResponseError(response, options.url)))(options);

exports.validateStatus = validateStatus;

const retry = (predicate, {
  reason,
  maxRetries = 1,
  delay = 250,
  onMaxAttemptsReached
} = {}) => options => {
  const interceptor = response => {
    if (predicate(response)) {
      const responseWithRetryInfo = (0, _update.set)('retry', {
        reason,
        maxRetries,
        delay,
        exceededRetries: response.options.retryAttempts >= maxRetries
      })(response);
      return Promise.reject((0, _response.responseError)(responseWithRetryInfo, `Request for ${options.url} failed with status ${response.status}. ${response.statusText || ''}`));
    }

    return response;
  };

  if (maxRetries === 0) {
    // Make the retry middleware a no-op
    return options;
  } else {
    // Intercept the current response to do retries
    const responseMiddleware = options.retryAttempts >= maxRetries && typeof onMaxAttemptsReached === 'function' ? (0, _index.createStack)(onResponse(interceptor), onMaxAttemptsReached) : onResponse(interceptor);
    return responseMiddleware(options);
  }
};

exports.retry = retry;
const safeMode = (0, _update.set)('safeMode', true);
exports.safeMode = safeMode;

const redirectOn = (predicate, redirectLocation) => options => onResponse(response => {
  if (predicate(response)) {
    let redirectLocationString;

    try {
      if (typeof redirectLocation === 'function') {
        redirectLocationString = redirectLocation(response);
      } else {
        redirectLocationString = redirectLocation;
      }

      (0, _location.redirectTo)(redirectLocationString, response.options);
      return Promise.reject((0, _response.responseError)(response, 'Aborting: redirection in progress'));
    } catch (__error) {
      return Promise.reject((0, _response.responseError)(response, 'Aborting: status indicates redirect required, but redirect URL could not be formed'));
    }
  }

  return response;
})(options);

exports.redirectOn = redirectOn;

const redirectOnMigrationInProgress = options => {
  if (options.skipMigrationCheck || (0, _authMocked.isAuthMocked)(options)) {
    return options;
  }

  const parentWindow = (0, _iframe.maybeGetParentIframe)();

  if (parentWindow) {
    return (0, _iframe.notifyParentAndRejectOnStatuses)([477], parentWindow, _iframe.MIGRATION_IN_PROGRESS_MESSAGE)(options);
  }

  return redirectOn(response => response.status === 477, (0, _url.buildUrl)({
    hostname: resolveApi(hubletApi('app', 'hubspot')),
    path: `/data-transfer-status/${options.portalId}/`
  }))(options);
};

exports.redirectOnMigrationInProgress = redirectOnMigrationInProgress;

const redirectOnPortalMoved = options => {
  if ((0, _authMocked.isAuthMocked)(options)) {
    return options;
  }

  const parentWindow = (0, _iframe.maybeGetParentIframe)();

  if (parentWindow) {
    return (0, _iframe.notifyParentAndRejectOnStatuses)([488], parentWindow, _iframe.PORTAL_MOVED_MESSAGE)(options);
  }

  return redirectOn(response => response.status === 488, response => {
    const correctHublet = headers.getHeader('x-hubspot-correct-hublet', response);

    if (!correctHublet) {
      throw new Error('488 response missing X-Hubspot-Correct-Hublet header');
    }

    const location = options.location;
    return (0, _url.buildUrl)({
      // a UrlDescriptor and a Location have totally different shapes and rules.
      protocol: location.protocol && location.protocol.endsWith(':') ? location.protocol.slice(0, -1) : location.protocol,
      port: location.port,
      path: location.pathname,
      query: location.search !== '' ? location.search.substring(1) : undefined,
      hash: location.hash !== '' ? location.hash : undefined,
      hostname: resolveApi(hubletApi((0, _url.parseHostname)(options.location).loadBalancerBase || 'app', 'hubspot', correctHublet))
    });
  })(options);
};

exports.redirectOnPortalMoved = redirectOnPortalMoved;

const enableMigrationCheckBypass = options => {
  if ((0, _authMocked.isAuthMocked)(options)) {
    return options;
  }

  return query({
    skipMigrationCheck: options.skipMigrationCheck
  }, false)(options);
};

exports.enableMigrationCheckBypass = enableMigrationCheckBypass;