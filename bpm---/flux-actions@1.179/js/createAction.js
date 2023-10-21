'use es6';

import isFunction from './isFunction';
export default function createAction(type, actionCreator, metaCreator) {
  return (...args) => {
    const action = {
      type
    };

    if (isFunction(actionCreator)) {
      action.payload = actionCreator(...args);
    }

    if (isFunction(metaCreator)) {
      action.meta = metaCreator(...args);
    }

    return action;
  };
}