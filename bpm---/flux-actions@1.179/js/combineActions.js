'use es6';

export const ACTION_TYPE_DELIMITER = '||';
export default function combineActions(...actionTypes) {
  return actionTypes.join(ACTION_TYPE_DELIMITER);
}