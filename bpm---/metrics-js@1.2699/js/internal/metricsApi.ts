"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._sendBeacon = _sendBeacon;
exports.setBeaconApi = setBeaconApi;
exports.setStaticAppInfo = setStaticAppInfo;
exports.send = send;

var _enviro = _interopRequireDefault(require("enviro"));

var _getGlobal = require("./getGlobal");

// need to support the React Native globalThis
let _customSendBeaconFn;

function _sendBeacon(url, data) {
  const global = (0, _getGlobal.getGlobal)();

  if (_customSendBeaconFn) {
    return _customSendBeaconFn(url, data);
  }

  return global.navigator && global.navigator.sendBeacon(url, data);
}

function sendBeacon(url, data = '') {
  if (!_sendBeacon) {
    return;
  }

  try {
    _sendBeacon(url, data);
  } catch (___err) {// drop errors
  }
}

function setBeaconApi(beaconFn) {
  _customSendBeaconFn = beaconFn;
}

const staticAppInfo = {
  package: (0, _getGlobal.getHubSpot)() && (0, _getGlobal.getHubSpot)().bender && (0, _getGlobal.getHubSpot)().bender.currentProject || 'unknown',
  version: (0, _getGlobal.getHubSpot)() && (0, _getGlobal.getHubSpot)().bender && (0, _getGlobal.getHubSpot)().bender.currentProjectVersion || 'unknown'
};

function setStaticAppInfo(newInfo) {
  Object.assign(staticAppInfo, newInfo);
}

function getMetricsUrl() {
  return `https://metrics-fe-${_enviro.default.getHublet()}.hubspot${_enviro.default.isQa() ? 'qa' : ''}.com/metrics/v1/frontend/custom/send?hs_static_app=${staticAppInfo.package}&hs_static_app_version=${staticAppInfo.version}`;
}

function send(metricReports) {
  if (!_enviro.default.deployed('METRICS')) {
    if (_enviro.default.debug('METRICS')) {
      console.log('[metrics-js] Dropping local datapoint', metricReports);
    }

    return;
  }

  if (_enviro.default.debug('METRICS')) {
    console.log('[metrics-js] Datapoint sent', metricReports);
  }

  sendBeacon(getMetricsUrl(), JSON.stringify(metricReports));
}