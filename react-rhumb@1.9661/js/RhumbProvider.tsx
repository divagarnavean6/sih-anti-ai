import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useReducer, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import invariant from 'react-utils/invariant';
import memoizeOne from 'react-utils/memoizeOne';
import usePrevious from 'react-utils/hooks/usePrevious';
import memoizeStringOnly from './vendor/memoizeStringOnly';
import RhumbContext from './internal/RhumbContext';
import * as Constants from './internal/Constants';
import matchRoute from './internal/matchRoute';
import { runWithLowPriority } from './internal/Scheduler';
import performanceNow from './vendor/performanceNow'; // @ts-expect-error untyped virtual module

import { bender } from 'legacy-hubspot-bender-context';
import ReaganCompatReporter from './internal/reporters/ReaganCompatReporter';
import InAppReporter from './internal/reporters/InAppReporter';
import UnexpectedRouteReporter from './internal/reporters/UnexpectedRouteReporter';
import GlobalErrorReporter from './internal/reporters/GlobalErrorReporter';
import VitalsReporter from './internal/reporters/VitalsReporter';
import DOMEventReporter from './internal/reporters/DOMEventReporter';
import MemoryReporter from './internal/reporters/MemoryReporter';
import emptyFunction from 'react-utils/emptyFunction';
import RhumbGlobalErrorBoundary from './internal/RhumbGlobalErrorBoundary';
import { PageLoadMetrics } from './internal/Metrics';
import PageReloadReporter from './internal/reporters/PageReloadReporter';

function useInitial(initialValue) {
  const ref = useRef();

  if (!ref.current) {
    ref.current = {
      value: initialValue()
    };
  }

  return ref.current.value;
}

const formatVersion = version => version.startsWith('static-') ? version.substr(7) : 'dev';

const buildRouteSpecs = partialRouteSpecs => {
  if (process.env.NODE_ENV !== 'production') {
    invariant(partialRouteSpecs, 'routeSpecs cannot be null');
  }

  return Object.keys(partialRouteSpecs).reduce((acc, route) => {
    const routeSpec = partialRouteSpecs[route];
    const {
      success = {
        default: []
      },
      error = [],
      globalNav = 'default'
    } = routeSpec;
    acc[route] = {
      route,
      globalNav,
      success,
      error: [...error, ...Constants.INTERNAL_ERROR_MARKERS]
    };
    return acc;
  }, {});
};

const buildGetRouteSpec = routeSpecs => {
  const routeKeys = Object.keys(routeSpecs);
  const routeMatcher = matchRoute(routeKeys);
  return memoizeStringOnly(pathname => {
    const route = routeKeys.find(key => routeMatcher(key, pathname));
    return routeSpecs[route];
  });
};

const buildCheckStatus = getRouteSpec => {
  const checkStatusImpl = ({
    pathname,
    checks,
    expiredTimestamp
  }) => {
    const routeSpec = getRouteSpec(pathname); // TODO DOCUMENT success wins all ties

    if (expiredTimestamp) {
      return {
        type: 'TIMEOUT'
      };
    } else {
      const isMounted = marker => checks[marker];

      const scenarios = Object.keys(routeSpec.success).filter(scenario => routeSpec.success[scenario].length && routeSpec.success[scenario].every(isMounted));

      if (scenarios.length) {
        // TODO warn if multiple
        return {
          type: 'SUCCESS',
          scenario: scenarios[0]
        };
      } else if (routeSpec.error.some(isMounted)) {
        return {
          type: 'FAILURE'
        };
      }
    }

    return {
      type: 'PENDING'
    };
  };

  return memoizeOne(checkStatusImpl);
};

const buildReporter = (getRouteSpec, report) => {
  return (type, entry, extra) => {
    const {
      pathname
    } = entry;
    const routeSpec = getRouteSpec(pathname);
    const payload = {
      entry,
      routeSpec
    };

    if (extra) {
      Object.assign(payload, {
        extra
      });
    }

    report({
      type,
      payload
    });
  };
};

