"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobal = getGlobal;
exports.getHubSpot = getHubSpot;

/**
 * Due to this code being used in multiple environments (today, web and React
 * Native, but potentially more in the future) we need a canonical way to fetch
 * the global object. In Bend builds, the `this` keyword at the module level
 * evaluates to globalThis, but in TypeScript, modules are isolated and thus
 * do not return a Window object when the `this` keyword is used at the module
 * level. MDN (link below) recommends this function to canonically fetch the
 * global object without depending on the `globalThis` keyword which isn't
 * supported in Internet Explorer.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis#search_for_the_global_across_environments
 *
 * The type signature for this function is intentionally unhelpful. With the
 * empty object type, we force users to actually check for properties safely
 * rather than just assuming their proprerties will be on the object.
 *
 * @returns an object that _may_ contain the contents of globalThis, if a
 * global object is available
 */
function getGlobal() {
  return typeof window !== 'undefined' && window || // @ts-expect-error not defined in standard TS config
  typeof global !== 'undefined' && global || {};
}

function getHubSpot() {
  return getGlobal().hubspot = getGlobal().hubspot || {};
}