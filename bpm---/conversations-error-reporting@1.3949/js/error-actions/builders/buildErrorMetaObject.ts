/**
 * @description Build a error meta action to silence floating error alerts
 *
 * @example
 * const pollThreadListFailed = createAction(
 *   POLL_THREAD_LISTS_FAILED,
 *   error => ({ error }),
 *   error => buildErrorMetaObject({ titleText: 'Any string you want', message: 'A react node or string' })
 *  );
 */
export const buildErrorMetaObject = ({
  ignore = false,
  message,
  silent = false,
  titleText,
  displayEventId = true,
  isVisibleToUser = true,
  silenceErrorReporting = false
}) => ({
  error: {
    ignore,
    message,
    silent,
    titleText,
    displayEventId,
    isVisibleToUser,
    silenceErrorReporting
  }
});