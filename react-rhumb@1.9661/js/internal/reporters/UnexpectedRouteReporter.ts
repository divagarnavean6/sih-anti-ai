import BaseReporter from './BaseReporter';
import { PageLoadMetrics } from '../Metrics';
export default class UnexpectedRouteReporter extends BaseReporter {
  constructor() {
    super();
    this.resolved = {};
    this.notifiedRoutes = new Set();
  }

  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] && action.type !== 'CHECKS_CHANGED') {
      return;
    }

    const {
      entry: {
        pathname
      }
    } = action.payload;

    if (action.type === 'ROUTE_UNEXPECTED') {
      if (!this.notifiedRoutes.has(pathname)) {
        this.addPageAction('react-rhumb-event', {
          eventName: 'UnexpectedRouteVisited',
          pathname
        });
        this.captureUnexpectedRoute(pathname);
        this.notifiedRoutes.add(pathname);
        PageLoadMetrics.counter('unexpected-route').increment();
      }

      this.resolved[action.payload.entry.id] = true;
    }
  }

}