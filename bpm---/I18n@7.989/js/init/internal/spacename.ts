/* hs-eslint ignored failing-rules */

/* eslint-disable no-prototype-builtins */
// enough of hns (hubspot namespace?)
export default function (existing, obj) {
  // If we are merging an object, keep track of each level in a
  // queue and ensure we merge from the "outside in" to prevent clobbering
  const queue = [{
    source: obj,
    target: existing
  }];

  while (queue.length > 0) {
    const {
      source,
      target
    } = queue.shift();

    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        if (typeof source[prop] === 'object' && typeof target[prop] === 'object') {
          if (source[prop] !== target[prop]) {
            queue.push({
              source: source[prop],
              target: target[prop]
            });
          }
        } else {
          target[prop] = source[prop];
        }
      }
    }
  }
}