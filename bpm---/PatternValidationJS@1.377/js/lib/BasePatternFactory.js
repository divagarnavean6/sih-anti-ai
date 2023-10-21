/* eslint no-console: 0 */
'use es6'; // BasePatternFactory
// ---
// Standardize pattern structure and provide free invariant checking.

const REQUIRED_PROPERTIES_CHECK = (name, validator) => {
  if (!name || typeof name !== 'string') {
    console.error(`Required "name" string property not provider for pattern. Provided: ${typeof name}`);
  }

  if (!validator || typeof validator !== 'function') {
    console.error(`Required "validator" callback not provider for "${name} pattern". Provided: ${typeof validator}`);
  }
};

const TYPE_INVARIANT = (name, method, input, requiredInputType) => {
  const actualInputType = typeof input;

  if (actualInputType !== requiredInputType) {
    console.error(`Invariant error in ${name} pattern. Pattern.${method}() method can only be passed a ${requiredInputType}. Provided: ${actualInputType}`);
    return true;
  }

  return false;
};

export default (({
  // Used to help describe invariant errors.
  name = '',
  // Describes the type a pattern expects to match against.
  // Set this to null to disable type invariant checking for a pattern.
  inputType = 'string',
  // Callback function for validating a pattern.
  validator = null,
  // A map of regex rules that must all return true for input to match the pattern.
  rules = null,
  // Callback function for returning a matched group from an input
  matcher = null
} = {}) => {
  if (rules) {
    validator = input => Object.keys(rules).every(key => rules[key].test(input));
  }

  REQUIRED_PROPERTIES_CHECK(name, validator);
  const Pattern = {
    name,
    inputType,
    test: (input, options = {}) => {
      if (inputType && TYPE_INVARIANT(name, 'test', input, inputType)) {
        return false;
      }

      return validator(input, options);
    }
  };

  if (matcher && typeof matcher === 'function') {
    Pattern.match = input => {
      if (inputType && TYPE_INVARIANT(name, 'match', input, inputType)) {
        return false;
      }

      return matcher(input);
    };
  }

  if (rules) {
    Pattern.testRules = input => {
      return Object.keys(rules).map(key => ({
        rule: key,
        valid: rules[key].test(input)
      }));
    };
  }

  return Pattern;
});