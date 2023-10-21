import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import { FAILED } from '../constants/asyncStatuses';
import { setError, setStatus, touch } from './setters';

/**
 * Set status when a request fails
 *
 * @param {Error} error error object to set on the AsyncData record
 * @param {AsyncData} asyncData AsyncData record to update
 * @returns {AsyncData}
 */
export const requestFailedWithError = curry((error, asyncData) => pipe(setError(error), setStatus(FAILED), touch)(asyncData));