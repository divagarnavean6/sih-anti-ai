'use es6';

import always from '../always';
import isFunction from '../isFunction';
import isNumber from '../isNumber';
import protocol from '../protocol';
const isAnyValue = always(true);
export const clear = protocol({
  args: [protocol.TYPE],
  name: 'clear'
});
/**
 * @private
 * Returns the number of values in `subject`.
 *
 * @param {TYPE} subject
 * @return {number}
 */

export const count = protocol({
  args: [protocol.TYPE],
  name: 'count'
});
/**
 * @private
 * Returns a concatenated `subject` and `update`.
 *
 * @param {any} update
 * @param {TYPE} subject
 * @return {number}
 */

export const concat = protocol({
  args: [isAnyValue, // update
  protocol.TYPE],
  name: 'concat'
});
/**
 * @private
 * Returns a Seq of key,value tuples (in JS Array)
 *
 * @param {TYPE}
 * @return {Seq<[any, any]>}
 */

export const entrySeq = protocol({
  args: [protocol.TYPE],
  name: 'entrySeq'
});
/**
 * @private
 * Returns true if `predicate` returns `true` for _all_ items in `subject`.
 *
 * @param {Function} predicate
 * @param {TYPE} subject
 * @return {bool}
 */

export const every = protocol({
  args: [isFunction, // predicate
  protocol.TYPE],
  name: 'every'
});
/**
 * @private
 * Returns a new value of items in `subject` for which `predicate` returns `true`.
 *
 * @param {Function} predicate
 * @param {TYPE} subject
 */

export const filter = protocol({
  args: [isFunction, // predicate
  protocol.TYPE],
  name: 'filter'
});
export const flattenN = protocol({
  args: [isNumber, // depth
  protocol.TYPE],
  name: 'flattenN'
});
export const forEach = protocol({
  args: [isFunction, // effect
  protocol.TYPE],
  name: 'forEach'
});
/**
 * @private
 * Return the value of `key` in `subject`.
 *
 * @param {any} key
 * @param {TYPE} subject
 * @return {any}
 */

export const get = protocol({
  args: [isAnyValue, // key
  protocol.TYPE],
  name: 'get',
  fallback: (key, obj) => obj[key]
});
/**
 * @private
 * Returns `true` if `key` is in `subject`'s keys.
 *
 * @param {any} key
 * @param {TYPE} subject
 * @return {any}
 */

export const has = protocol({
  args: [isAnyValue, // key
  protocol.TYPE],
  name: 'has'
});
/**
 * @private
 * Return a `Seq` of the keys in `subject`.
 *
 * @param {TYPE<K, _>} subject
 * @return {Seq<K>}
 */

export const keySeq = protocol({
  args: [protocol.TYPE],
  name: 'keySeq'
});
export const keyedEquivalent = protocol({
  args: [protocol.TYPE],
  name: 'keyedEquivalent'
});
/**
 * @private
 * Returns a new value by applying `mapper` to each item in `subject`.
 *
 * @param {Function} mapper
 * @param {TYPE} subject
 * @return {TYPE}
 */

export const map = protocol({
  args: [isFunction, // mapper
  protocol.TYPE],
  name: 'map'
});
/**
 * @private
 * Returns a new value by applying `mapper` to each item in `subject`.
 *
 * @param {Function} mapper
 * @param {TYPE} subject
 * @return {TYPE}
 */

export const reduce = protocol({
  args: [isAnyValue, // accumulator
  isFunction, // reducer
  protocol.TYPE],
  name: 'reduce'
});
/**
 * @private
 * Set the `value` of `key` in `subject`.
 *
 * @param {any} value
 * @param {any} key
 * @param {TYPE} subject
 * @return {TYPE}
 */

export const set = protocol({
  args: [isAnyValue, // value
  isAnyValue, // key
  protocol.TYPE],
  name: 'set'
});
/**
 * @private
 * Returns true if `predicate` returns `true` for _any_ items in `subject`.
 *
 * @param {Function} predicate
 * @param {TYPE} subject
 * @return {bool}
 */

export const some = protocol({
  args: [isFunction, // predicate
  protocol.TYPE],
  name: 'some'
});
/**
 * @private
 * Returns a copy of `subject` sorted according to `getSortValue`.
 *
 * @param {Function} getSortValue
 * @param {TYPE} subject
 * @return {TYPE}
 */

export const sortBy = protocol({
  args: [isFunction, // getSortValue
  protocol.TYPE],
  name: 'sortBy'
});
/**
 * @private
 * Return a `Seq` of the values in `subject`.
 *
 * @param {TYPE<_, V>} subject
 * @return {Seq<K>}
 */

export const valueSeq = protocol({
  args: [protocol.TYPE],
  name: 'valueSeq'
});