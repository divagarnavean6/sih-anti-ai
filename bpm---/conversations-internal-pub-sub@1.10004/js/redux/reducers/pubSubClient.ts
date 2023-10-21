import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestStateUpdate } from 'conversations-async-data/async-data/operators/requestStateUpdate';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { stringIdInvariant } from 'conversations-async-data/indexed-async-data/invariants/stringIdInvariant';
import { INITIALIZE_PUBSUB, PUBSUB_READY, PUBSUB_RECONNECTED, PUBSUB_DISCONNECTED, PUBSUB_RECONNECTING, PUBSUB_SUSPENDED } from '../constants/actionTypes';
import { CONNECTED, DISCONNECTED, RECONNECTING, SUSPENDED } from '../constants/states';

const idenity = f => f; // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'new <Key, AsyncDataValue>(t?: Parti... Remove this comment to see the full error message


const initialState = IndexedAsyncData({
  name: 'pubSubClient',
  idInvariant: stringIdInvariant,
  // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'new <AsyncDataValue>(t?: Partial<As... Remove this comment to see the full error message
  notSetValue: AsyncData()
});
export const pubSubClient = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_PUBSUB.STARTED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestStarted, state);
      }

    case INITIALIZE_PUBSUB.SUCCEEDED:
      {
        const {
          client,
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestSucceededWithOperator(() => client), state);
      }

    case INITIALIZE_PUBSUB.FAILED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestFailed, state);
      }

    case PUBSUB_RECONNECTING:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'AsyncDataRecord<any>' is not ass... Remove this comment to see the full error message
        requestStateUpdate(RECONNECTING, idenity), state);
      }

    case PUBSUB_RECONNECTED:
    case PUBSUB_READY:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'AsyncDataRecord<any>' is not ass... Remove this comment to see the full error message
        requestStateUpdate(CONNECTED, idenity), state);
      }

    case PUBSUB_DISCONNECTED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'AsyncDataRecord<any>' is not ass... Remove this comment to see the full error message
        requestStateUpdate(DISCONNECTED, idenity), state);
      }

    case PUBSUB_SUSPENDED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'AsyncDataRecord<any>' is not ass... Remove this comment to see the full error message
        requestStateUpdate(SUSPENDED, idenity), state);
      }

    default:
      {
        return state;
      }
  }
};