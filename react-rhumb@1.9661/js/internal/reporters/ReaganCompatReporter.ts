import hubspot from 'hubspot';
import invariant from 'react-utils/invariant';
import performance from '../../vendor/performance';
import CartographerReporter, { CartographerEndpoint } from './CartographerReporter';
import { onVisibilityChange, visibilityState } from '../visibility';
import { PageLoadMetrics } from '../Metrics';
import { isReload } from '../navigation';
const STATIC_DOMAIN_REGEX = /https:\/\/(static|local).hsappstatic.net\//; // If the duration of the request is <= 10ms mark the request as a cache hit.

const CACHE_DURATION_MS = 10;
export default class ReaganCompatReporter extends CartographerReporter {
  constructor(options) {
    super(options);
    this.abandonedTimes = [];
    this.lastAbandonedTimestamp = null;
    this.finished = false;
    this.wasHidden = visibilityState() === 'hidden';
    this.setCustomAttribute('currentVisibility', visibilityState());
    this.setCustomAttribute('visibility', visibilityState());
    onVisibilityChange(state => {
      this.setCustomAttribute('currentVisibility', state);

      if (state === 'hidden' && !this.wasHidden) {
        this.wasHidden = true;
        this.setCustomAttribute('visibility', 'hidden');
      }
    });
  }

  getHubHttpData(finishedTimestamp) {
    if (typeof hubspot.getAllHttpRequestStats === 'function' && typeof performance.now === 'function') {
      const byStatus = status => ({
        state,
        started,
        finished
      }) => started < finishedTimestamp && (status === 'pending' ? state === 'pending' || finished > finishedTimestamp : state === status && finished <= finishedTimestamp);

      const MAX_URLS = 10;

      const toUrls = arr => arr.slice(0, MAX_URLS).map(r => r.url).join(',');

      const requests = hubspot.getAllHttpRequestStats();
      const succeededRequests = requests.filter(byStatus('succeeded'));
      const failedRequests = requests.filter(byStatus('failed'));
      const abortedRequests = requests.filter(byStatus('aborted'));
      const pendingRequests = requests.filter(byStatus('pending'));
      const timedOutRequests = requests.filter(byStatus('timedOut'));
      const failedRequestsMinus404AndRetries = failedRequests.filter(r => r.status !== 404 && !r.willBeRetried);
      const notFoundRequests = failedRequests.filter(r => r.status === 404);
      return {
        numSucceededRequests: succeededRequests.length,
        numAbortedRequests: abortedRequests.length,
        numPendingRequests: pendingRequests.length,
        numNotFound: notFoundRequests.length,
        numTimedoutRequests: timedOutRequests.length,
        numFailedRequestsMinus404AndRetries: failedRequestsMinus404AndRetries.length,
        numRetriedFailures: failedRequests.filter(r => !!r.willBeRetried).length,
        failedRequestUrls: toUrls(failedRequestsMinus404AndRetries),
        timedOutRequestUrls: toUrls(timedOutRequests),
        pendingRequestUrls: toUrls(pendingRequests),
        notFoundUrls: toUrls(notFoundRequests)
      };
    }

    return null;
  }

  getCacheStatusData() {
    const cacheStatusData = {};
    this.performanceEntries().forEach(timing => {
      if (timing.name.endsWith('.js')) {
        const fileName = timing.name.replace(STATIC_DOMAIN_REGEX, '');
        cacheStatusData[fileName] = {
          cached: timing.duration <= CACHE_DURATION_MS,
          duration: timing.duration
        };
      }
    });
    return cacheStatusData;
  }

  getNumFailedImages() {
    return Array.from(document.getElementsByTagName('img')).reduce((total, ele) => {
      return ele.src && ele.naturalHeight === 0 && ele.naturalWidth === 0 ? total + 1 : total;
    }, 0);
  }

