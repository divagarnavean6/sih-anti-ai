"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthMocked = isAuthMocked;

function isAuthMocked(options) {
  return Boolean(options.mockAuth);
}