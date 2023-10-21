import * as helpers from './common/helpers';
import * as schemas from './schemas';
import * as loggersInterface from './loggers';
import * as eventInterface from './event';
import * as identifiersInterface from './identifiers';
import * as dictionaryInterface from './dictionary';
export const createEventTracker = config => {
  const proxyLogger = helpers.proxyLogger({
    'tracker.client': config.clientName,
    'tracker.name': config.trackerName
  });
  const logDebug = loggersInterface.createDebugLogger(config.logMessage);
  const logError = loggersInterface.createErrorLogger(config.logError, proxyLogger(config.onError));
  const definitionStorage = dictionaryInterface.createDictionaryStorage(config.events); // Mutates the Default Tracker Properties so that their resolved values
  // Are only allowed to be what they're defined to be when resolved
  // This includes `nullable` values for some. Some might also be optional fields

  const mutatedDefaultProperties = schemas.trackerPropertiesSchema.mutate(schema => ({
    email: Object.assign({}, schema.email, {
      types: ['string', 'null']
    }),
    hubId: Object.assign({}, schema.hubId, {
      types: ['number', 'null']
    }),
    hstc: Object.assign({}, schema.hstc, {
      types: ['string', 'null']
    }),
    lang: Object.assign({}, schema.lang, {
      types: ['string', 'null']
    }),
    deviceId: Object.assign({}, schema.deviceId, {
      types: ['string']
    })
  }));
  const isDebugEnabled = helpers.ensureFn(config.debug, () => config.debug)();

  const validateProperties = (eventKey, eventProperties) => {
    try {
      // This will derive a schema based on the types of the properties from the Event definition
      // and also add all unknown properties to be validated against all allowed Event Property types
      const propertySchema = definitionStorage.createPropertySchema(eventKey, eventProperties); // This mutates the definition schema + unknown properties merging the schema of default properties
      // So that the default properties are also validate against their own shchemas instead of the
      // mutation of "unknown properties" as "default properties" technically do not belong to an event definition

      propertySchema.mutate(schema => Object.assign({}, schema, {}, mutatedDefaultProperties._peek())).validate(eventProperties, `Event "${eventKey}"`);
      return true;
    } catch (error) {
      logError(error, {
        extra: {
          eventKey,
          eventProperties: helpers.replaceSentryValues(eventProperties)
        },
        fingerprint: ['usage-tracker-js', 'tracker:validateProperties', `event:${eventKey}`]
      });
      return false;
    }
  };

  const getDefinition = eventKey => {
    try {
      return definitionStorage.getDefinition(eventKey);
    } catch (error) {
      logError(error, {
        extra: {
          eventKey
        },
        fingerprint: ['usage-tracker-js', 'tracker:getDefinition', `event:${eventKey}`]
      });
      return null;
    }
  };

  const getIdentifiers = (eventKey, eventProperties) => {
    const eventRawIdentifiers = {
      email: eventProperties.email,
      userId: eventProperties.userId,
      hubId: eventProperties.hubId,
      hstc: eventProperties.hstc
    };

    if (eventProperties.deviceId) {
      // This is an optional identifier, hence we do not define it if it's not defined in the properties
      // Reminder.: deviceId is actually an override for device_id (meta properties) and an additional anonymous identifier
      // By default, usage-tracker should not use the built-in device_id (meta properties) as an anonymous identifier
      // @TODO: This logic is confusing (the whole hasDeviceIdOverride) and should probably be changed in the future
      eventRawIdentifiers.deviceId = eventProperties.deviceId;
    }

    const eventConfig = {
      allowUnauthed: config.allowUnauthed,
      isExternalHost: config.isExternalHost
    };

    try {
      return identifiersInterface.createIdentifiers(eventRawIdentifiers, eventConfig);
    } catch (error) {
      logError(error, {
        extra: Object.assign({
          eventRawIdentifiers: helpers.replaceSentryValues(eventRawIdentifiers),
          eventProperties: helpers.replaceSentryValues(eventProperties)
        }, eventConfig),
        fingerprint: ['usage-tracker-js', 'tracker:getIdentifiers', `event:${eventKey}`]
      });
      return null;
    }
  };

  const createEvent = (eventKey, eventDefinition, eventProperties, eventIdentifiers) => {
    try {
      return eventInterface.createEventPayload(eventDefinition, eventProperties, eventIdentifiers);
    } catch (error) {
      logError(error, {
        extra: {
          eventKey,
          eventProperties: helpers.replaceSentryValues(eventProperties),
          eventIdentifiers: helpers.replaceSentryValues(eventIdentifiers ? eventIdentifiers.raw : undefined)
        },
        fingerprint: ['usage-tracker-js', 'tracker:createEvent', `event:${eventKey}`]
      });
      return null;
    }
  };

  const dispatchEvent = (eventKey, eventObject, eventIdentifiers) => {
    try {
      config.scheduleEvent(config, eventIdentifiers, eventKey, eventObject);
      helpers.ensureFn(config.onScheduled)(eventKey);
      return true;
    } catch (error) {
      logError(error, {
        extra: {
          eventKey,
          eventIdentifiers: helpers.replaceSentryValues(eventIdentifiers.raw)
        },
        fingerprint: ['usage-tracker-js', 'tracker:dispatchEvent', `event:${eventKey}`]
      });
      return false;
    }
  };

  return (eventKey, metaProperties, filterProperties) => {
    const definition = getDefinition(eventKey);

    if (!definition) {
      return false;
    } // Removes all the unknown properties that aren't known to the event definition
    // and reports and warns to the owning team that they're using the tracker incorrectly


    const filteredProperties = filterProperties(definition); // Validates the given Properties and check if all the required properties are present
    // and if their types match correctly

    const propertiesAreValid = validateProperties(eventKey, filteredProperties);

    if (!propertiesAreValid) {
      return false;
    } // This merges all the filtered properties with the meta properties
    // Creating the combined full data that is going to be appended to
    // the `what_extra_json` property from the Event Payload


    const mergedProperties = helpers.defaults(filteredProperties, metaProperties); // The `propertiesAreValid` will ensure that all our required identifiers
    // Are scalar values and completely valid and that they follow their schema
    // E.g.: HubID is only allowed to be a number and not a string.

    const identifiers = getIdentifiers(eventKey, mergedProperties);
    const eventProperties = Object.assign({}, helpers.omit(mergedProperties, ['hasDeviceIdOverride', 'deviceId']), {
      eventKey
    }); // We create the Event with all the merged properties and the EventKey
    // As it is also passed within the network as part of the Event payload

    const event = createEvent(eventKey, definition, eventProperties, identifiers || undefined);

    if (identifiers && event) {
      if (isDebugEnabled) {
        logDebug(eventKey, 'Event is being dispatched to be sent.', event);
      }

      return dispatchEvent(eventKey, event, identifiers);
    }

    if (isDebugEnabled) {
      logDebug(eventKey, 'Event was not dispatched.', event || undefined);
    }

    return false;
  };
};