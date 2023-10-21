import CartographerReporter, { THIRTY_SECONDS } from './CartographerReporter';
import { onVisibilityChange, visibilityState } from '../visibility';
import { PageLoadMetrics } from '../Metrics';
export default class InAppReporter extends CartographerReporter {
  constructor(options) {
    super(options);
    this.resolved = {};
    this.stopped = false;
    this.flushQueueTimeout = undefined;
    this.currentActionStartTimestamp = null;
    this.previousNavigationAction = null;
    this.wasHidden = visibilityState() === 'hidden';
    onVisibilityChange(state => {
      if (state === 'hidden' && !this.wasHidden) {
        this.wasHidden = true;
      }
    });
  }

  pushInAppNavigationAction(routeInfo, status, wasHidden, isHidden, duration) {
    if (this.previousNavigationAction) {
      this.pushNavigationAction(routeInfo, this.previousNavigationAction, status, wasHidden, isHidden, duration);
    }

    this.previousNavigationAction = routeInfo;
  }

  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] || this.stopped) {
      return;
    }

    switch (action.type) {
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_FAILED':
        {
          const {
            entry,
            routeSpec
          } = action.payload;
          const {
            pathname,
            checks,
            expiredTimestamp
          } = entry;
          const {
            route,
            error
          } = routeSpec;

          if (!this.wasHidden) {
            if (action.type === 'ROUTE_FAILED') {
              PageLoadMetrics.counter('transition-failed').increment();
            } else {
              PageLoadMetrics.counter('transition-timeouts').increment();
            }
          }

          this.pushInAppNavigationAction({
            pathname,
            route,
            scenario: action.type === 'ROUTE_FAILED' && error ? error.join(',') : action.type
          }, 'failure', this.wasHidden, visibilityState() === 'hidden', action.type === 'ROUTE_FAILED' ? this.toDuration(checks, this.currentActionStartTimestamp, error) : expiredTimestamp - this.currentActionStartTimestamp);
          break;
        }

      case 'ROUTE_SUCCEEDED':
        {
          const {
            entry,
            routeSpec,
            extra
          } = action.payload;
          const {
            pathname,
            checks
          } = entry;
          const {
            route
          } = routeSpec;
          const {
            scenario
          } = extra;
          const markers = routeSpec.success[scenario] || '';
          const duration = this.toDuration(checks, this.currentActionStartTimestamp, markers);

          if (!this.wasHidden) {
            PageLoadMetrics.timer('transition-succeeded', {
              scenario
            }).update(duration);
          }

          this.pushInAppNavigationAction({
            pathname,
            route,
            scenario: scenario || markers.join(',')
          }, 'success', this.wasHidden, visibilityState() === 'hidden', duration);
          break;
        }

      default:
    }

    switch (action.type) {
      case 'ROUTE_UNEXPECTED':
        {
          this.stopped = true;
          break;
        }

      case 'ROUTE_STARTED':
        {
          const {
            entry
          } = action.payload;
          const {
            timestamp
          } = entry;
          this.currentActionStartTimestamp = this.currentActionStartTimestamp || timestamp;
          break;
        }

      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_FAILED':
        {
          this.currentActionStartTimestamp = null;
          this.resolved[action.payload.entry.id] = true;
          clearTimeout(this.flushQueueTimeout);
          this.flushQueueTimeout = setTimeout(() => {
            this.flushNavigationQueue();
          }, THIRTY_SECONDS);
          break;
        }

      default:
    }
  }

}