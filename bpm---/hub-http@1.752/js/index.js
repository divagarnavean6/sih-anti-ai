"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStack = void 0;

var _freeze = _interopRequireDefault(require("./helpers/freeze"));

const promisifyMiddleware = (mw, options) => Promise.resolve(mw((0, _freeze.default)(Object.assign({}, options, {
  _input: options
}))));

const createStack = (...fns) => {
  const [first, ...rest] = fns;
  return options => {
    if (rest.length === 0) {
      return promisifyMiddleware(first, options);
    }

    return rest.reduce((composed, current) => {
      return composed.then(current);
    }, promisifyMiddleware(first, options));
  };
};

exports.createStack = createStack;