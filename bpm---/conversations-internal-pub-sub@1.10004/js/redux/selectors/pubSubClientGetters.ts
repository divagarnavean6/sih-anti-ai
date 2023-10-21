import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getEntry } from 'conversations-async-data/indexed-async-data/operators/getters';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
export const getIndexedAsyncPubSubClients = get('pubSubClient');
export const getClientKeyFromProps = (__state, {
  clientKey = DEFAULT_CLIENT_KEY
} = {}) => clientKey;
export const getAsyncPubSubClient = createSelector([getClientKeyFromProps, getIndexedAsyncPubSubClients], getEntry); // (state: State, props?: Props) => AsyncValueOfIndexedAsyncData<PubSubClient>;

export const getPubSubClient = createSelector([getAsyncPubSubClient], getData); // (state: State,props?: Props) => PubSubClient;

export const getPubSubVendor = createSelector([getPubSubClient], client => client && client.vendor);