import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import CartographerReporter, { THIRTY_SECONDS, ObserverType } from './CartographerReporter';
import { onVisibilityHidden } from '../visibility';
import { resetFirstInputPolyfill, firstInputPolyfill } from '../BFCacheRestore';
import performanceNow from '../../vendor/performanceNow';

const createPerfObserver = (type, processEntry) => {
  try {
    if (!PerformanceObserver.supportedEntryTypes.includes(type)) {
      return;
    } // eslint-disable-next-line compat/compat


    const observer = new PerformanceObserver(entryList => {
      for (const perfEntry of entryList.getEntries()) {
        processEntry(perfEntry);
      }
    });
    observer.observe({
      type,
      buffered: true
    });
    onVisibilityHidden(() => {
      const visibleEntries = observer.takeRecords();
      observer.disconnect();
      visibleEntries.map(processEntry);
    });
  } catch (_unused) {// do nothing
  }
};

const onBFCacheRestore = callback => {
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      callback(event);
    }
  }, true);
};

export default class VitalsReporter extends CartographerReporter {
  constructor(options) {
    super(options);
    this.resolved = {};
    this.stopped = false;
    this.firstHiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity;
    this.interactionMap = new Map();
    window.addEventListener('visibilitychange', event => {
      this.firstHiddenTime = Math.min(this.firstHiddenTime, event.timeStamp);
    }, {
      once: true
    });

    const debounce = () => {
      clearTimeout(this.flushQueueTimeout);
      this.flushQueueTimeout = setTimeout(() => {
        this.flushPerformanceQueue(); // clear the map once the performance action buffer is cleared, to avoid memory leak

        this.interactionMap.clear();
      }, THIRTY_SECONDS);
    };

    const processFIDEntry = perfEntry => {
      const _toJSON = perfEntry.toJSON(),
            {
        processingStart: processingStart,
        startTime: startTime
      } = _toJSON,
            perfData = _objectWithoutPropertiesLoose(_toJSON, ["processingStart", "startTime"]); // ignore entries if the page was not in the foreground when the first input occured


      if (startTime < this.firstHiddenTime) {
        const inputDelay = processingStart - startTime;
        this.pushPerformanceAction(this.lastRouteInfo, ObserverType.FID, Object.assign({}, perfData, {
          processingStart,
          startTime,
          inputDelay
        }));
        debounce();
      }
    };

    const processUserInteractionEntry = perfEntry => {
      const {
        interactionId,
        target,
        name
      } = perfEntry;

      if (interactionId > 0) {
        let interaction = this.interactionMap.get(interactionId);

        if (!interaction) {
          interaction = {
            latency: 0,
            entries: [],
            interactionNames: ''
          };
          this.interactionMap.set(interactionId, interaction);
        }

        interaction.entries.push(perfEntry);
        interaction.latency = Math.max(perfEntry.duration, interaction.latency);

        if (interaction.latency < 150) {
          // Drop events that are really quick. Google suggests <= 200 as "Good"
          return;
        }

        const testId = target && target.hasAttribute('data-test-id') ? target.getAttribute('data-test-id') : '';
        const tagName = target ? target.tagName : '';

        if (name && name.length > 0) {
          interaction.interactionNames = interaction.interactionNames.concat(interaction.interactionNames.length > 0 ? ' ' : '', name);
        }

        this.evictPerformanceAction(interactionId);
        this.pushPerformanceAction(this.lastRouteInfo, ObserverType.UserInteraction, {
          interactionId,
          interactionNames: interaction.interactionNames,
          latency: interaction.latency,
          elapsedMs: performanceNow(),
          testId,
          tagName
        });
        debounce();
      }
    };

    const entryHandler = entry => {
      processFIDEntry(entry);
    };
    /*
      When the page is restored from the back/forward cache, re-add event listeners for FID
      and manually push FID data to the performance actions queue since the performance observer
      won't be able to catch it.
    */


    onBFCacheRestore(() => {
      resetFirstInputPolyfill();
      firstInputPolyfill(entryHandler);
    }); // Create performance observers for FID, etc

    createPerfObserver(ObserverType.LongTask, perfEntry => {
      const _toJSON2 = perfEntry.toJSON(),
            perfData = _objectWithoutPropertiesLoose(_toJSON2, ["attribution"]);

      this.pushPerformanceAction(this.lastRouteInfo, ObserverType.LongTask, perfData);
      debounce();
    });
    createPerfObserver(ObserverType.FID, perfEntry => {
      processFIDEntry(perfEntry);
    });
    createPerfObserver(ObserverType.UserInteraction, perfEntry => {
      processUserInteractionEntry(perfEntry);
    });
  }

  evictPerformanceAction(interactionId) {
    this.performanceActions = this.performanceActions.filter(action => action.data.interactionId !== interactionId);
  }

  __setFirstHiddenTime(time) {
    this.firstHiddenTime = time;
  }

  report(action) {
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