"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqueKey = void 0;

/* eslint-disable no-bitwise */
const getUniqueKey = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

exports.getUniqueKey = getUniqueKey;