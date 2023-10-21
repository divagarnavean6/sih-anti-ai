import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import { setError, touch, updateData } from './setters';

/**
 * Operate on data in AsyncData
 *
 * @param {Function} operator update operator to update state
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */
export const updateAsyncData = curry((operator, asyncData) => pipe(setError(null), updateData(operator), touch)(asyncData));