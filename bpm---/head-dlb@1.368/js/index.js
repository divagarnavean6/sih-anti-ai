"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("sporks!../bundles/before.js");

var _hsPromiseRejectionTracking = require("hs-promise-rejection-tracking");

var _hubspot = _interopRequireDefault(require("hubspot"));

var _enablePersistedShowEventHandler = _interopRequireDefault(require("./enablePersistedShowEventHandler"));

(0, _hsPromiseRejectionTracking.enableRejectionTracking)();
(0, _enablePersistedShowEventHandler.default)(); // `useGlobals` override to make sure these legacy modules don't create globals

_hubspot.default.modules.useGlobals = ns => ns !== 'raven-hubspot/configure' && ns !== 'PortalIdParser' && ns !== 'enviro'; // backwards compatibility legacy modules for use in script tags
// since we're generating simple manifests this `hubspot.define`
// won't get statically analyzed so that fixes the build error about
// 'raven-hubspot/configure' being provided by both head-dlb@dev
// and raven-hubspot@some-version
// currently sentry configuration logic depends on this being a legacy module


_hubspot.default.define('raven-hubspot/configure', [], () => {
  const ravenHubspotModule = require('raven-hubspot/configure');

  return ravenHubspotModule.default || ravenHubspotModule;
}); // `mixin newRelicRUMandErrorMonitoringJS` depends on this legacy module


_hubspot.default.define('PortalIdParser', [], () => {
  const PortalIdParserModule = require('PortalIdParser');

  return PortalIdParserModule.default || PortalIdParserModule;
}); // `mixin newRelicRUMandErrorMonitoringJS` and `hubspot-dlb` depend on this being a legacy module


_hubspot.default.define('enviro', [], () => {
  const enviroModule = require('enviro');

  return enviroModule.default || enviroModule;
}); // We use `defineProperty` to create the globals so we can have hook into tracking usage when we choose to deprecate
// backwards compatibility for libraries/apps that assume window.Raven.


Object.defineProperty(window, 'Raven', {
  get() {
    return require('raven-js');
  }

});
Object.defineProperty(window, 'enviro', {
  get() {
    const enviroModule = require('enviro');

    return enviroModule.default || enviroModule;
  }

});