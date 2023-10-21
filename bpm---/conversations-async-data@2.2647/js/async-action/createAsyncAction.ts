import promiseDone from 'hs-promise-utils/promiseDone';
import invariant from '../lib/invariant';
import isActionType from '../lib/isActionType';

const isFunction = maybeFn => typeof maybeFn === 'function';

const isObject = maybeObj => typeof maybeObj === 'object' && !Array.isArray(maybeObj);

const areValidActionTypes = actionTypes => isObject(actionTypes) && isActionType(actionTypes.SUCCEEDED) && isActionType(actionTypes.STARTED) && isActionType(actionTypes.FAILED);

const buildAsyncActionDispatcher = ({
  actionTypes,
  failureMetaActionCreator,
  successMetaActionCreator,
  toRecordFn
}) => (requestPromise, requestArgs) => dispatch => {
  const {
    STARTED,
    SUCCEEDED,
    FAILED
  } = actionTypes;
  dispatch({
    type: STARTED,
    payload: {
      requestArgs
    }
  });
  promiseDone(requestPromise, resp => {
    const payload = {
      requestArgs,
      data: toRecordFn(resp)
    };
    dispatch({
      type: SUCCEEDED,
      payload,
      meta: successMetaActionCreator(payload)
    });
  }, error => {
    const payload = {
      requestArgs,
      error
    };
    dispatch({
      type: FAILED,
      payload,
      meta: failureMetaActionCreator(payload)
    });
  });
  return;
};
/**
 * createAsyncAction is a utility for creating generic thunks that
 * make some asynchronous request.
 *
 * Use Cases:
 * - Fetch an individual record with a custom error metadata builder
 * - Fetch a list of records
 *
 * @param {Object|Map} props
 * @param {Object} [props.actionTypes] an object containing string values for 'SUCCEEDED',
 *                                     'FAILED', and 'STARTED' keys.
 * @param {Function} [props.requestFn] a request function that returns a promise
 * @param {Function} [props.toRecordFn] converts the resolved value from requestFn to a record
 * @param {Function} [props.failureMetaActionCreator] builds a `meta` object on failure
 * @param {Function} [props.successMetaActionCreator] builds a `meta` object on success
 *
 * @example <caption>An individual record is fetched</caption>
 * const Thread = Record({threadId: null})
 * const fetchThread = createAsyncAction({
 *   actionTypes: {
 *     SUCCEEDED: 'FETCH_THREAD_SUCCEEDED',
 *     STARTED: 'FETCH_THREAD_STARTED',
 *     FAILED: "FETCH_THREAD_FAILED",
 *   },
 *   requetsFn: fetchThreadClient,
 *   toRecordFn: Thread,
 *   failureMetaActionCreator: (error) => {
 *     if(error.status === 404) {
 *       return alertMeta
 *     }
 *   }
 * })
 *
 * dispatch(fetchThread({threadId: 123}))
 *
 * @example <caption>A list of records is fetched</caption>
 * const Thread = Record({threadId: null})
 * const fetchThreads = createAsyncAction({
 *   actionTypes: {
 *     SUCCEEDED: 'FETCH_THREADS_SUCCEEDED',
 *     STARTED: 'FETCH_THREADS_STARTED',
 *     FAILED: "FETCH_THREADS_FAILED",
 *   },
 *   requetsFn: fetchThreadsClient,
 *   toRecordFn: (threads) => List(threads.map(Thread)),
 * })
 *
 * dispatch(fetchThreads({threadListId: 321}))
 */


export const createAsyncAction = ({
  actionTypes,
  requestFn,
  toRecordFn,
  failureMetaActionCreator = () => ({}),
  successMetaActionCreator = () => ({})
}) => {
  invariant(areValidActionTypes(actionTypes), `createAsyncAction expected actionTypes to be an Object containing valid type strings for keys: "FAILED", "STARTED", and "SUCCEEDED". Got: ${actionTypes}`);
  invariant(isFunction(requestFn), `createAsyncAction Expected requestFn to be a Function. Got: "${requestFn}"`);
  invariant(isFunction(toRecordFn), `createAsyncAction expected toRecordFn to be a Function. Got: "${toRecordFn}"`);
  const asyncActionDispatcher = buildAsyncActionDispatcher({
    actionTypes,
    failureMetaActionCreator,
    successMetaActionCreator,
    toRecordFn
  });

  const composed = requestArgs => {
    invariant(!requestArgs || isObject(requestArgs), `requestArgs must be an Object. Received ${typeof requestArgs}`);
    return asyncActionDispatcher(requestFn(requestArgs), requestArgs);
  };

  composed.asyncActionDispatcher = asyncActionDispatcher;
  return composed;
};