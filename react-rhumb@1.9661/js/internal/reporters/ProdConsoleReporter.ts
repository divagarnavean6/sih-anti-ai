import BaseReporter from './BaseReporter';
export default class ProdConsoleReporter extends BaseReporter {
  constructor(options) {
    super(options);
    this.resolved = {};
  }

  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] && action.type !== 'CHECKS_CHANGED') {
      return;
    }

    const {
      entry: {
        pathname,
        timestamp,
        expiredTimestamp,
        checks,
        id
      },
      routeSpec
    } = action.payload;

    if (!this.debug) {
      return;
    }

    const log = (...args) => console.log(`[${this.libName}]`, pathname, ...args);

    const formatDuration = num => `${num.toFixed(2)}ms`;

    const logIfOffset = duration => {
      if (this.options.timingOffset) {
        log(`adjusted: ${formatDuration(duration + this.options.timingOffset)} (offset ${this.options.timingOffset})`);
      }
    };

    switch (action.type) {
      case 'ROUTE_STARTED':
        {
          const {
            route
          } = routeSpec;
          log(`(${route})`);
          break;
        }

      case 'ROUTE_UNEXPECTED':
        {
          log(`(unexpected)`);
          break;
        }

      case 'ROUTE_ABANDONED':
        {
          log(`(abandoned)`);
          break;
        }

      case 'ROUTE_SUCCEEDED':
        {
          const {
            scenario
          } = action.payload.extra;
          const duration = this.toDuration(checks, timestamp, routeSpec.success[scenario]);
          log(`(success) ${formatDuration(duration)}`);
          logIfOffset(duration);
          break;
        }

      case 'ROUTE_FAILED':
        {
          const {
            error
          } = routeSpec;
          const duration = this.toDuration(checks, timestamp, error);
          log(`(failure) ${formatDuration(duration)}`);
          logIfOffset(duration);
          break;
        }

      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          const duration = expiredTimestamp - timestamp;
          log(`(timeout) ${formatDuration(duration)}`);
          logIfOffset(duration);
          break;
        }

      case 'CHECKS_CHANGED':
        {
          log(`(update)`);
          break;
        }

      default:
    }

    switch (action.type) {
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_UNEXPECTED':
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_FAILED':
        {
          this.resolved[id] = true;
          break;
        }

      default:
    }
  }

}