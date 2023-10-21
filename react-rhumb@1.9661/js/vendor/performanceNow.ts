// adapted from https://github.com/facebook/fbjs/blob/afcf932e06793be334ac2a0afc78fd23ed356765/packages/fbjs/src/performance/performanceNow.js

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import performance from './performance';
const loadTime = Date.now();
const performanceNow = performance.now ? () => performance.now() : () => Date.now() - loadTime;
export default performanceNow;