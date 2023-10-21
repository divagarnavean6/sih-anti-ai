import { isSilent, getError, isVisibleErrorAction } from '../error-actions/operators/errorActionGetters';
import { reportError } from './reportError';
import { isGenericErrorAction } from '../error-actions/operators/isGenericErrorAction';
/**
 * @description Report an error contained within an action
 * @returns {String} sentry event ID
 */

export const reportErrorAction = action => {
  const error = getError(action) || new Error(`${action.type} is being dispatched without an error`); // eslint-disable-next-line no-console

  console.error(`Error report triggered by '${action.type} (Silent: ${!!isSilent(action)})`);
  const isVisibleAction = isVisibleErrorAction(action); // use isVisibleToUser if set, otherwise fallback to !isSilent

  const isVisibleError = isVisibleAction || (isVisibleAction === false ? false : !isSilent(action));
  return reportError({
    error,
    tags: {
      actionType: action.type,
      isGenericErrorMessage: isGenericErrorAction(action),
      isVisibleToUser: isVisibleError
    }
  });
};