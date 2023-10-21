import CartographerReporter from './CartographerReporter';
import performanceNow from '../../vendor/performanceNow';
import { MemoryMetrics } from '../Metrics';

const getDOMTreeHeight = () => {
  let i = 1;
  let sel = '* > *';
  /* html > body is always present */

  while (document.querySelector(sel)) {
    sel += ' > *';
    i++;
  }

  return i;
};

export const MAX_REPORT_INTERVAL_MILLIS = 4 * 60 * 1000;
export default class MemoryReporter extends CartographerReporter {
  constructor(options) {
    super(options);
    this.resolved = {};
    this.stopped = false;
    this.candidate = false; // Only collect measurements for a random 10% of reporter sessions, or if in debug mode

    if (Math.random() < 0.1 || this.debug) {
      this.candidate = true;
    } // @ts-expect-error lib.dom.ts omits memory from Performance type


    if (!this.candidate || !performance.memory) {
      return;
    }

    const scheduleCollection = () => {
      // collect memory usage with uniform random distribution at least once per MAX_REPORT_INTERVAL
      const scheduleNext = Math.random() * MAX_REPORT_INTERVAL_MILLIS;
      this.timeout = setTimeout(() => {
        // stop collection if Rhumb hits stop conditions or if session runs longer than one hour
        if (this.stopped || performanceNow() > 60 * 60 * 1000) {
          return;
        } // Don't take an immediate sample on load (would skew data). Wait for the first timeout to elapse


        if (this.timeout) {
          this.collectMemoryUsage();
        }

        scheduleCollection();
      }, scheduleNext);
    };

    scheduleCollection(); // Send memory usage performance actions when we have at minimum 2 measurements

    this.flushingInterval = setInterval(() => {
      if (this.stopped) {
        clearInterval(this.flushingInterval);
      }

      this.flushPerformanceQueue();
    }, 2 * MAX_REPORT_INTERVAL_MILLIS);
  }

  collectMemoryUsage() {
    const usedMemBytes = performance.memory.usedJSHeapSize;
    this.pushPerformanceAction(this.lastRouteInfo, 'memory', {
      usedMemBytes,
      elapsedMs: performanceNow(),
      numOfDOMNodes: document.getElementsByTagName('*').length,
      depthOfDOMTree: getDOMTreeHeight()
    });
    MemoryMetrics.histogram('used-bytes', {
      scenario: this.lastRouteInfo && this.lastRouteInfo.scenario || 'unknown'
    }).update(usedMemBytes);
  }

  report(action) {
    // @ts-expect-error lib.dom.ts omits memory from Performance type
    if (!this.candidate || !performance.memory) {
      return;
    }

    if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] || this.stopped) {
      return;
    }

    switch (action.type) {
      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          const {
            routeSpec: {
              route
            }
          } = action.payload;
          this.lastRouteInfo = {
            route
          };
          break;
        }

      case 'ROUTE_FAILED':
        {
          const {
            entry: {
              pathname
            },
            routeSpec
          } = action.payload;
          const {
            route
          } = routeSpec;
          this.lastRouteInfo = {
            pathname,
            route
          };
          break;
        }

      case 'ROUTE_SUCCEEDED':
        {
          const {
            entry: {
              pathname
            },
            extra: {
              scenario
            },
            routeSpec
          } = action.payload;
          const {
            route
          } = routeSpec;
          this.lastRouteInfo = {
            pathname,
            route,
            scenario
          };
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

      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_FAILED':
        {
          this.resolved[action.payload.entry.id] = true;
          break;
        }

      default:
    }
  }

}