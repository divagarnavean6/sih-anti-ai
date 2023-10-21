import { getFullUrl } from 'hubspot-url-utils';
import memoizeOne from 'react-utils/memoizeOne';
import PortalIdParser from 'PortalIdParser';
import BaseReporter, { Color } from './BaseReporter';
import { isHidden as visibilityUtilsIsHidden } from '../visibility';
export const ObserverType = {
  FID: 'first-input',
  LongTask: 'longtask',
  UserInteraction: 'event'
};
export const THIRTY_SECONDS = 1000 * 30;
export const CartographerEndpoint = {
  Navigation: 'rhumb',
  Performance: 'performance'
};

const formatVersion = version => {
  if (!version) {
    return 'unknown';
  }

  if (version === 'static') {
    return 'dev';
  }

  return version.replace('static-', '');
};

const getMetricsEndpoint = memoizeOne((endpoint, staticAppName, staticAppVersion) => {
  return `${getFullUrl('app-api')}/cartographer/v1/${endpoint}?hs_static_app=${staticAppName}&hs_static_app_version=${formatVersion(staticAppVersion)}`;
});
export default class CartographerReporter extends BaseReporter {
  constructor(options) {
    super(options);
    this.performanceActions = [];
    this.navigationActions = [];
    window.addEventListener('unload', () => {
      this.flushAllQueues();
    }, false);
  }

  sendActions(actions, endpoint) {
    try {
      // eslint-disable-next-line compat/compat
      return navigator.sendBeacon(getMetricsEndpoint(endpoint, this.staticAppName, this.staticAppVersion), JSON.stringify({
        userAgent: navigator.userAgent,
        portalId: PortalIdParser.get(),
        datapoints: actions
      }));
    } catch (_unused) {
      return null;
    }
  }

  logActions(actions) {
    if (!this.debug) {
      return;
    }

    this.logGroupWithBadge('Cartographer beacon', Color.KOALA, Color.SLINKY, () => {
      actions.forEach(console.log);
    });
  }

  flushNavigationQueue() {
    if (!this.navigationActions.length) {
      return;
    }

    try {
      const sent = this.sendActions(this.navigationActions, CartographerEndpoint.Navigation);

      if (sent) {
        this.logActions(this.navigationActions);
        this.navigationActions = [];
      }
    } catch (e) {// Do nothing
    }
  }

  flushPerformanceQueue() {
    if (!this.performanceActions.length) {
      return;
    }

    try {
      const sent = this.sendActions(this.performanceActions, CartographerEndpoint.Performance);

      if (sent) {
        this.logActions(this.performanceActions);
        this.performanceActions = [];
      }
    } catch (e) {// Do nothing
    }
  }

  flushAllQueues() {
    this.flushNavigationQueue();
    this.flushPerformanceQueue();
  }

  pushNavigationAction(routeInfo, previousRouteInfo, status, wasHidden, isHidden, duration, isReload) {
    if (visibilityUtilsIsHidden()) {
      return;
    }

    this.navigationActions.push({
      from: previousRouteInfo,
      to: routeInfo,
      status,
      wasHidden,
      isHidden,
      duration,
      isReload
    });
  }

  pushPerformanceAction(route, type, data) {
    if (visibilityUtilsIsHidden()) {
      return;
    }

    this.performanceActions.push({
      route,
      type,
      data
    });
  }

}