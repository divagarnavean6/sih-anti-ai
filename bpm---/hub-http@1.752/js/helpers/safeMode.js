"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSafeMode = void 0;

const isTrue = v => v && v.toLowerCase() === 'true';

const isSafeMode = options => options.safeMode || options.localStorage && isTrue(options.localStorage.getItem('HUB-HTTP_SAFE_MODE'));

exports.isSafeMode = isSafeMode;