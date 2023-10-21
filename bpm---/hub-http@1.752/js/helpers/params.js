"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.stringify = void 0;

function serializeValue(key, value) {
  return `${encodeURIComponent(key)}=${encodeURIComponent(value == null ? '' : value)}`;
}

function serializeArray(key, value) {
  return value.reduce((result, current) => {
    // mimic the default jQuery behavior here
    if (current != null) {
      result.push(serializeValue(`${key}`, current));
    }

    return result;
  }, []).join('&');
}

const stringify = query => {
  if (query == null) return '';
  if (typeof query === 'string' || query instanceof String) return query;
  return Object.keys(query).reduce((result, key) => {
    const value = query[key];

    if (Array.isArray(value)) {
      if (value.length > 0) result.push(serializeArray(key, value));
    } else if (value != null) {
      result.push(serializeValue(key, value));
    }

    return result;
  }, []).join('&');
};

exports.stringify = stringify;

const parse = query => {
  if (query == null || query.trim() === '') {
    return {};
  }

  return query.split('&').reduce((result, current) => {
    const [key, value] = current.split('=');
    let keyName = key;
    const decodedValue = decodeURIComponent(value); // parse query strings in the form foo[] for arrays. This is only for compatibility and
    // repeating keys should be favored.

    if (keyName.length > 2 && keyName.lastIndexOf('[]') === keyName.length - 2) {
      keyName = keyName.substring(0, keyName.length - 2);
    }

    const existing = result[keyName];

    if (existing !== undefined) {
      if (Array.isArray(existing)) {
        existing.push(decodedValue);
      } else {
        result[keyName] = [existing, decodedValue];
      }
    } else {
      result[keyName] = decodedValue;
    }

    return result;
  }, {});
};

exports.parse = parse;