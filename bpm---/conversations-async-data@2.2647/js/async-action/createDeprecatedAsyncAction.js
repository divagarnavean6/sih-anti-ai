'use es6';

import promiseDone from 'hs-promise-utils/promiseDone';
import { createAsyncActionTypes } from './createAsyncActionTypes';
import deprecateFunction from '../lib/deprecateFunction';

const getActionTypes = (actionName, actionTypes) => {
  if (actionTypes) return actionTypes;
  return createAsyncActionTypes(actionName);
};

export const createDeprecatedAsyncAction = deprecateFunction('`createDeprecatedAsyncAction` will be removed soon - Use `createAsyncAction` instead', ({
  requestFn,
  actionName,
  actionTypes = null,
  toRecordFn,
  successMetaActionCreator = () => ({}),
  failureMetaActionCreator = () => ({})
}) => {
  if (!actionName && !actionTypes || actionName && actionTypes) {
    throw new Error('Either an actionName or actionTypes are required to create an async action');
  }

  if (!requestFn || typeof requestFn !== 'function') {
    throw new Error(`Invalid requestFn "${requestFn}"`);
  }

  if (!toRecordFn || typeof toRecordFn !== 'function') {
    throw new Error(`Invalid toRecordFn "${toRecordFn}"`);
  }

  const {
    STARTED,
    SUCCEEDED,
    FAILED
  } = getActionTypes(actionName, actionTypes);
  return requestArgs => dispatch => {
    const isObject = typeof requestArgs === 'object' && !Array.isArray(requestArgs);

    if (requestArgs && !isObject) {
      throw new Error(`Invalid argument "${requestArgs}"`);
    }

    dispatch({
      type: STARTED,
      payload: {
        requestArgs
      }
    });
    const promise = requestFn(requestArgs).then(resp => {
      const payload = {
        requestArgs,
        data: toRecordFn(resp)
      };
      return dispatch({
        type: SUCCEEDED,
        payload,
        meta: successMetaActionCreator(payload)
      });
    }, error => {
      const payload = {
        requestArgs,
        error
      };
      return dispatch({
        type: FAILED,
        payload,
        meta: failureMetaActionCreator(payload)
      });
    });
    promiseDone(promise);
    return promise;
  };
});