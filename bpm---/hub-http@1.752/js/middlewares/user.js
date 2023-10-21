"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirectSuspendedUsers = exports.hubUserInfoEndpointTest = exports.shouldRedirectForSuspension = exports.portalIdBody = exports.retryOnError = exports.logoutOnUnauthorizedOrForbidden = exports.recyclePromise = void 0;

var _index = require("../index");

var _update = require("../helpers/update");

var _core = require("./core");

var _hubapi = require("./hubapi");

var _lab = require("./lab");

var _url = require("../helpers/url");

var _location = require("../helpers/location");

var _response = require("../helpers/response");

var _toggleable = _interopRequireDefault(require("../decorators/toggleable"));

var _iframe = require("../helpers/iframe");

const recycledResponse = response => response.xhr.readyState === 0 ? {
  status: response.status,
  statusText: response.statusText,
  data: response.data
} : response.xhr;

const withRecycledResponse = options => response => (0, _update.set)('externalResponse', recycledResponse(response))(options);

const recyclePromise = options => {
  if (options.recycledPromise) {
    return options.recycledPromise.then(withRecycledResponse(options), withRecycledResponse(options));
  } else {
    return options;
  }
};

exports.recyclePromise = recyclePromise;

const isUnauthorizedOrForbidden = response => response.status === 403 || response.status === 401;

const logoutOnUnauthorizedOrForbidden = options => {
  const parentWindow = (0, _iframe.maybeGetParentIframe)();

  if (parentWindow) {
    return (0, _iframe.notifyParentAndRejectOnStatuses)([401, 403], parentWindow, _iframe.UNAUTHORIZED_MESSAGE)(options);
  }

  return (0, _hubapi.logoutOn)(isUnauthorizedOrForbidden)(options);
};

exports.logoutOnUnauthorizedOrForbidden = logoutOnUnauthorizedOrForbidden;
const retryOnError = (0, _core.retry)(response => response.status !== 200 && !isUnauthorizedOrForbidden(response), {
  reason: 'Error fetching user data',
  maxRetries: 3,
  onMaxAttemptsReached: _hubapi.logoutOnError
});
exports.retryOnError = retryOnError;

const portalIdBody = options => (0, _update.set)('data', {
  portalId: options.portalId
})(options);

exports.portalIdBody = portalIdBody;

const buildForbiddenUrl = options => {
  const hostname = (0, _core.resolveApi)((0, _core.hubletApi)('app', 'hubspot'));
  const portalId = options.portalId || '';
  const dashboardDescriptor = {
    hostname,
    path: `/account-and-billing/${portalId}/forbidden`
  };
  return (0, _url.buildUrl)(dashboardDescriptor);
};

const redirectSuspendedHub = response => {
  const options = response.options;
  const redirectUrl = buildForbiddenUrl(options);
  return (0, _location.redirectTo)(redirectUrl, options) ? Promise.reject((0, _response.responseError)(response, 'Aborting: redirection in progress')) : response;
};

const shouldRedirectForSuspension = response => !!response.options && !response.options.allowSuspended && !!response.data && !!response.data.user && Array.isArray(response.data.user.scopes) && response.data.user.scopes.indexOf('suspended') !== -1;

exports.shouldRedirectForSuspension = shouldRedirectForSuspension;
const hubUserInfoEndpointTest = (0, _index.createStack)(options => (0, _core.withUrl)(url => {
  if (url.path === '/login-verify') {
    return Object.assign({}, url, {
      path: '/login-verify/hub-user-info'
    });
  }

  return url;
})(options), (0, _core.method)('GET'), options => (0, _lab.lab)('HUBONEDOMAIN', (0, _hubapi.maybeAddApiPathPrefix)((0, _core.environmentUrl)((0, _core.hubletApi)('app', 'hubspot', options.hubletOverride))), (0, _core.environmentUrl)((0, _core.hubletApi)('api', 'hubspot', options.hubletOverride)))(options), options => (0, _core.query)({
  portalId: options.portalId
})(options));
exports.hubUserInfoEndpointTest = hubUserInfoEndpointTest;
const redirectSuspendedUsers = (0, _toggleable.default)(isEnabled => options => {
  if (!isEnabled()) return options;
  return (0, _core.onResponse)(response => {
    if (shouldRedirectForSuspension(response)) {
      return redirectSuspendedHub(response);
    }

    return response;
  })(options);
});
exports.redirectSuspendedUsers = redirectSuspendedUsers;