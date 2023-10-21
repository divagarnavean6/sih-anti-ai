import * as helpers from './helpers';
export const create = (name, createError, rules, omitExtras = true) => {
  const storedRules = helpers.shallowCopy(rules);

  const getKeys = () => helpers.getObjectKeys(storedRules);

  const mutate = callback => {
    const updatedRules = callback(helpers.mapObject(storedRules, key => helpers.shallowCopy(storedRules[key])));
    return create(name, createError, updatedRules, omitExtras);
  };

  const validate = (subject, caller, callback) => {
    getKeys().forEach(key => {
      const {
        types,
        oneOf,
        isOptional
      } = storedRules[key];
      const entry = subject[key];
      const isDefined = entry !== undefined;
      const typeOfValue = helpers.getRealTypeOf(entry);

      if (!isOptional && !isDefined) {
        throw createError(`Missing required ${name} "${key}". ${caller} requires that a value be passed for ${name} "${key}". Received "undefined".`);
      }

      if (!isDefined) {
        return;
      }

      if (helpers.isArray(types) && !types.includes(typeOfValue)) {
        throw createError(`Invalid ${name}. ${caller} requires that the "${key}" ${name} type be one of ["${types.join('", "')}"]. Received "${typeOfValue}".`);
      }

      if (typeOfValue === 'function') {
        return;
      }

      if (helpers.isArray(oneOf) && !oneOf.includes(String(entry))) {
        throw createError(`Invalid ${name}. ${caller} requires that the "${key}" ${name} be one of ["${oneOf.join('", "')}"]. Received "${entry}".`);
      }

      helpers.ensureFn(callback)({
        key,
        entry,
        isOptional
      });
    });
    return true;
  };

  const validateEach = (subject, caller) => {
    helpers.getObjectKeys(subject).forEach(key => {
      const entry = subject[key];
      validate(entry, caller);
    });
  };

  const normalize = subject => {
    const pluckedSubject = helpers.pluck('default', storedRules);
    const withDefaults = helpers.defaults(subject, pluckedSubject);

    if (omitExtras) {
      return helpers.pick(withDefaults, getKeys());
    }

    return withDefaults;
  };

  const normalizeEach = subject => {
    return helpers.reduceObject(subject)((accumulator, key) => {
      const entry = subject[key];
      accumulator[key] = normalize(entry);
      return accumulator;
    });
  };

  return {
    getKeys,
    mutate,
    normalize,
    normalizeEach,
    validate,
    validateEach,
    _peek: () => helpers.deepFreeze(storedRules)
  };
};