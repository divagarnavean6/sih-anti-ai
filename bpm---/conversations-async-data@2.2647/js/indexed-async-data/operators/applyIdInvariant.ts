import curry from 'transmute/curry';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { getIdInvariant, getName } from './getters';
/**
 * Validate an id for IndexedAsyncData
 *
 * @param {Any} id an id that passes the id invariant
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to get the entry in
 */

export const applyIdInvariant = curry((id, indexedData) => {
  indexedDataInvariant(indexedData);
  const idInvariant = getIdInvariant(indexedData);
  const name = getName(indexedData);

  try {
    idInvariant(id);
  } catch (error) {
    error.indexedAsyncDataName = name;
    error.indexedAsyncDataValue = JSON.stringify(id);
    throw error;
  }
});