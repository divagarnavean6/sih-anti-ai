import { Set as ImmutableSet } from 'immutable';
import curry from 'transmute/curry';
import { ENTRIES } from '../constants/keyPaths';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { applyIdInvariant } from './applyIdInvariant';
import { applyIdTransform } from './applyIdTransform';
/**
 * Delete a set of entries in IndexedAsyncData
 *
 * @param {Set} ids a set of ids to be removed
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to delete the entry in
 * @returns {IndexedAsyncData}
 */

export const deleteEntries = curry((ids = ImmutableSet(), indexedData) => {
  indexedDataInvariant(indexedData);
  if (ids.size === 0) return indexedData;

  const reducer = (updatedEntries, id) => {
    applyIdInvariant(id, indexedData);
    return updatedEntries.delete(applyIdTransform(id, indexedData));
  };

  const updater = entries => ids.reduce(reducer, entries); // TODO: updateIn types need fixing


  return indexedData.updateIn(ENTRIES, updater);
});