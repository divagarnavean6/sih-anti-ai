'use es6';

export const wrapValidator = (validator, typeName, typeChecker = null) => {
  return Object.assign(validator.bind(), {
    typeName,
    typeChecker,
    isRequired: Object.assign(validator.isRequired.bind(), {
      typeName,
      typeChecker,
      typeRequired: true
    })
  });
};