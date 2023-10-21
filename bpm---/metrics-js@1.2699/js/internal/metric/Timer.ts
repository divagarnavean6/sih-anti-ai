"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timer = void 0;

var _Metric = require("./Metric");

function isThenable(obj) {
  return obj && typeof obj.then === 'function';
}
/**
 * `Timer`s track the duration of a given task over the reporting interval.
 * A `Timer` reports a collection of values, which a consumer can use to either
 * report on individually, or aggregate into summary metrics (e.g. p99). Common
 * timers might be the amount of time an event handler takes to run, or the
 * runtime duration of some expensive initialization code.
 *
 * This class should never be directly constructed, and `flush` should never be
 * called outside of the Daemon. Metric lifecycles should be fully managed by
 * a `Metrics` factory, Managing construction via a central factory allows us
 * to cache metric instances and avoid reporting conflicting values for the
 * same metric in the same reporting period.
 *
 * @example
 * const timer = new Timer('my-metric', {some_dimention: 'val'})
 * timer.update(performance.now() - startTime);
 * timer.time(() => handleEvent());
 * timer.time(() => fetchData(params)).then(processResponse);
 * timer.flush(); // { 'my-metric': [5, 6, 7] }
 */


class Timer extends _Metric.Metric {
  constructor(...args) {
    super(...args);
    this.values = [];
  }

  update(durationMs) {
    this.values.push(durationMs);
  }

  time(timed) {
    const start = performance.now();
    const result = timed();

    if (isThenable(result)) {
      return result.then(next => {
        this.update(performance.now() - start);
        return next;
      });
    }

    this.update(performance.now() - start);
    return result;
  }

  canFlush() {
    return this.values.length > 0;
  }

  flush() {
    const report = {
      name: this.getName(),
      type: 'TIMER',
      values: this.values.slice(),
      dimensions: this.getDimensions()
    };
    this.values = [];
    return report;
  }

}

exports.Timer = Timer;