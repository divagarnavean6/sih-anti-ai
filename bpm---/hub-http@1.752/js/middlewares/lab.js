"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lab = void 0;

const labEnabled = (labKey, options) => {
  const localStorageKey = `HUB-HTTP-LABS:${labKey}`;
  const labOverride = options.localStorage && options.localStorage.getItem(localStorageKey);

  if (labOverride && labOverride.toLowerCase() === 'true') {
    // eslint-disable-next-line no-console
    console.log(`Using localStorage override for ${localStorageKey}: ${labOverride}`);
    return labOverride.toLowerCase() === 'true';
  }

  return typeof options.labs === 'object' && options.labs[labKey];
};

const lab = (labKey, middleware, fallback = o => o) => options => labEnabled(labKey, options) ? middleware(options) : fallback(options);

exports.lab = lab;