import { buildErrorMetaObject } from './buildErrorMetaObject';
export const silenceErrorAlert = ({
  isVisibleToUser = false,
  ignoreStatusCodes = [0],
  ignore = false,
  error
} = {}) => {
  if (error && ignoreStatusCodes.some(code => code === error.status)) {
    ignore = true;
  }

  return buildErrorMetaObject({
    silent: true,
    isVisibleToUser,
    ignore
  });
};