import objectIs from './objectIs';

/**
 * Returns a wrapper function that, when called, either:
 *
 * 1. Returns a cached result if given the same args as the last time it was called, or
 * 2. If any args are different from last time, calls through to `func`
 *
 * @example How to reset the internal cache
 *
 * ```typescript
 * import memoizeOne from 'react-utils/memoizeOne';
 *
 * const memoizeOneFunc = memoizeOne((num: number) => num);
 * memoizeOneFunc(1); // Call the function
 * memoizeOneFunc(1); // Use the cache
 * memoizeOneFunc.resetCache(); // Clear the internal cache
 * memoizeOneFunc(1); // Call the function
 * ```
 *
 * @param {Function} func
 * @param {?Function} equalityFn A function of the form `(a, b) => <bool>`
 * @returns {Function}
 */
export default function memoizeOne(func, equalityFn = objectIs) {
  let hasBeenCalled = false;
  let lastArgs;
  let lastResult;

  const memoizedFunc = function memoizedFunc(...args) {
    if (!hasBeenCalled || args.some((arg, i) => !equalityFn(arg, lastArgs[i]))) {
      hasBeenCalled = true;
      lastArgs = args;
      lastResult = func(...args);
    }

    return lastResult;
  };
  /**
   * Reset the internal cache and return it's cache size before reset
   */


  memoizedFunc.resetCache = () => {
    const cacheSize = hasBeenCalled ? 1 : 0;
    hasBeenCalled = false;
    return cacheSize;
  };

  return memoizedFunc;
}