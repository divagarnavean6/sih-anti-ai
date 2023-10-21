import { buildErrorMetaObject } from './buildErrorMetaObject';

/**
 * @description Using silenceErrorReporting will display an error notifcation
 * but will not report the error
 *
 * @example
 * const fetchContactError = createAction(
 *   ActionTypes.GET_CONTACT_FAILED,
 *   error => ({ error }),
 *   error => buildRequestErrorMetaObject({ silenceErrorReportingCodes: [404], error })
 * );
 *
 * @example
 * const fetchContactError = createAction(
 *   ActionTypes.GET_CONTACT_FAILED,
 *   error => ({ error }),
 *   error => buildRequestErrorMetaObject({ silenceErrorReporting: true })
 *
 * @description Ignoring a status code will not reoprt the error nor display the error
 *
 * @example
 * const fetchContactError = createAction(
 *   ActionTypes.GET_CONTACT_FAILED,
 *   error => ({ error }),
 *   error => buildRequestErrorMetaObject({ ignoreStatusCodes: [404], error })
 *
 * const fetchContactError = createAction(
 *   ActionTypes.GET_CONTACT_FAILED,
 *   error => ({ error }),
 *   error => buildRequestErrorMetaObject({ ignore: true })
 */
export const buildRequestErrorMetaObject = ({
  titleText,
  message,
  ignore = false,
  ignoreStatusCodes = [],
  silenceErrorReportingCodes = [0],
  silenceErrorReporting = false,
  error
}) => {
  const isIgnored = ignore || error && ignoreStatusCodes.some(code => code === error.status);
  if (isIgnored) return buildErrorMetaObject({
    ignore: true
  });

  if (error && silenceErrorReportingCodes.some(code => code === error.status)) {
    silenceErrorReporting = true;
  }

  return buildErrorMetaObject({
    titleText,
    message,
    silenceErrorReporting
  });
};