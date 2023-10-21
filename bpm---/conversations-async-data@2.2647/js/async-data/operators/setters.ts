import updateIn from 'transmute/updateIn';
import setIn from 'transmute/setIn';
import { DATA, UPDATED_AT, STATUS, ERROR } from '../constants/keyPaths';
export const updateData = updateIn(DATA);
export const setStatus = setIn(STATUS);
export const setError = setIn(ERROR);
export function touch(asyncData) {
  return setIn(UPDATED_AT, Date.now(), asyncData);
}