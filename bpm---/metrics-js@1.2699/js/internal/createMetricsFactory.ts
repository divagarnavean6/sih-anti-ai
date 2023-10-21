"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMetricsFactory = createMetricsFactory;

var _initErrorMetrics = require("./daemon/initErrorMetrics");

var _runMetricsDaemon = require("./daemon/runMetricsDaemon");

var _MetricsFactory = require("./MetricsFactory");

function createMetricsFactory(namespace, options = {}) {
  if (!namespace) {
    throw new Error('[metrics-js] A namespace is required for a Metrics factory.');
  }

  (0, _runMetricsDaemon.runMetricsDaemon)();
  (0, _initErrorMetrics.initErrorMetrics)();
  const dimensions = options.dimensions || {};

  if (options.library) {
    dimensions.fe_library = options.library;
  }

  return new _MetricsFactory.MetricsFactory(namespace, dimensions);
}