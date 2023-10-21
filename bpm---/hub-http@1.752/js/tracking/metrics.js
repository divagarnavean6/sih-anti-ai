"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metrics = void 0;

var _metricsJs = require("metrics-js");

const Metrics = (0, _metricsJs.createMetricsFactory)('http', {
  library: 'hub-http'
});
exports.Metrics = Metrics;