"use strict";

/* hs-eslint ignored failing-rules */

/* eslint-disable no-prototype-builtins */
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setHeader = exports.getHeader = void 0;

var _update = require("./update");

const getHeader = (name, responseOrOptions) => {
  const headers = responseOrOptions.headers;

  if (!headers) {
    return undefined;
  }

  for (const header in headers) {
    if (headers.hasOwnProperty(header) && header.toLowerCase() === name.toLowerCase()) {
      return headers[header];
    }
  }

  return undefined;
};

exports.getHeader = getHeader;

const setHeader = (name, value, options) => {
  const headers = options.headers;

  for (const header in headers) {
    if (headers.hasOwnProperty(header) && header.toLowerCase() === name.toLowerCase()) {
      return (0, _update.setIn)(['headers', header], value)(options);
    }
  }

  return (0, _update.setIn)(['headers', name], value)(options);
};

exports.setHeader = setHeader;