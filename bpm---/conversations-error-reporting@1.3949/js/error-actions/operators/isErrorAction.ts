import { ignoreError, getErrorMeta } from './errorActionGetters';
const ERROR_ACTION_REGEX = /.+_(FAILED|FAILURE)/;
export const isErrorAction = action => {
  if (ERROR_ACTION_REGEX.test(action.type) && !ignoreError(action)) {
    return true;
  }

  if (getErrorMeta(action) && !ignoreError(action)) {
    return true;
  }

  return false;
};