"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "clearCacheForTesting", {
  enumerable: true,
  get: function () {
    return _userInfoState.clearCacheForTesting;
  }
});
exports.default = exports.userInfoSync = exports.userInfoSafe = exports.userInfoWithDelegatedOptions = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _loginVerifyClient = _interopRequireDefault(require("./clients/loginVerifyClient"));

var _userInfoState = require("./userInfo-state");

var _events = require("./helpers/events");

var _newRelicReporting = require("./helpers/newRelicReporting");

const getUserInfo = options => {
  const {
    cached = true
  } = options,
        otherOptions = (0, _objectWithoutPropertiesLoose2.default)(options, ["cached"]); // don't use early requester if we're trying to refresh the data

  if (!cached && otherOptions.externalResponse) {
    delete otherOptions.externalResponse;
  }

  const memoizedPromise = (0, _userInfoState.getMemoizedPromise)();

  if (cached && memoizedPromise) {
    otherOptions.recycledPromise = memoizedPromise;
  }

  const loginVerifyCall = (0, _loginVerifyClient.default)('/login-verify', otherOptions);

  if (!cached || !memoizedPromise) {
    (0, _userInfoState.setMemoizedPromise)(loginVerifyCall);
  }

  return loginVerifyCall.then(({
    data
  }) => data);
};

let earlyRequestPromise;

const earlyRequest = () => {
  if (!earlyRequestPromise) {
    earlyRequestPromise = new Promise((resolve, reject) => {
      const request = window.quickFetch && window.quickFetch.getRequestStateByName('api-verify');

      if (!request) {
        reject(new Error('No quick-fetch early login-verify request found'));
        (0, _newRelicReporting.setCustomAttribute)('earlyRequesterRequestNotFound', 'true');
        (0, _newRelicReporting.setCustomAttribute)('earlyRequesterFinished', 'false');
        return;
      }

      const earlyRequesterFinished = request.finished;
      request.whenFinished(data => {
        (0, _newRelicReporting.setCustomAttribute)('earlyRequesterFinished', `${Boolean(earlyRequesterFinished)}`);

        if (window.performance && typeof window.performance.getEntriesByName === 'function' && window.performance.getEntriesByName(_newRelicReporting.MEASURE_API_VERIFY_TIME).length) {
          (0, _newRelicReporting.setCustomAttribute)('earlyRequesterApiTime', window.performance.getEntriesByName(_newRelicReporting.MEASURE_API_VERIFY_TIME)[0].duration);
        }

        return resolve(data);
      });
      request.onError(xhr => {
        reject(new Error(`[hub-http] EarlyRequester token refresh attempt failed with status ${xhr.status}: ${xhr.statusText}`));
      });
    });
  }

  return earlyRequestPromise;
};

const get = options => {
  // when earlyRequester fails, pass control over to the login verify client to try again
  const fallback = reason => {
    if (reason) {
      // eslint-disable-next-line no-console
      console.error(reason.message);
    }

    return getUserInfo(options);
  }; // when earlyRequester succeeds, send a dummy response in the login verify's client for processing


  const dummyResponse = response => ({
    status: 200,
    statusText: 'OK',
    data: response
  });

  const request = earlyRequest().then(response => getUserInfo(Object.assign({}, options, {
    externalResponse: dummyResponse(response)
  }))).catch(fallback);
  return request.then(({
    auth,
    portal,
    user
  }) => {
    const info = {
      user,
      gates: portal.enabled_gates,
      portal
    };

    if (auth) {
      info.auth = auth;
    }

    if (window.performance && typeof window.performance.mark === 'function' && typeof window.performance.measure === 'function' && typeof window.performance.getEntriesByName === 'function') {
      window.performance.mark(_newRelicReporting.MARK_USER_INFO_SUCCESS);
      window.performance.measure(_newRelicReporting.MEASURE_USER_INFO_TIME, _newRelicReporting.MARK_USER_INFO_START, _newRelicReporting.MARK_USER_INFO_SUCCESS);
      const userInfoTime = window.performance.getEntriesByName(_newRelicReporting.MEASURE_USER_INFO_TIME).length ? window.performance.getEntriesByName(_newRelicReporting.MEASURE_USER_INFO_TIME)[0].duration : -1;
      (0, _newRelicReporting.setCustomAttribute)('userInfoTime', userInfoTime);
    }

    (0, _events.triggerEvent)('hubspot:userinfochange', info);
    return info;
  });
};

const userInfo = (options = {}) => {
  const others = Object.assign({}, options);

  if (window.performance && typeof window.performance.mark === 'function') {
    window.performance.mark(_newRelicReporting.MARK_USER_INFO_START);
  }

  return get(others).then(data => {
    (0, _userInfoState.setMemoizedInfo)(data);
    return data;
  });
};

const userInfoWithDelegatedOptions = ({
  cached,
  ignoreRedirect,
  safeMode,
  allowSuspended
}) => userInfo({
  cached,
  ignoreRedirect,
  safeMode,
  allowSuspended
});

exports.userInfoWithDelegatedOptions = userInfoWithDelegatedOptions;

const userInfoSafe = options => userInfo(Object.assign({}, options, {
  safeMode: true
}));

exports.userInfoSafe = userInfoSafe;

const userInfoSync = () => {
  const memoizedInfo = (0, _userInfoState.getMemoizedInfo)();

  if (!memoizedInfo) {
    throw new Error('User info has not be loaded yet. Did you call userInfoSync before the userInfo promise resolved?');
  }

  return memoizedInfo;
}; // TODO this can be removed my migrating all existing consumers to import from `userInfo-state.js` and adding the entry to "publicModules"


exports.userInfoSync = userInfoSync;
var _default = userInfo;
exports.default = _default;