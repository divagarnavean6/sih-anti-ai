"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Counter = void 0;

var _Metric = require("./Metric");

/**
 * `Counter`s track the number of occurrences of a given event over the
 * reporting interval. Common usecases are logging the number of times
 * a user clicks a button or the number of HTTP requests made.
 *
 * This class should never be directly constructed, and `flush` should never be
 * called outside of the Daemon. Metric lifecycles should be fully managed by
 * a `Metrics` factory, Managing construction via a central factory allows us
 * to cache metric instances and avoid reporting conflicting values for the
 * same metric in the same reporting period.
 *
 * @example
 * const counter = new Counter('my-metric', {some_dimension: 'val'});
 * counter.increment();
 * counter.increment(3);
 * counter.decrement(2);
 * counter.flush(); // { 'my-metric.count': 2 }
 */
class Counter extends _Metric.Metric {
  constructor(...args) {
    super(...args);
    this.count = 0;
    this.hasUpdated = false;
  }

  safeStep(step) {
    if (typeof step !== 'number' || step % 1 === 0) {
      this.hasUpdated = true;
      this.count += step;
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[metrics-js] Counter ${this.getName()} received a non-integer value (${step}).

Counters can only record whole number increments. They should be used to track the frequency
of a recurring action taken by a user or your code. To aggregate other quantitative data
please use NewRelic's custom attributes or custom actions. If you have further questions
please reach out in #frontend-platform-support.`);
      }
    }
  }

  increment(step = 1) {
    this.safeStep(step);
  }

  decrement(step = 1) {
    this.safeStep(step * -1);
  }

  canFlush(__endOfSession = false) {
    // we can't just check this.count === 0 because it's possible for a counter
    // to be called with both `increment` and `decrement` in the same reporting
    // in which case the reporting code may find that value significant
    return this.hasUpdated;
  }

  flush() {
    const report = {
      name: this.getName(),
      values: [this.count],
      type: 'COUNTER',
      dimensions: this.getDimensions()
    };
    this.count = 0;
    this.hasUpdated = false;
    return report;
  }

}

exports.Counter = Counter;