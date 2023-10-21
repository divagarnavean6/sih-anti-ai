"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureStaticAppInfo = exports.withStaticAppInfo = void 0;

var _core = require("./core");

var _url = require("../helpers/url");

var params = _interopRequireWildcard(require("../helpers/params"));

const formatVersion = version => {
  if (version == null) {
    return 'unknown';
  }

  if (version === 'static') {
    return 'dev';
  }

  return version.replace('static-', '');
};

const withStaticAppInfo = options => options.appInfo ? (0, _core.header)('X-HubSpot-Static-App-Info', `${options.appInfo.name}@${formatVersion(options.appInfo.version)}`)(options) : options;

exports.withStaticAppInfo = withStaticAppInfo;

const ensureStaticAppInfo = options => {
  if (!options.appInfo) return options;
  const queries = params.parse((0, _url.parseUrl)(options.url).query);
  return (0, _core.query)({
    hs_static_app: queries.hs_static_app || options.appInfo.name,
    hs_static_app_version: queries.hs_static_app_version || `${formatVersion(options.appInfo.version)}`
  })(options);
};

exports.ensureStaticAppInfo = ensureStaticAppInfo;