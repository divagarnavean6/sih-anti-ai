'use es6';

import isFunction from './isFunction';
import { ACTION_TYPE_DELIMITER } from './combineActions';

function reduceReducers(...reducers) {
  return (previous, current) => {
    return reducers.reduce((p, r) => r(p, current), previous);
  };
}

function handleAction(types, reducer) {
  const splitTypes = types.split(ACTION_TYPE_DELIMITER);
  return (state, action) => {
    if (!splitTypes.includes(action.type)) {
      return state;
    }

    return isFunction(reducer) ? reducer(state, action) : state;
  };
}

export default function handleActions(handlers, defaultState) {
  const reducers = Object.getOwnPropertyNames(handlers).map(types => {
    return handleAction(types, handlers[types]);
  });
  const reducer = reduceReducers(...reducers);
  return typeof defaultState !== 'undefined' ? (state = defaultState, action) => reducer(state, action) : reducer;
}