"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runMetricsDaemon = runMetricsDaemon;

var _MetricsDaemon = require("./MetricsDaemon");

function runMetricsDaemon() {
  const daemonInstance = _MetricsDaemon.MetricsDaemon.instance();

  daemonInstance.run();
  return daemonInstance;
}