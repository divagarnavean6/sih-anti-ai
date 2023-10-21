import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import curry from 'transmute/curry';
import getIn from 'transmute/getIn';
import { ENTRIES, EVICT, ID_INVARIANT, ID_TRANSFORM, NAME, NOT_SET_VALUE } from '../constants/keyPaths';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { applyIdTransform } from './applyIdTransform';
import { applyIdInvariant } from './applyIdInvariant';
export const getEvict = indexedAsyncData => getIn(EVICT)(indexedAsyncData);
export const getIdInvariant = indexedAsyncData => getIn(ID_INVARIANT)(indexedAsyncData);
export const getIdTransform = indexedAsyncData => getIn(ID_TRANSFORM)(indexedAsyncData);
export const getName = indexedAsyncData => getIn(NAME)(indexedAsyncData);
export const getNotSetValue = indexedAsyncData => getIn(NOT_SET_VALUE)(indexedAsyncData);

/**
 * @description Get a single entry out of an indexed async data by id.
 * @param id an id of the type indexedData is indexed by
 * @param {IndexedAsyncData} indexedData
 */
export const getEntry = curry((id, indexedData) => {
  indexedDataInvariant(indexedData);
  applyIdInvariant(id, indexedData);
  const key = applyIdTransform(id, indexedData);
  const entries = indexedData.getIn(ENTRIES);
  return entries.get(key, getNotSetValue(indexedData));
});
/**
 * @description Get multiple entries out of an IndexedAsyncData
 * record using an optional set of ids
 * @param {Set<Any>} ids a set of ids that pass the idInvariant
 * @param {IndexedAsyncData} indexedData
 */

export const getEntries = (indexedData, ids = ImmutableSet()) => {
  indexedDataInvariant(indexedData);
  if (!ids.size) return indexedData.getIn(ENTRIES);
  return ids.reduce((accumulator, id) => {
    applyIdInvariant(id, indexedData);
    const key = applyIdTransform(id, indexedData);
    const entries = indexedData.getIn(ENTRIES);
    const asyncData = entries.get(key, getNotSetValue(indexedData));
    return accumulator.set(key, asyncData);
  }, ImmutableMap());
};