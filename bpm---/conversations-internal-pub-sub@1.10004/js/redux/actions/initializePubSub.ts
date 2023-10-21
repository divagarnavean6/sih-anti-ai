import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
import { initializePubSubStarted, initializePubSubSucceeded, initializePubSubFailed, pubSubReady, pubSubReconnected, pubSubDisconnected, pubSubReconnecting, pubSubSuspended } from './asyncPubSubClientActions';

const noop = () => {};

const DEFAULT_LIFECYCLE_HOOKS = {
  onConnect: noop,
  onConnecting: noop,
  onDisconnect: noop,
  onFailure: noop,
  onSuspended: noop
};
/**
 * @typedef lifeCycleHooks
 * @type {Object}
 * @property {function} onConnect - Called when the client has connected
 * @property {function} onConnecting - Called when the client is connecting
 * @property {function} onDisconnect - Called when the client has disconnected
 * @property {function} onSuspended - Called when the client becomes suspended
 * @property {function} onFailure - Called when the client fails (not recoverable)
 */

/**
 * Initialize a connection
 *
 * @param {Object} connectionConfig - connection configuration
 * @param {Object} connectionConfig.clientOptions - Ably client options found here https://www.ably.io/documentation/realtime/usage#client-options
 * @param {lifeCycleHooks} connectionConfig.lifeCycleHooks - Connection life cycle callbacks
 * @param {function} connectionConfig.resolveBuilder - A resolver function to load the pub sub code split
 */

export const initializePubSub = ({
  clientOptions,
  lifecycleHooks = DEFAULT_LIFECYCLE_HOOKS,
  resolveBuilder,
  clientKey = DEFAULT_CLIENT_KEY
}) => dispatch => {
  dispatch(initializePubSubStarted(clientKey));
  lifecycleHooks = Object.assign({}, DEFAULT_LIFECYCLE_HOOKS, {}, lifecycleHooks);
  return resolveBuilder().then(({
    buildConversationsPubSub
  }) => {
    const client = buildConversationsPubSub({
      clientOptions,
      lifecycleHooks: Object.assign({}, lifecycleHooks, {
        onConnect(params) {
          if (params.reconnected) {
            dispatch(pubSubReconnected(clientKey));
          } else {
            dispatch(pubSubReady(clientKey));
          }

          lifecycleHooks.onConnect(params);
        },

        onConnecting({
          reconnecting
        }) {
          if (reconnecting) {
            dispatch(pubSubReconnecting(clientKey));
          }

          lifecycleHooks.onConnecting({
            reconnecting
          });
        },

        onDisconnect() {
          dispatch(pubSubDisconnected(clientKey));
          lifecycleHooks.onDisconnect();
        },

        onSuspended() {
          dispatch(pubSubSuspended(clientKey));
          lifecycleHooks.onSuspended();
        }

      })
    });
    dispatch(initializePubSubSucceeded(client, clientKey));
    client.connect();
  }, error => {
    dispatch(initializePubSubFailed(error, clientKey));
    reportError({
      error
    });
  });
};