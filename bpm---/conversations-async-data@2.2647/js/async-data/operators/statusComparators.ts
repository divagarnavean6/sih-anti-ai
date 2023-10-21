import curry from 'transmute/curry';
import every from 'transmute/every';
import some from 'transmute/some';
import { UNINITIALIZED, OUT_OF_SYNC, STARTED, SUCCEEDED, FAILED } from '../constants/asyncStatuses';
import { getStatus } from './getters';
const isStatus = curry((status, asyncData) => getStatus(asyncData) === status);

const everyStatus = status => (...asyncData) => every(isStatus(status), asyncData);

const someStatus = status => (...asyncData) => some(isStatus(status), asyncData);
/**
 * Predicate to determine if an AsyncData is uninitialized
 * @param {AsyncData}
 * @returns {Boolean}
 */


export const isUninitialized = isStatus(UNINITIALIZED);
/**
 * Predicate to determine if an AsyncData is out of sync
 * @param {AsyncData}
 * @returns {Boolean}
 */

export const isOutOfSync = isStatus(OUT_OF_SYNC);
/**
 * Predicate to determine if an AsyncData is started
 * @param {AsyncData}
 * @returns {Boolean}
 */

export const isStarted = isStatus(STARTED);
/**
 * Predicate to determine if an AsyncData is succeeded
 * @param {AsyncData}
 * @returns {Boolean}
 */

export const isSucceeded = isStatus(SUCCEEDED);
/**
 * Predicate to determine if an AsyncData is failed
 * @param {AsyncData}
 * @returns {Boolean}
 */

export const isFailed = isStatus(FAILED);
/**
 * Predicate to determine if an AsyncData is loading
 * @param {AsyncData}
 * @returns {Boolean}
 */

export const isLoading = asyncData => isStarted(asyncData) || isUninitialized(asyncData);
/**
 * Predicate to determine if all async statuses are uninitialized
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const allUninitialized = everyStatus(UNINITIALIZED);
/**
 * Predicate to determine if all async statuses are out of sync
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const allOutOfSync = everyStatus(OUT_OF_SYNC);
/**
 * Predicate to determine if all async statuses are started
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const allStarted = everyStatus(STARTED);
/**
 * Predicate to determine if all async statuses are succeeded
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const allSucceeded = everyStatus(SUCCEEDED);
/**
 * Predicate to determine if all async statuses are failed
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const allFailed = everyStatus(FAILED);
/**
 * Predicate to determine if some async status is uninitialized
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const someUninitialized = someStatus(UNINITIALIZED);
/**
 * Predicate to determine if some async status is out of sync
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const someOutOfSync = someStatus(OUT_OF_SYNC);
/**
 * Predicate to determine if some async status is started
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const someStarted = someStatus(STARTED);
/**
 * Predicate to determine if some async status is succeeded
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const someSucceeded = someStatus(SUCCEEDED);
/**
 * Predicate to determine if some async status is failed
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const someFailed = someStatus(FAILED);
/**
 * Predicate to determine if some async status is loading
 * @param {...AsyncData}
 * @returns {Boolean}
 */

export const someLoading = (...asyncData) => someStarted(...asyncData) || someUninitialized(...asyncData);