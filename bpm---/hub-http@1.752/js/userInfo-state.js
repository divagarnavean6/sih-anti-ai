"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearCacheForTesting = clearCacheForTesting;
exports.getMemoizedPromise = getMemoizedPromise;
exports.setMemoizedPromise = setMemoizedPromise;
exports.getMemoizedInfo = getMemoizedInfo;
exports.setMemoizedInfo = setMemoizedInfo;
let memoizedPromise;
let memoizedInfo;
/**
 * ⚠️ Should only be called as part of build time tests
 * During an integration test:
 * - prevent the first response from being re-used
 * - allow to simulate multiple userInfo scenario
 */

function clearCacheForTesting() {
  memoizedPromise = undefined;
  memoizedInfo = undefined;
}

function getMemoizedPromise() {
  return memoizedPromise;
}

function setMemoizedPromise(prom) {
  memoizedPromise = prom;
}

function getMemoizedInfo() {
  return memoizedInfo;
}

function setMemoizedInfo(info) {
  memoizedInfo = info;
}