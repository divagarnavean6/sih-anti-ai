import invariant from '../../lib/invariant';
import IndexedAsyncData from '../IndexedAsyncData';
export const indexedDataInvariant = indexedData => invariant(indexedData instanceof IndexedAsyncData, 'Expected indexedData to be a `IndexedAsyncData` not a `%s`', typeof indexedData);