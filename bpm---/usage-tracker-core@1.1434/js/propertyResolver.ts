import * as helpers from './common/helpers';
import * as schemas from './schemas';
import * as errors from './common/errors';
import * as loggersInterface from './loggers';
import { ALWAYS_ALLOWED_PROPERTIES } from './constants';
export const resolveAsyncProperties = (properties = {}, callback, failureCallback) => {
  const resolved = {};
  const propertyKeys = helpers.getObjectKeys(properties);
  const propertiesLength = propertyKeys.length;
  const deferred = propertyKeys.reduce((accumulator, key) => {
    const propertyValue = properties[key]; // When the value is a function we want to Promisify it
    // So we can gracefully handle if the function throws errors

    if (propertyValue && typeof propertyValue === 'function') {
      accumulator.push({
        key,
        func: propertyValue
      });
      return accumulator;
    } // Handles when the value itself is already a Promise (object)
    // Because not all promise properties necessarily are functions


    if (propertyValue && helpers.isPromise(propertyValue)) {
      accumulator.push({
        key,
        promise: propertyValue
      });
      return accumulator;
    }

    resolved[key] = propertyValue;
    return accumulator;
  }, []);

  const check = () => {
    if (Object.keys(resolved).length === propertiesLength) {
      callback(resolved);
    }
  };

  if (deferred.length) {
    const handleSuccess = (key, value) => {
      resolved[key] = value;
      check();
    };

    const handleFailure = (key, error) => {
      // We set the values as null so when they get synced with the propertiesCache the original values
      // that are promises and/or functions will be overriden and a proper error dispatched
      resolved[key] = null;
      helpers.ensureFn(failureCallback)(key, error);
      check();
    };

    return deferred.forEach(({
      key,
      promise,
      func
    }) => {
      const finalPromise = func ? new Promise(resolve => resolve(func())) : promise;

      if (finalPromise) {
        finalPromise.then(value => handleSuccess(key, value)).catch(error => handleFailure(key, error));
      }
    });
  }

  return callback(resolved);
};
export const createPropertyResolver = config => {
  let propertiesCache = Object.assign({}, config.properties);
  const proxyLogger = helpers.proxyLogger({
    'tracker.client': config.clientName,
    'tracker.name': config.trackerName
  });
  const reportFailedResolution = loggersInterface.createPropertyResolutionFailedLogger(config.logError, config.logWarning, proxyLogger(config.onError));
  const isDebugEnabled = helpers.ensureFn(config.debug, () => config.debug)();
  const logWarning = loggersInterface.createWarningLogger(config.logWarning); // The `lastKnownEventProperties´ is a config option that allows you to carry over
  // event specific properties and mark them as "global" (instance-based) properties
  // similarly as the default properties. For example if you define the value of the option to ['email', 'someProperty']
  // Once a `track` call with these properties happens, they will be added to the property cache and carried over

  const syncEventProperties = properties => {
    const lastKnownEventProperties = config.lastKnownEventProperties;

    if (lastKnownEventProperties && lastKnownEventProperties.length) {
      lastKnownEventProperties.forEach(key => {
        const value = properties[key]; // We do a casting here knowing `valueType` could return also 'undefined' or other types
        // But this is needed as `schemas.eventPropertyTypes` is a readonly array

        const valueType = helpers.getRealTypeOf(value); // If the value given in the properties (user defined properties) is a non-empty value
        // It will then update the cache with this new value. If the value is the same
        // it will still be the same, even if re-assigning.

        if (schemas.eventPropertyTypes.includes(valueType)) {
          propertiesCache[key] = value;
        }
      });
    }
  };

  const createPropertiesFilter = (eventKey, eventProperties) => definition => {
    // We only attempt to filter event properties if the event definition for that event is present
    // If there's no event
    const definitionProperties = helpers.getObjectKeys(definition.properties);

    const isAllowedProperty = propertyKey => ALWAYS_ALLOWED_PROPERTIES.includes(propertyKey) || definitionProperties.includes(propertyKey);

    const unexpectedProperties = Object.keys(eventProperties).filter(property => !isAllowedProperty(property));

    if (unexpectedProperties.length) {
      const warningMessage = `Event "${eventKey}" is possibly being tracked with unexpected properties. See go/unexpectedproperties`;
      logWarning(errors.genericWarning(warningMessage));

      if (isDebugEnabled) {
        config.logMessage(loggersInterface.createLog('debug log', `Event "${eventKey}" has unexpected Properties.`, `unexpectedProperties: ${unexpectedProperties.map(p => `"${p}"`).join(', ')}`));
      }
    }

    return eventProperties;
  };

  const resolveProperties = (eventKey, properties, callback) => {
    resolveAsyncProperties(propertiesCache, resolved => {
      // This method call updates the property cache adding the resolved
      // asnychronous properties to the cache and basically merges the two objects
      // with the exception that if the event propertie sent to `track` are undefined
      // We look for those properties in the cache
      propertiesCache = helpers.defaults(resolved, propertiesCache); // Sync the current full list of properties with the ones you want to carry over
      // We only sync the event properties and from there check what needs to be picked
      // (We compare with config.lastKnownEventProperties). Meta properties should
      // never be part of consideration as they're internal properties

      syncEventProperties(properties);
      callback(helpers.shallowCopy(propertiesCache));
    }, reportFailedResolution(eventKey));
  };

  return {
    resolveProperties,
    createPropertiesFilter,
    getCache: () => helpers.shallowCopy(propertiesCache),
    addToCache: (key, value) => {
      propertiesCache[key] = value;
    }
  };
};