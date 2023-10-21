"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableRejectionTracking = exports.enableRejectionTracking = void 0;

var _uuid = require("./utils/uuid");

/* hs-eslint ignored failing-rules */

/* eslint-disable hubspot-dev/no-declarations */
let enabled = false;

const getNewRelicInstance = () => {
  // @ts-expect-error Importing the proper type here would add an otherwise unnecessary dependency on react-rhumb
  return window.newrelic;
};

const typeOfReason = reason => {
  return reason === null ? 'Null' : reason === undefined ? 'Undefined' : Object.prototype.toString.call(reason).slice(8, -1);
};

const sendAlerts = reason => {
  const Raven = require('raven-js');

  const unhandledRejectionUuid = (0, _uuid.getUniqueKey)();
  const reasonType = typeOfReason(reason);
  const ravenOpts = {
    tags: {
      isUnhandledPromiseRejection: true,
      unhandledRejectionUuid,
      typeOfReason: reasonType
    }
  };

  if (typeof reason === 'string') {
    Raven.captureMessage(reason, ravenOpts);
  } else {
    Raven.captureException(reason, ravenOpts);
  }

  if (getNewRelicInstance()) {
    let newRelicAttributes = {
      isUnhandledPromiseRejection: true,
      typeOfReason: reasonType,
      unhandledRejectionUuid
    };

    if (reason && reason._hsAdditionalProperties) {
      newRelicAttributes = Object.assign({}, newRelicAttributes, {}, reason._hsAdditionalProperties);
    }

    getNewRelicInstance().noticeError(reason, newRelicAttributes);
  }
};

const isObject = it => {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

const handleUnhandledRejection = e => {
  e.preventDefault();

  if (isObject(e.promise)) {
    console.error('Unhandled Promise Rejection', e.reason);
    sendAlerts(e.reason);
  }
};

const disableRejectionTracking = () => {
  enabled = false;
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
};

exports.disableRejectionTracking = disableRejectionTracking;

const enableRejectionTracking = () => {
  if (enabled) {
    disableRejectionTracking();
  }

  enabled = true;
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
};

exports.enableRejectionTracking = enableRejectionTracking;