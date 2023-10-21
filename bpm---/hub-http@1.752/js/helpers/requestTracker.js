"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finishTrackingRequest = exports.startTrackingRequest = exports.getAllHttpRequestStats = exports.getHttpRequestStatsByState = exports.perfNow = exports.pageStartTimestamp = void 0;
const hasNavigationStart = window && window.performance && window.performance.timing && window.performance.timing.navigationStart;
const hasPerfNow = window && window.performance && window.performance.now;
const pageStartTimestamp = hasNavigationStart ? window.performance.timing.navigationStart : new Date().valueOf();
exports.pageStartTimestamp = pageStartTimestamp;
const perfNow = hasPerfNow ? window.performance.now.bind(window.performance) : () => {
  return new Date().valueOf() - pageStartTimestamp;
};
exports.perfNow = perfNow;
let requestCounter = 1;

function isValidFinalTrackingState(state, via = '') {
  if (state === 'succeeded' || state === 'timedOut' || state === 'failed' || state === 'aborted') {
    return true; // eslint-disable-next-line no-console
  } else if (console && console.error) {
    console.error(`Invalid state passed ${via ? `to ${via}` : ''} (${state})`); // eslint-disable-line no-console
  }

  return false;
}

function isValidTrackingState(state, via = '') {
  if (state === 'pending' || isValidFinalTrackingState(state, via)) {
    return true; // eslint-disable-next-line no-console
  } else if (console && console.error) {
    console.error(`Invalid state passed ${via ? `to ${via}` : ''} (${state})`); // eslint-disable-line no-console
  }

  return false;
}

const getHttpRequestStatsByState = state => {
  if (isValidTrackingState(state, 'getHttpRequestStatsByState')) {
    if (window.hubspot && window.hubspot._httpRequestStats && window.hubspot._httpRequestStats[state]) {
      return Object.keys(window.hubspot._httpRequestStats[state]).map(requestId => window.hubspot._httpRequestStats[state][requestId]);
    }
  }

  return [];
};

exports.getHttpRequestStatsByState = getHttpRequestStatsByState;

const getAllHttpRequestStats = () => {
  return getHttpRequestStatsByState('pending').concat(getHttpRequestStatsByState('succeeded'), getHttpRequestStatsByState('timedOut'), getHttpRequestStatsByState('failed'), getHttpRequestStatsByState('aborted'));
}; // Hrm, unsure if I should exporting these global API functions and having that
// be the primary entrypoint... or if I should have no functions and let the
// data alone be the "API".


exports.getAllHttpRequestStats = getAllHttpRequestStats;

if (window.hubspot) {
  if (!window.hubspot.getAllHttpRequestStats) {
    window.hubspot.getAllHttpRequestStats = getAllHttpRequestStats;
  }

  if (!window.hubspot.getHttpRequestStatsByState) {
    window.hubspot.getHttpRequestStatsByState = getHttpRequestStatsByState;
  }
}

const startTrackingRequest = (url, via) => {
  const requestId = requestCounter++;

  if (window.hubspot) {
    // Storing with global data (instead of via closure), so that it is possible
    // for multiple versions of request-tracker to combine data.
    if (!window.hubspot._httpRequestStats) {
      window.hubspot._httpRequestStats = {
        pending: {},
        succeeded: {},
        timedOut: {},
        failed: {},
        aborted: {}
      };
    }

    if (!window.hubspot._httpRequestStats.pending) {
      window.hubspot._httpRequestStats.pending = {};
    }

    window.hubspot._httpRequestStats.pending[requestId] = {
      id: requestId,
      started: perfNow(),
      state: 'pending',
      url,
      via
    };
  }

  return requestId;
};

exports.startTrackingRequest = startTrackingRequest;

const finishTrackingRequest = (requestId, url, state = 'succeeded', otherInfo = {}) => {
  if (!isValidFinalTrackingState(state, `finishTrackingRequest for ${url}`)) {
    return;
  }

  if (window.hubspot && window.hubspot._httpRequestStats && window.hubspot._httpRequestStats.pending) {
    const requestInfo = window.hubspot._httpRequestStats.pending[requestId]; // Remove from pending requests (and only allow a specific request to ever
    // be "finished" a single time)

    if (requestInfo) {
      delete window.hubspot._httpRequestStats.pending[requestId];
      requestInfo.finished = perfNow();
      requestInfo.state = state;

      if (!window.hubspot._httpRequestStats[state]) {
        window.hubspot._httpRequestStats[state] = {};
      }

      window.hubspot._httpRequestStats[state][requestId] = requestInfo; // Add extra info to the request info object, such as status code and text,
      // but don't overwrite any existing properties (or write blank properties)

      Object.keys(otherInfo).forEach(key => {
        if (requestInfo[key] == null && otherInfo[key] != null) {
          requestInfo[key] = otherInfo[key];
        }
      });
    }
  }
};

exports.finishTrackingRequest = finishTrackingRequest;