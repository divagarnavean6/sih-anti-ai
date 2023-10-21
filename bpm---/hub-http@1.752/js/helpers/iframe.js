"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maybeGetParentIframe = maybeGetParentIframe;
exports.notifyParentAndRejectOnStatuses = exports.MIGRATION_IN_PROGRESS_MESSAGE = exports.PORTAL_MOVED_MESSAGE = exports.UNAUTHORIZED_MESSAGE = void 0;

var _core = require("../middlewares/core");

var _response = require("./response");

const UNAUTHORIZED_MESSAGE = 'unauthorized';
exports.UNAUTHORIZED_MESSAGE = UNAUTHORIZED_MESSAGE;
const PORTAL_MOVED_MESSAGE = 'portal moved';
exports.PORTAL_MOVED_MESSAGE = PORTAL_MOVED_MESSAGE;
const MIGRATION_IN_PROGRESS_MESSAGE = 'migration in progress';
exports.MIGRATION_IN_PROGRESS_MESSAGE = MIGRATION_IN_PROGRESS_MESSAGE;

function maybeGetParentIframe() {
  try {
    if (window.self !== window.top) {
      return window.top;
    }
  } catch (e) {
    return null;
  }

  return null;
}

const notifyParentAndRejectOnStatuses = (statuses, parentWindow, message) => (0, _core.onResponse)(response => {
  if (statuses.includes(response.status)) {
    parentWindow.postMessage(message, '*');
    return Promise.reject((0, _response.responseError)(response, `Aborting: notifying parents of ${message} response`));
  }

  return response;
});

exports.notifyParentAndRejectOnStatuses = notifyParentAndRejectOnStatuses;