"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryOnError = exports.logoutOnMissingPortalId = exports.logoutOnUnauthorized = exports.logoutOn = exports.logoutOnError = exports.timeoutInQuery = exports.setRequest = exports.maybeUseIframeRequest = exports.hubapi = exports.maybeAddApiPathPrefix = exports.defaults = void 0;

var _params = require("../helpers/params");

var _url = require("../helpers/url");

var _core = require("./core");

var _lab = require("./lab");

var _iframe = require("../helpers/iframe");

var _response = require("../helpers/response");

var _location = require("../helpers/location");

var _authCache = _interopRequireDefault(require("../helpers/authCache"));

var _update = require("../helpers/update");

var _authMocked = require("../helpers/authMocked");

var _headers = require("../helpers/headers");

const defaults = options => Object.assign({}, {
  timeout: 14000,
  withCredentials: true,
  portalId: window.hubspot && window.hubspot.portal && window.hubspot.portal.id,
  labs: window.hubspot && window.hubspot['__hub-http-labs']
}, options);

exports.defaults = defaults;

const maybeAddApiPathPrefix = middleware => options => middleware((0, _core.withUrl)(url => {
  // If someone has passed a full url or is passing their own API option we won't modify it.
  if (url.hostname || options.api) {
    return url;
  }

  let path = url.path;

  if (path.startsWith('/api/') || path.startsWith('api/')) {
    return url;
  } else if (path.startsWith('/')) {
    path = `/api${path}`;
  } else {
    path = `/api/${path}`;
  }

  url.path = path;
  return url;
})(options));

exports.maybeAddApiPathPrefix = maybeAddApiPathPrefix;
const hubapi = (0, _lab.lab)('HUBONEDOMAIN', maybeAddApiPathPrefix((0, _core.environmentUrl)((0, _core.hubletApi)('app', 'hubspot'))), (0, _core.environmentUrl)((0, _core.hubletApi)('api', 'hubspot')));
exports.hubapi = hubapi;

const maybeUseIframeRequest = options => {
  if ((0, _authMocked.isAuthMocked)(options)) {
    return options;
  }

  const {
    hostname
  } = (0, _url.parseUrl)(options.url);
  const useIframeRequest = hostname.indexOf(`api${(0, _core.hubletSubdomainPostfix)()}.hubspot`) === 0;
  return (0, _update.set)('useIframeRequest', useIframeRequest)(options);
};

exports.maybeUseIframeRequest = maybeUseIframeRequest;
const setRequest = maybeUseIframeRequest;
exports.setRequest = setRequest;

const timeoutInQuery = options => !(0, _authMocked.isAuthMocked)(options) && typeof options.timeout === 'number' ? (0, _core.query)({
  clienttimeout: options.timeout
})(options) : options;

exports.timeoutInQuery = timeoutInQuery;

const buildLogoutUrl = (options, headers) => {
  const hostname = (0, _core.resolveApi)((0, _core.hubletApi)('app', 'hubspot'));
  const loginDescriptor = {
    hostname,
    path: options.loginPathOverride || '/login/'
  };
  const loginQuery = {
    loginRedirectUrl: options.location.href
  };

  if (headers && headers['x-hubspot-auth-failure']) {
    Object.assign(loginQuery, {
      authFailureReason: headers['x-hubspot-auth-failure']
    });
  }

  if (options.portalId) {
    loginQuery.loginPortalId = options.portalId;
  }

  loginDescriptor.query = (0, _params.stringify)(loginQuery);
  return (0, _url.buildUrl)(loginDescriptor);
};

const onRedirectToLogin = options => _authCache.default.clear(options);

const handleLogoutFromRequest = options => {
  const redirectUrl = buildLogoutUrl(options);

  if ((0, _location.redirectTo)(redirectUrl, options, onRedirectToLogin)) {
    throw new Error('Aborting: redirection in progress');
  }

  return options;
};

const handleLogoutFromResponse = response => {
  const options = response.options;
  const redirectUrl = buildLogoutUrl(options, response.headers);
  (0, _location.redirectTo)(redirectUrl, options, onRedirectToLogin);
  return Promise.reject((0, _response.responseError)(response, 'Aborting: redirection in progress'));
};

const logoutOnError = (0, _core.onResponseError)(handleLogoutFromResponse);
exports.logoutOnError = logoutOnError;

const logoutOn = predicate => options => (0, _core.onResponse)(response => {
  if (predicate(response)) {
    return handleLogoutFromResponse(response);
  }

  return response;
})(options);

exports.logoutOn = logoutOn;

const isUnauthorizedAndAuthFailure = response => response.status === 401 && !!(0, _headers.getHeader)('x-hubspot-auth-failure', response);

const logoutOnUnauthorized = options => {
  if ((0, _authMocked.isAuthMocked)(options)) {
    return options;
  }

  const parentWindow = (0, _iframe.maybeGetParentIframe)();

  if (parentWindow) {
    return (0, _iframe.notifyParentAndRejectOnStatuses)([401], parentWindow, _iframe.UNAUTHORIZED_MESSAGE)(options);
  }

  return logoutOn(isUnauthorizedAndAuthFailure)(options);
};

exports.logoutOnUnauthorized = logoutOnUnauthorized;

const logoutOnMissingPortalId = options => {
  if (!options.portalId) {
    // eslint-disable-next-line no-console
    console.log('[hub-http] Could not find portal id. Redirecting');
    return handleLogoutFromRequest(options);
  }

  return options;
};

exports.logoutOnMissingPortalId = logoutOnMissingPortalId;
const retryOnError = (0, _core.retry)(response => response.options.method === 'GET' && (response.status >= 500 || response.status === 0 && response.errorCode === 'NETWORKERROR'), {
  reason: 'Server error'
});
exports.retryOnError = retryOnError;