"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseError = exports.handleResponse = exports.responseHandlers = void 0;

var _update = require("./update");

const responseHandlersKey = Symbol('responseHandlers');

const responseHandlers = options => options[responseHandlersKey];

exports.responseHandlers = responseHandlers;

const handleResponse = handler => (0, _update.push)(responseHandlersKey, handler);

exports.handleResponse = handleResponse;

const responseError = (response, message, code, previousError) => Object.assign(new Error(), response, {
  message,
  code,
  previousError
});

exports.responseError = responseError;