import invariant from '../../lib/invariant';
export const numberIdInvariant = id => {
  const parsed = parseInt(id, 10);
  invariant(typeof parsed === 'number' && !isNaN(parsed), 'Expected id to be parsable as a number not a %s. id was "%s".', typeof id, id);
};