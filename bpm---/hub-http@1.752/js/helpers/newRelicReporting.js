"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCustomAttribute = exports.MEASURE_API_VERIFY_TIME = exports.MEASURE_USER_INFO_TIME = exports.MARK_USER_INFO_SUCCESS = exports.MARK_USER_INFO_START = void 0;

const newRelicAvailabile = () => Boolean(window.newrelic);

const MARK_USER_INFO_START = 'mark_user_info_start';
exports.MARK_USER_INFO_START = MARK_USER_INFO_START;
const MARK_USER_INFO_SUCCESS = 'mark_user_info_success';
exports.MARK_USER_INFO_SUCCESS = MARK_USER_INFO_SUCCESS;
const MEASURE_USER_INFO_TIME = 'measure_user_info_time';
exports.MEASURE_USER_INFO_TIME = MEASURE_USER_INFO_TIME;
const MEASURE_API_VERIFY_TIME = 'measure_api_verify_time';
exports.MEASURE_API_VERIFY_TIME = MEASURE_API_VERIFY_TIME;

const setCustomAttribute = (name, value) => {
  if (newRelicAvailabile()) {
    window.newrelic.setCustomAttribute(name, value);
  }
};

exports.setCustomAttribute = setCustomAttribute;