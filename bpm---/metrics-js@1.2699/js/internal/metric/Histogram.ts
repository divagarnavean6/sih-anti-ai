"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Histogram = void 0;

var _Metric = require("./Metric");

/**
 * `Histogram`s track percentile buckets based on the reported values.
 * A `Histogram` reports a collection of values, which a consumer can use to
 * either report on individually, or aggregate into summary metrics (e.g. p99).
 * Common histograms might be the number of objects a user is loading on a
 * page, or the number of times that a component re-renders.
 *
 * This class should never be directly constructed, and `flush` should never be
 * called outside of the Daemon. Metric lifecycles should be fully managed by
 * a `Metrics` factory, Managing construction via a central factory allows us
 * to cache metric instances and avoid reporting conflicting values for the
 * same metric in the same reporting period.
 *
 * @example
 * const histogram = new Histogram('my-metric', {some_dimention: 'val'})
 * histogram.update(9);
 * histogram.flush(); // { 'my-metric': [9] }
 */
class Histogram extends _Metric.Metric {
  constructor(...args) {
    super(...args);
    this.values = [];
  }

  update(value) {
    this.values.push(value);
  }

  canFlush() {
    return this.values.length > 0;
  }

  flush() {
    const report = {
      name: this.getName(),
      type: 'HISTOGRAM',
      values: this.values.slice(),
      dimensions: this.getDimensions()
    };
    this.values = [];
    return report;
  }

}

exports.Histogram = Histogram;