const reducer = (prevState, action) => {
  const {
    entry: prevEntry,
    entry: {
      pathname: prevPathname,
      id: prevId,
      checks: prevChecks
    },
    entries: prevEntries
  } = prevState;

  switch (action.type) {
    case 'HISTORY_CHANGED':
      {
        const {
          pathname,
          timestamp
        } = action.payload;
        return pathname !== prevPathname ? Object.assign({}, prevState, {
          entry: {
            id: prevId + 1,
            pathname,
            referrer: prevPathname,
            timestamp,
            checks: {},
            expiredTimestamp: null,
            dirty: false
          },
          entries: [...prevEntries, prevEntry]
        }) : prevState;
      }

    case 'MARKER_MOUNTED':
      {
        const {
          marker: {
            name: marker,
            id
          },
          timestamp
        } = action.payload;

        if (process.env.NODE_ENV !== 'production') {
          if (prevChecks[marker]) {
            console.error('[react-rhumb] marker already rendered: "%s". Rendering duplicate markers is deprecated and route failure in the next version', marker);
          }
        }

        return prevId === id ? Object.assign({}, prevState, {
          entry: Object.assign({}, prevEntry, {
            dirty: true,
            checks: Object.assign({}, prevChecks, {
              [marker]: {
                timestamp
              }
            })
          })
        }) : prevState;
      }

    case 'MARKER_UNMOUNTED':
      {
        const {
          marker: {
            name: marker,
            id
          }
        } = action.payload;

        if (prevId === id && prevChecks[marker]) {
          const checks = Object.assign({}, prevChecks);
          delete checks[marker];
          return Object.assign({}, prevState, {
            entry: Object.assign({}, prevEntry, {
              checks
            })
          });
        }

        return prevState;
      }

    case 'TIMEDOUT':
      {
        const {
          timestamp
        } = action.payload;
        return Object.assign({}, prevState, {
          entry: Object.assign({}, prevEntry, {
            expiredTimestamp: timestamp
          })
        });
      }

    default:
      {
        return prevState;
      }
  }
};

const usePreventPropChange = process.env.NODE_ENV !== 'production' ? props => {
  const {
    config,
    history,
    timingOffset,
    staticAppInfo
  } = props;
  const configRef = useRef(config);
  const historyRef = useRef(history);
  const timingOffsetRef = useRef(timingOffset);
  const staticAppInfoRef = useRef(staticAppInfo);
  useEffect(() => {
    invariant(configRef.current === config, '`config` should not change');
    invariant(historyRef.current === history, '`history` should not change');
    invariant(timingOffsetRef.current === timingOffset, '`timingOffset` should not change');
    invariant(staticAppInfoRef.current === staticAppInfo, '`staticAppInfo` should not change');
    configRef.current = config;
    historyRef.current = history;
    timingOffsetRef.current = timingOffset;
    staticAppInfoRef.current = staticAppInfo;
  }, [config, history, timingOffset, staticAppInfo]);
} : () => {};

const useHistoryEffect = (history, callback) => {
  const queue = useRef([]);
  const flush = useRef(emptyFunction);
  const savedCallback = useRef(emptyFunction);
  useEffect(() => {
    savedCallback.current = callback;
  });

  if (flush.current === emptyFunction) {
    const unlisten = history.listen(({
      pathname
    }) => {
      const timestamp = performanceNow();
      queue.current.push({
        pathname,
        timestamp
      });
    });

    flush.current = () => {
      unlisten();
      queue.current.forEach(entry => savedCallback.current(entry));
      queue.current = [];

      flush.current = () => {};
    };
  }

  useEffect(() => {
    flush.current();
    return history.listen(savedCallback.current);
  }, [history]);
};

const useNewRelicRouteTracking = (history, getRouteSpec) => {
  const {
    pathname
  } = history;
  const initialRouteSpec = useInitial(() => getRouteSpec(pathname));

  const updateNewRelicRouteData = routeSpec => {
    const route = routeSpec ? routeSpec.route : 'unknown-route';

    if (window.newrelic) {
      window.newrelic.setCurrentRouteName(route);
      window.newrelic.setCustomAttribute('route', route);
    }
  };

  useEffect(() => {
    if (window.newrelic) {
      window.newrelic.setCustomAttribute('reactRhumbVersion', formatVersion(bender.depVersions['react-rhumb']));
      window.newrelic.setCustomAttribute('reaganVersion', 'react-rhumb');
    }
  }, []);
  useEffect(() => {
    updateNewRelicRouteData(initialRouteSpec);
  }, [initialRouteSpec]);

  const handleHistoryChange = ({
    pathname: nextPathname
  }) => {
    updateNewRelicRouteData(getRouteSpec(nextPathname));
  };

  useHistoryEffect(history, handleHistoryChange);
};

