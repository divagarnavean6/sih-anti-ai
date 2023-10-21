/* hs-eslint ignored failing-rules */

/* eslint-disable hubspot-dev/no-confusing-browser-globals */
import curry from 'transmute/curry';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { deleteEntries } from './deleteEntries';
import { getEntries, getEvict } from './getters';
/**
 * Apply an entry eviction strategy to to IndexedAsyncData
 *
 * @param {IndexedAsyncData} indexedData IndexedAsyncData
 */

export const applyEvict = curry(indexedData => {
  indexedDataInvariant(indexedData);
  const evict = getEvict(indexedData);

  try {
    // TODO: curry types need fixing
    return deleteEntries(evict(getEntries(indexedData)), indexedData);
  } catch (error) {
    error.indexedAsyncDataName = name;
    throw error;
  }
});