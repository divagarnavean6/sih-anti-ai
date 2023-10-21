"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__resetMetricsLoaded = __resetMetricsLoaded;
exports.trackMetricsLoaded = trackMetricsLoaded;

var _getGlobal = require("./getGlobal");

var _MetricsFactory = require("./MetricsFactory");

let factory;

function setSetupComplete(newValue) {
  (0, _getGlobal.getHubSpot)().__metricsSetupComplete = newValue;
}

function getSetupComplete() {
  return (0, _getGlobal.getHubSpot)().__metricsSetupComplete;
} // for randomized Jasmine test runs only


function __resetMetricsLoaded() {
  if (!factory || !getSetupComplete()) {
    return;
  }

  if (factory.counter('loaded').canFlush()) {
    factory.counter('loaded').flush();
  }

  factory = undefined;
  setSetupComplete(false);
  trackMetricsLoaded();
}

function trackMetricsLoaded() {
  if (factory || getSetupComplete()) {
    return;
  }

  factory = new _MetricsFactory.MetricsFactory('metrics', {});
  factory.counter('loaded').increment();
  setSetupComplete(true);
}