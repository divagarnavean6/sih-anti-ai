"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionCounter = void 0;

var _Counter = require("./Counter");

/**
 * `SessionCounter`s are a special type of Histogram. Theoretically the
 * intent of a SessionCounter is to be able to do maximum or percentile
 * calculations for a numeric data point that is incremented over the duration
 * of a user's session. Because the value increments over time, using a plain
 * Histogram isn't viable; there's no way to update already-recorded values in
 * Histograms.
 *
 * However, because Counters' individual data points are not reported anywhere,
 * only aggregate summary values for each metric reporter instance, performing
 * those calculations in SignalFx/MaaS on a Counter type metric is impossible
 * as well, so where does that leave us?
 *
 * The math we _want_ to do with this data needs the behavior of a Counter, but
 * its reporting requirements much more closely align with a Histogram. As
 * such, we have this odd implementation where we record values as a Counter
 * but then report the data's type as a `HISTOGRAM` so the backend performs our
 * percentile calculations for us, allowing us to meaningfully alert on these
 * values.
 *
 * This class should never be directly constructed, and `flush` should never be
 * called outside of the Daemon. Metric lifecycles should be fully managed by
 * a `Metrics` factory, Managing construction via a central factory allows us
 * to cache metric instances and avoid reporting conflicting values for the
 * same metric in the same reporting period.
 *
 * @example
 * const counter = new SessionCounter('my-metric');
 * counter.increment(3);
 * counter.flush(); // { name: 'my-metric', values: [3], type: 'HISTOGRAM', dimensions: {} }
 *
 * @protected This class should only be used internally in `metrics-js`.
 */
class SessionCounter extends _Counter.Counter {
  canFlush(endOfSession) {
    return endOfSession;
  }

  flush() {
    const baseReport = super.flush();
    baseReport.type = 'HISTOGRAM';
    return baseReport;
  }

}

exports.SessionCounter = SessionCounter;