"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$SessionCounter = exports.MetricsFactory = void 0;

var _MetricsDaemon = require("./daemon/MetricsDaemon");

var _Counter = require("./metric/Counter");

var _Histogram = require("./metric/Histogram");

var _SessionCounter = require("./metric/SessionCounter");

var _Timer = require("./metric/Timer");

const $SessionCounter = Symbol('SessionCounter');
exports.$SessionCounter = $SessionCounter;

class MetricsFactory {
  constructor(namespace, globalDimensions = {}) {
    this.namespace = namespace;
    this.globalDimensions = globalDimensions;
  }

  namespaceMetric(name) {
    return `${this.namespace}.${name}`;
  }

  counter(name, dimensions = {}) {
    return _MetricsDaemon.MetricsDaemon.instance().getMetric(this.namespaceMetric(name), Object.assign({}, this.globalDimensions, {}, dimensions), _Counter.Counter);
  }
  /**
   * SessionCounters have some nuance that make them challenging to use
   * correctly. For now, we access them via a Symbol to avoid external
   * consumers accessing this API.
   * @internal
   */


  [$SessionCounter](name, dimensions = {}) {
    return _MetricsDaemon.MetricsDaemon.instance().getMetric(this.namespaceMetric(name), Object.assign({}, this.globalDimensions, {}, dimensions), _SessionCounter.SessionCounter);
  }

  histogram(name, dimensions = {}) {
    return _MetricsDaemon.MetricsDaemon.instance().getMetric(this.namespaceMetric(name), Object.assign({}, this.globalDimensions, {}, dimensions), _Histogram.Histogram);
  }

  timer(name, dimensions = {}) {
    return _MetricsDaemon.MetricsDaemon.instance().getMetric(this.namespaceMetric(name), Object.assign({}, this.globalDimensions, {}, dimensions), _Timer.Timer);
  }

}

exports.MetricsFactory = MetricsFactory;