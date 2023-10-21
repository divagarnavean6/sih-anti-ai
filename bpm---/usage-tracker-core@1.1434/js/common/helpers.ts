/* hs-eslint ignored failing-rules */

/* eslint-disable no-prototype-builtins */
import { SENSITIVE_PROPERTIES } from '../constants';

const fakeTimeout = cb => {
  cb();
  return 0;
}; // This defines a local safe reference to the global.Window object
// eslint-disable-next-line


export const lWindow = self; // This allows a safe usage of browser clocks when we're not sure if timers/clocks
// Are available within the environment of usage-tracker-core
// Note.: Instead of exposing the function itself we need to actually do this kind of call
// Because otherwise Jasmine doesn't override the setTimeout method calls

export const safeSetTimeout = (handler, timeout) => typeof setTimeout === 'function' ? setTimeout(handler, timeout) : fakeTimeout(handler);
export const ensureFn = (fn, fallback = () => {}) => typeof fn === 'function' ? fn : fallback;
export const getObjectKeys = Object.keys;
export const isPromise = subject => Boolean(subject) && typeof subject === 'object' && typeof subject.then === 'function' || subject instanceof Promise;
export const promiseHasDone = promise => Boolean(promise) && typeof promise === 'object' && typeof promise.done === 'function';
export const reduceObject = obj => fn => getObjectKeys(obj).reduce(fn, {});
export const between = (str = '', left = '', right = '') => {
  const leftIndex = str.indexOf(left);
  const rightIndex = str.indexOf(right);
  return str.substr(leftIndex + left.length, rightIndex - leftIndex - right.length);
}; // Note this is a naive approach and should not be used outside this library

export const debounce = (fn, wait) => {
  let timeout = 0;
  let result;

  const debounced = (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = safeSetTimeout(() => {
      timeout = 0;
      result = fn.apply(null, args);
    }, wait);
    return result;
  };

  return debounced;
};
export const defaults = (source = {}, blueprint = {}) => {
  const withDefaults = reduceObject(blueprint)((accumulator, key) => {
    const value = source[key];

    if (value === undefined && blueprint[key] !== undefined) {
      accumulator[key] = blueprint[key];
    }

    return accumulator;
  });
  return Object.assign({}, source, {}, withDefaults);
};
export const isArray = thing => {
  if (Array.hasOwnProperty('isArray')) {
    return Array.isArray(thing);
  }

  return Object.prototype.toString.call(thing) === '[object Array]';
};
export const getRealTypeOf = thing => {
  let type = typeof thing;

  if (isArray(thing)) {
    type = 'array';
  }

  if (thing === null) {
    return 'null';
  }

  return type;
};
export const makeUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let v;
    const r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise

    if (c === 'x') {
      v = r;
    } else {
      v = r & 0x3 | 0x8; // eslint-disable-line no-bitwise
    }

    return v.toString(16);
  });
};
export const mapObject = (source = {}, iteratee) => {
  return reduceObject(source)((accumulator, key) => {
    accumulator[key] = iteratee(key, source[key]);
    return accumulator;
  });
};
export const omit = (source = {}, list = []) => {
  return reduceObject(source || {})((accumulator, key) => {
    const includes = list.includes(key);

    if (!includes) {
      accumulator[key] = source[key];
    }

    return accumulator;
  });
};
export const pick = (source = {}, list = []) => Object.assign({}, ...list.map(key => ({
  [key]: source[key]
})));
export const once = fn => {
  let isCached;
  let result;
  return (...args) => {
    if (!isCached) {
      isCached = true;
      result = fn(...args);
    }

    return result;
  };
};
export const pluck = (subject, collection) => {
  // We cannot use reduceObject here since the return types are intriniscally different
  return getObjectKeys(collection).reduce((accumulator, key) => {
    const entry = collection[key];
    accumulator[key] = entry[subject];
    return accumulator;
  }, {});
};
export const trim = (str = '', outer = '') => {
  str = str.replace(/^\s+|\s+$/g, '');

  if (str.indexOf(outer) === 0) {
    str = str.substr(outer.length);
  }

  if (str.indexOf(outer) === str.length - outer.length) {
    str = str.substr(0, str.indexOf(outer));
  }

  return str;
};
export const shallowCopy = (source = {}) => {
  return reduceObject(source)((accumulator, key) => {
    accumulator[key] = source[key];
    return accumulator;
  });
};
export const truncate = (str = '', limit = 256) => {
  let truncated = str;

  if (truncated.length > limit) {
    truncated = truncated.substr(0, limit);
    truncated = `${truncated}[..]`;
  }

  return truncated;
};
export const createQueue = () => {
  const queue = [];
  return {
    enqueue: entry => queue.unshift(entry),
    dequeue: () => queue.shift(),
    peek: () => queue[0]
  };
};
export const safeGetOrDefault = (path = [], defaultValue, root = lWindow) => {
  let result = root;
  path.forEach(current => {
    const hasNode = result && current in result;
    result = hasNode ? result[current] : undefined;
  });
  return result === undefined ? defaultValue : result;
};
export const prettyPrint = (str = '') => {
  const snakeCase = str.toString().replace(/(?:^|\.?)([A-Z]+)/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
  const titleCase = snakeCase.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  return titleCase.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\s{2}/g, ' ');
};
export const deepFreeze = source => {
  if (source && typeof source === 'object' && !Object.isFrozen(source)) {
    Object.freeze(source);
    Object.getOwnPropertyNames(source).forEach(prop => deepFreeze(source[prop]));
  }

  return source;
};
export const proxyLogger = tags => c => (m, e) => {
  const decoratedData = {
    fingerprint: ['usage-tracker-js'],
    tags
  };
  return ensureFn(c)(m, Object.assign({}, decoratedData, {}, e));
};
export const mask = (properties, _mask = '**********') => properties.reduce((acc, key) => Object.assign({}, acc, {
  [key]: _mask
}), {});
export const maskEmail = input => input && typeof input === 'string' ? input.replace(/^(.{0})[^@]+/, '$1*****') : input;
export const replaceSentryValues = input => {
  if (typeof input === 'object' && input) {
    return reduceObject(input)((output, key) => {
      // We set the output as the input just if any o the if statements doesn't work
      // Which is normal and valid if the data is valid and not sensitive
      output[key] = input[key]; // We only want to check against sensitive properties to add a mask

      if (SENSITIVE_PROPERTIES.includes(key)) {
        // We only want to apply a mask to string values
        if (typeof input[key] === 'string' && input[key].length > 0) {
          output[key] = key === 'email' ? maskEmail(input[key]) : '**********';
        }
      } // We do not want to include a function so we say this is a function


      if (typeof input[key] === 'function') {
        output[key] = 'Function';
      } // If the original value was null or undefined then the final one also must be


      if (typeof input[key] === 'undefined' || input[key] === null) {
        output[key] = null;
      }

      return output;
    });
  }

  return input;
};