  finish(attrs, checks) {
    const {
      finishedTimestamp
    } = attrs;
    const hubHttpData = this.getHubHttpData(finishedTimestamp);
    const avgDurationBeforePreviousReaganAborts = this.abandonedTimes.reduce((acc, duration) => {
      return acc + duration / this.abandonedTimes.length;
    }, 0);
    const cacheData = this.getCacheStatusData();
    const reaganTiming = {};
    Object.keys(checks).forEach(marker => {
      if (checks[marker]) {
        reaganTiming[`marker_timing_${marker}`] = checks[marker].timestamp;
      }
    });
    this.setCustomAttribute('numReaganChecksStarted', this.abandonedTimes.length + 1);
    this.setCustomAttribute('numPreviousReaganChecksAborted', this.abandonedTimes.length);
    this.setCustomAttribute('avgDurationBeforePreviousReaganAborts', avgDurationBeforePreviousReaganAborts);
    this.setCustomAttribute('numPreviousReaganChecksFailed', 0);
    this.setCustomAttribute('numPreviousReaganChecksSuccessful', 0);
    this.addPageAction('reaganFinished', Object.assign({}, attrs, {}, hubHttpData, {
      numFailedImages: this.getNumFailedImages(),
      cacheData: JSON.stringify(cacheData),
      allVisibleMarkers: JSON.stringify(Object.keys(checks))
    }, reaganTiming)); // send to Cartographer

    this.sendActions([{
      to: {
        pathname: attrs.pathname,
        route: attrs.route,
        scenario: attrs.scenario
      },
      status: attrs.status,
      wasHidden: this.wasHidden,
      isHidden: visibilityState() === 'hidden',
      duration: attrs.timeToAllSuccess || attrs.finishedTimestamp,
      failureType: attrs.failureType,
      isReload: isReload()
    }], CartographerEndpoint.Navigation);
  }

  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || !this || this.finished) {
      return;
    }

    const {
      entry: {
        timestamp,
        checks,
        expiredTimestamp,
        pathname
      },
      routeSpec
    } = action.payload;

    switch (action.type) {
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_FAILED':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_UNEXPECTED':
        {
          this.finished = true;
          break;
        }

      default:
    }

    switch (action.type) {
      case 'ROUTE_STARTED':
        {
          if (this.lastAbandonedTimestamp) {
            this.abandonedTimes.push(timestamp - this.lastAbandonedTimestamp);
          }

          break;
        }

      case 'ROUTE_ABANDONED':
        {
          this.lastAbandonedTimestamp = timestamp;
          break;
        }

      case 'ROUTE_SUCCEEDED':
        {
          const {
            success,
            route
          } = routeSpec;
          const {
            extra: {
              scenario
            }
          } = action.payload;

          if (process.env.NODE_ENV !== 'production') {
            invariant(success[scenario].length > 0, 'routeSpec for %s must have at least one `success` marker for %s', route, scenario);
          }

          const maxTimestamp = Math.max(...success[scenario].map(m => checks[m].timestamp));
          const duration = Math.max(0, maxTimestamp - timestamp);
          const timeToAllSuccessMs = timestamp + duration;

          if (!this.wasHidden) {
            PageLoadMetrics.timer('succeeded', {
              scenario
            }).update(timeToAllSuccessMs);
          }

          this.finish(Object.assign({
            status: 'success',
            timeToAllSuccess: timeToAllSuccessMs / 1000,
            scenario,
            finishedTimestamp: maxTimestamp,
            route,
            pathname
          }, this.options.timingOffset ? {
            adjustedTimeToAllSuccess: (timestamp + duration + this.options.timingOffset) / 1000,
            timingOffset: this.options.timingOffset
          } : {}), checks);
          this.performanceMark(`mark_all_success`);
          break;
        }

      case 'ROUTE_FAILED':
        {
          const {
            route,
            error
          } = routeSpec;
          const markers = error.filter(marker => checks[marker]);

          if (process.env.NODE_ENV !== 'production') {
            invariant(markers.length > 0, 'routeSpec for %s must have at least one `failure` marker for', route);
          } // TODO how to report multiple failed markers without separate page actions


          const [failedMarker] = markers;
          const finishedTimestamp = checks[failedMarker].timestamp;

          if (!this.wasHidden) {
            PageLoadMetrics.counter('failed', {
              selector: failedMarker
            }).increment();
          }

          this.finish({
            status: 'failure',
            failureType: 'errorSelector',
            selector: failedMarker,
            finishedTimestamp,
            route,
            pathname
          }, checks);
          this.performanceMark(`mark_all_failure`);
          break;
        }

      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          const {
            route
          } = routeSpec;

          if (!this.wasHidden) {
            PageLoadMetrics.counter('timeouts').increment();
          }

          this.finish({
            status: 'failure',
            failureType: 'watchdogExpired',
            finishedTimestamp: expiredTimestamp,
            route
          }, checks);
          this.performanceMark(`mark_all_failure_watchdog_expired`);
          break;
        }

      default:
    }
  }

}