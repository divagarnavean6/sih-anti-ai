import { silenceErrorAlert } from 'conversations-error-reporting/error-actions/builders/silenceErrorAlert';
import { INITIALIZE_PUBSUB, PUBSUB_READY, PUBSUB_RECONNECTED, PUBSUB_DISCONNECTED, PUBSUB_RECONNECTING, PUBSUB_SUSPENDED } from '../constants/actionTypes';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
export const initializePubSubSucceeded = ( // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'client' implicitly has an 'any' type.
client, clientKey = DEFAULT_CLIENT_KEY) => ({
  type: INITIALIZE_PUBSUB.SUCCEEDED,
  payload: {
    client,
    clientKey
  }
});
export const initializePubSubStarted = (clientKey = DEFAULT_CLIENT_KEY) => ({
  type: INITIALIZE_PUBSUB.STARTED,
  payload: {
    clientKey
  }
});
export const initializePubSubFailed = ( // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
error, clientKey = DEFAULT_CLIENT_KEY) => ({
  type: INITIALIZE_PUBSUB.FAILED,
  payload: {
    clientKey,
    error
  },
  meta: silenceErrorAlert()
});
export const pubSubReady = (clientKey = DEFAULT_CLIENT_KEY) => ({
  type: PUBSUB_READY,
  payload: {
    clientKey
  }
});
export const pubSubReconnected = (clientKey = DEFAULT_CLIENT_KEY) => ({
  type: PUBSUB_RECONNECTED,
  payload: {
    clientKey
  }
});
export const pubSubReconnecting = (clientKey = DEFAULT_CLIENT_KEY) => ({
  type: PUBSUB_RECONNECTING,
  payload: {
    clientKey
  }
});
export const pubSubDisconnected = (clientKey = DEFAULT_CLIENT_KEY) => ({
  type: PUBSUB_DISCONNECTED,
  payload: {
    clientKey
  }
});
export const pubSubSuspended = (clientKey = DEFAULT_CLIENT_KEY) => ({
  type: PUBSUB_SUSPENDED,
  payload: {
    clientKey
  }
});