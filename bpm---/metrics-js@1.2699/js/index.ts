"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createMetricsFactory", {
  enumerable: true,
  get: function () {
    return _createMetricsFactory.createMetricsFactory;
  }
});
Object.defineProperty(exports, "setBeaconApi", {
  enumerable: true,
  get: function () {
    return _metricsApi.setBeaconApi;
  }
});
Object.defineProperty(exports, "setStaticAppInfo", {
  enumerable: true,
  get: function () {
    return _metricsApi.setStaticAppInfo;
  }
});

var _trackMetricsLoaded = require("./internal/trackMetricsLoaded");

var _createMetricsFactory = require("./internal/createMetricsFactory");

var _metricsApi = require("./internal/metricsApi");

(0, _trackMetricsLoaded.trackMetricsLoaded)();