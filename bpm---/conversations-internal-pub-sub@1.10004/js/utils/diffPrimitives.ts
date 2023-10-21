/**
 * Diff arrays of primitive values (numbers, strings, booleans, undefined, null, and symbols)
 */
export const diffPrimitives = (a, b) => a.filter(x => !b.includes(x));