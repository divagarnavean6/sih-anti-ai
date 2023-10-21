import { createStack } from 'hub-http';
import { onResponse, onResponseError } from 'hub-http/middlewares/core';
import { checkNetwork } from '../network/checkNetwork';
import { buildNetworkUnavailableError } from '../util/buildNetworkUnavailableError';
const ERROR_CODES = ['TIMEOUT', 'NETWORKERROR'];

/**
 * @description A hub-http middleware that decorates timeout
 * and network errors with a special message when the client
 * is disconnected from the internet.
 */
export const checkNetworkOnTimeout = () => {
  let networkAvailable = true;
  return createStack(onResponse(response => {
    networkAvailable = true;
    return Promise.resolve(response);
  }), onResponseError(error => {
    const {
      status,
      errorCode
    } = error;

    if (status === 0 && ERROR_CODES.includes(errorCode)) {
      return !networkAvailable ? Promise.reject(buildNetworkUnavailableError(error)) : checkNetwork().then(({
        online
      }) => {
        if (!online) {
          networkAvailable = false;
          return Promise.reject(buildNetworkUnavailableError(error));
        }

        return Promise.reject(error);
      });
    }

    return Promise.reject(error);
  }));
};