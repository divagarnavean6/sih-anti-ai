import getIn from 'transmute/getIn';
// @ts-expect-error getIn subjects are returned as unknown
export const getErrorInPayload = getIn(['payload', 'error']); // @ts-expect-error getIn subjects are returned as unknown

export const getErrorMeta = getIn(['meta', 'error']); // @ts-expect-error getIn subjects are returned as unknown

export const getErrorTitle = getIn(['meta', 'error', 'titleText']); // @ts-expect-error getIn subjects are returned as unknown

export const getErrorMessage = getIn(['meta', 'error', 'message']);
export const getDisplayEventId = action => getIn(['meta', 'error', 'displayEventId'], action) !== false; // @ts-expect-error getIn subjects are returned as unknown

export const ignoreError = getIn(['meta', 'error', 'ignore']); // @ts-expect-error getIn subjects are returned as unknown

export const isSilent = getIn(['meta', 'error', 'silent']); // @ts-expect-error getIn subjects are returned as unknown

export const isErrorReoprtingSilenced = getIn(['meta', 'error', 'silenceErrorReporting']); // @ts-expect-error getIn subjects are returned as unknown

export const isVisibleErrorAction = getIn(['meta', 'error', 'isVisibleToUser']);
export const getError = action => {
  if (action.payload instanceof Error) {
    return action.payload;
  }

  const errorInPayload = getErrorInPayload(action);

  if (errorInPayload instanceof Error) {
    return errorInPayload;
  }

  return null;
};
export const getActionType = action => {
  // @ts-expect-error getIn subjects are returned as unknown
  return getIn(['type'], action);
};