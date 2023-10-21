import invariant from '../../lib/invariant';
export const stringIdInvariant = id => {
  invariant(typeof id === 'string', 'Expected id to be a string not a %s', typeof id);
};
export const stringIdInvariantWithName = name => id => {
  invariant(typeof id === 'string', `${name} Expected id to be a string not a %s`, typeof id);
};