const RhumbProvider = props => {
  usePreventPropChange(props);
  const {
    history,
    history: {
      pathname: historyPathname
    },
    config,
    children,
    timingOffset,
    staticAppInfo,
    captureExceptions = true
  } = props;
  const routeSpecs = useMemo(() => buildRouteSpecs(config), [config]);
  const initialState = useMemo(() => ({
    entry: {
      id: 0,
      pathname: historyPathname,
      referrer: undefined,
      timestamp: 0,
      checks: {},
      expiredTimestamp: null,
      dirty: false
    },
    entries: []
  }), [historyPathname]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const getRouteSpec = useMemo(() => buildGetRouteSpec(routeSpecs), [routeSpecs]);
  useNewRelicRouteTracking(history, getRouteSpec);

  const handleHistoryChange = ({
    timestamp,
    pathname: nextPathname
  }) => {
    runWithLowPriority(() => {
      dispatch({
        type: 'HISTORY_CHANGED',
        payload: {
          pathname: nextPathname,
          timestamp
        }
      });
    });
  };

  useHistoryEffect(history, handleHistoryChange);
  const reportAction = useInitial(() => {
    const consoleReporterModule = process.env.NODE_ENV === 'production' ? require('./internal/reporters/ProdConsoleReporter') : require('./internal/reporters/DevConsoleReporter');
    const ConsoleReporter = consoleReporterModule.default ? consoleReporterModule.default : consoleReporterModule;
    const reporters = [new ConsoleReporter({
      timingOffset
    }), new ReaganCompatReporter({
      timingOffset,
      staticAppInfo
    }), new InAppReporter({
      staticAppInfo
    }), new UnexpectedRouteReporter(), new GlobalErrorReporter(), new VitalsReporter({
      staticAppInfo
    }), new DOMEventReporter(), new MemoryReporter({
      staticAppInfo
    }), new PageReloadReporter()];
    return action => reporters.forEach(r => r.report(action));
  });
  const report = useMemo(() => {
    return buildReporter(getRouteSpec, reportAction);
  }, [getRouteSpec, reportAction]);

  const reportError = (error, attributes) => {
    report('GLOBAL_ERROR', state.entry, Object.assign({
      error
    }, attributes));
  };

  const checkStatus = useMemo(() => buildCheckStatus(getRouteSpec), [getRouteSpec]);
  const timeoutRef = useRef(undefined);
  const prevState = usePrevious(state);
  useEffect(() => {
    const handleTimeout = () => {
      const timestamp = performanceNow();
      runWithLowPriority(() => {
        dispatch({
          type: 'TIMEDOUT',
          payload: {
            timestamp
          }
        });
      });
    };

    const reportForStatus = (status, entry) => {
      switch (status.type) {
        case 'SUCCESS':
          {
            const {
              scenario
            } = status;
            report('ROUTE_SUCCEEDED', entry, {
              scenario
            });
            break;
          }

        case 'TIMEOUT':
          report('ROUTE_TIMEOUT_EXPIRED', entry);
          break;

        case 'FAILURE':
          report('ROUTE_FAILED', entry);
          break;

        default:
          throw new Error(`unexpected status type ${status.type}`);
      }
    }; // there are new history entries


    if (prevState && state.entries !== prevState.entries) {
      const {
        entry: prevEntry,
        entry: {
          checks: prevChecks
        },
        entries: prevEntries
      } = prevState;
      const {
        entries: currentEntries
      } = state; // clear the timeout

      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined; //run through special cases

      const [trailingEntry, ...skippedEntries] = currentEntries.slice(prevEntries.length - currentEntries.length);
      const {
        pathname: trailingPathname,
        checks: trailingChecks
      } = trailingEntry;
      const trailingRouteSpec = getRouteSpec(trailingPathname);

      if (trailingRouteSpec) {
        if (trailingChecks !== prevChecks) {
          report('CHECKS_CHANGED', trailingEntry);
        }

        const status = checkStatus(trailingEntry);

        if (trailingEntry !== prevEntry) {
          // the previous entry changed during the last batch of updates and should be checked
          if (status.type !== 'PENDING') {
            reportForStatus(status, trailingEntry);
          } else {
            report('ROUTE_ABANDONED', trailingEntry);
          }
        } else {
          if (status.type === 'PENDING') {
            report('ROUTE_ABANDONED', trailingEntry);
          }
        }
      } // entries that were added between updates
      // nothing should ever have been mounted in these entries


      skippedEntries.forEach(skippedEntry => {
        const {
          pathname: skippedPathname
        } = skippedEntry;
        const skippedRouteSpec = getRouteSpec(skippedPathname);

        if (skippedRouteSpec) {
          report('ROUTE_STARTED', skippedEntry);
          report('ROUTE_ABANDONED', skippedEntry);
        } else {
          report('ROUTE_UNEXPECTED', skippedEntry);
        }
      });
    } // check the new entry


    if (!prevState || prevState.entries !== state.entries) {
      const {
        entry: currentEntry,
        entry: {
          pathname: currentPathname,
          dirty: currentDirty
        }
      } = state;
      const routeSpec = getRouteSpec(currentPathname);

      if (routeSpec) {
        report('ROUTE_STARTED', currentEntry);

        if (currentDirty) {
          // TODO can this ever be hit?
          report('CHECKS_CHANGED', currentEntry);
        }

        const status = checkStatus(currentEntry);

        if (status.type !== 'PENDING') {
          // TODO can this ever be hit?
          reportForStatus(status, currentEntry);
        } else {
          timeoutRef.current = setTimeout(handleTimeout, Constants.DEFAULT_TIMEOUT);
        }
      } else {
        report('ROUTE_UNEXPECTED', currentEntry);
      }
    } // there are no new history entries but existing entry has some changes and needs to be checked


    if (prevState && prevState.entries === state.entries && prevState.entry !== state.entry) {
      const {
        entry: {
          checks: prevChecks
        }
      } = prevState;
      const {
        entry: currentEntry,
        entry: {
          checks: currentChecks,
          pathname: currentPathname
        }
      } = state;
      const routeSpec = getRouteSpec(currentPathname);

      if (routeSpec) {
        if (currentChecks !== prevChecks) {
          report('CHECKS_CHANGED', currentEntry);
        }

        const status = checkStatus(currentEntry);

        if (status.type !== 'PENDING') {
          reportForStatus(status, currentEntry);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
      }
    }
  }, [prevState, state, getRouteSpec, checkStatus, report]);
  useEffect(() => {
    PageLoadMetrics.timer('rhumb-provider-mounted').update(performanceNow());
    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, []);
  const {
    entry: {
      checks: currentChecks,
      id: currentId
    }
  } = state;
  const visibleMarkers = useMemo(() => Object.keys(currentChecks).filter(marker => currentChecks[marker]), [currentChecks]);
  const contextValue = useMemo(() => ({
    id: currentId,
    dispatch,
    reportAction
  }), [currentId, reportAction]);
  const visibleMarkersData = useMemo(() => visibleMarkers.map(encodeURIComponent).join(','), [visibleMarkers]);
  return /*#__PURE__*/_jsxs(RhumbContext.Provider, {
    value: contextValue,
    children: [captureExceptions ? /*#__PURE__*/_jsx(RhumbGlobalErrorBoundary, {
      onError: reportError,
      children: children || null
    }) : children || null, /*#__PURE__*/_jsx("div", {
      hidden: true,
      "aria-hidden": "true",
      "data-id-markers": visibleMarkersData,
      children: visibleMarkers.map(marker => /*#__PURE__*/_jsx("mark", {
        "data-id-marker": marker
      }, marker))
    })]
  });
};

if (process.env.NODE_ENV !== 'production') {
  RhumbProvider.propTypes = {
    config: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      listen: PropTypes.func.isRequired,
      pathname: PropTypes.string.isRequired
    }).isRequired,
    children: PropTypes.node,
    captureExceptions: PropTypes.bool
  };
}

export default /*#__PURE__*/memo(RhumbProvider);