"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function toggleable(fn) {
  let enabled = true;

  const isEnabled = () => enabled;

  const setEnabled = state => {
    enabled = state;
  };

  const toggleableFn = (...args) => fn(isEnabled)(...args);

  return Object.assign(toggleableFn, {
    setEnabled
  });
}

var _default = toggleable;
exports.default = _default;
module.exports = exports.default;