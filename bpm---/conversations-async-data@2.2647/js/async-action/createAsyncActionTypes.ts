import { STARTED, SUCCEEDED, FAILED, UNINITIALIZED, OUT_OF_SYNC } from '../async-data/constants/asyncStatuses';
import invariant from '../lib/invariant';
import isActionType from '../lib/isActionType';

/**
 * @description given a base action name, returns an
 * object actions for all async statuses. Intended
 * to be used with ./createAsyncAction.
 * @param {String} actionName a base action name
 * @returns {Object} request status action types
 *
 * @example <caption>Async actions for fetching a record</caption>
 * const THREAD_FETCH = createAsyncActionTypes('THREAD_FETCH');
 * // THREAD_FETCH === {
 * //   FAILED: 'THREAD_FETCH_FAILED',
 * //   SUCCEEDED: 'THREAD_FETCH_SUCCEEDED',
 * //   STARTED: 'THREAD_FETCH_STARTED',
 * // }
 */
export const createAsyncActionTypes = actionName => {
  invariant(isActionType(actionName), 'createAsyncActionTypes requires a valid base actionName');
  return {
    [FAILED]: `${actionName}_FAILED`,
    [OUT_OF_SYNC]: `${actionName}_OUT_OF_SYNC`,
    [STARTED]: `${actionName}_STARTED`,
    [SUCCEEDED]: `${actionName}_SUCCEEDED`,
    [UNINITIALIZED]: `${actionName}_UNINITIALIZED`
  };
};