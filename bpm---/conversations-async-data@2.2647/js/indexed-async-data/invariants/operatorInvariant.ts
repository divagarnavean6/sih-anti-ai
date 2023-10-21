import invariant from '../../lib/invariant';
export const operatorInvariant = operator => invariant(typeof operator === 'function', 'Expected an operator to be a `function` not a `%s`', typeof operator);