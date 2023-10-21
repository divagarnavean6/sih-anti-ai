"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMockAuth = setMockAuth;

function setMockAuth(mocked) {
  return options => Object.assign({}, options, {
    mockAuth: mocked
  });
}