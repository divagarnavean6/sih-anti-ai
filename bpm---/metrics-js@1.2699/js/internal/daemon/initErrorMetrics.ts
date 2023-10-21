"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initErrorMetrics = initErrorMetrics;
exports.getMetricsFactoryForTesting = getMetricsFactoryForTesting;
exports.resetErrorTrackingForTesting = resetErrorTrackingForTesting;

var _MetricsFactory = require("../MetricsFactory");

let evtTarget = window;
let factory;
const errCache = new Set();

function initErrorMetrics(customTarget) {
  // for testing - actually dispatching errors to the window during tests
  // causes the tests to fail
  evtTarget = customTarget || evtTarget;

  if (factory) {
    return;
  } // Need to construct a factory directly to avoid a circular dependency in
  // createMetricsFactory. Do not copy this into app/library code.
  // Final metric name: *.frontend.js.errors.count


  factory = new _MetricsFactory.MetricsFactory('js', {});

  try {
    evtTarget.addEventListener('error', onError);
    evtTarget.addEventListener('unhandledrejection', onUnhandledPromiseRejection);
    evtTarget.addEventListener('rejectionhandled', onHandledPromiseRejection);
  } catch (__err) {// ignore, this is an unrecoverable failure
  }
}

function getMetricsFactoryForTesting() {
  return factory;
}

function resetErrorTrackingForTesting() {
  try {
    factory = undefined;
    evtTarget.removeEventListener('error', onError);
  } catch (__err) {// ignore, this is an unrecoverable failure
  }
}

const EXTENSION_REGEX = /@<inline>|moz-extension:\/\/|chrome-extension:\/\/|safari-web-extension:\/\/|safari-extension:\/\//;

function isBrowserExtensionError(errObj) {
  if (errObj && errObj.stack && errObj.stack.match(EXTENSION_REGEX)) {
    if (factory) {
      factory.counter('browser-extension-errors').increment();
    }

    return true;
  }

  return false;
}

function onUnhandledPromiseRejection(evt) {
  if (!factory) return;

  if (evt.reason && isBrowserExtensionError(evt.reason)) {
    return;
  }

  factory.counter('unhandled-promise-rejection').increment();
}

function onHandledPromiseRejection() {
  if (!factory) return;
  factory.counter('handled-promise-rejection').increment();
}

function onError(errEvt) {
  if (!factory) return;
  if (!(errEvt instanceof ErrorEvent)) return;
  const errToTest = errEvt.error || new Error(errEvt.message);

  if (errCache.has(errToTest)) {
    return;
  }

  if (_shouldIgnore(errToTest)) {
    factory.counter('configured-ignored-errors').increment();
    return;
  }

  if (isBrowserExtensionError(errToTest)) {
    return;
  }

  factory.counter('errors').increment();

  factory[_MetricsFactory.$SessionCounter]('errors-per-session').increment();

  errCache.add(errToTest); // avoid a memory leak from the cache exploding over time in apps with high
  // counts of unexpected errors

  enqueueCacheRemoval(errToTest);
}

function _shouldIgnore(err) {
  if (window.hubspot && window.hubspot._shouldIgnoreJsError) {
    if (window.hubspot._shouldIgnoreJsError(err)) {
      return true;
    }
  }

  return false;
}

function enqueueCacheRemoval(err) {
  setTimeout(() => errCache.delete(err), 250);
}