import curry from 'transmute/curry';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { getIdTransform } from './getters';
/**
 * Transform an id into a key for IndexedAsyncData
 *
 * @param {Any} id an id that passes the id invariant
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to get the entry in
 * @returns {Any} key
 */

export const applyIdTransform = curry((id, indexedData) => {
  indexedDataInvariant(indexedData);
  const idTransform = getIdTransform(indexedData);
  return idTransform(id);
});