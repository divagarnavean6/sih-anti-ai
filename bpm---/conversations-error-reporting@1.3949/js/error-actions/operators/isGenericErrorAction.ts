import { getErrorTitle, isSilent } from './errorActionGetters';
export const isGenericErrorAction = action => {
  return !getErrorTitle(action) && !isSilent(action);
};