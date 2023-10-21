import * as errors from './common/errors';
import * as schemas from './schemas';
import * as eventTracker from './eventTracker';
import * as helpers from './common/helpers';
import * as propertyResolverInterface from './propertyResolver';
import * as dictionaryInterface from './dictionary';
export const parseConfig = (trackerDependencies, nonParsedConfig) => {
  if (!nonParsedConfig || typeof nonParsedConfig !== 'object') {
    throw errors.configError(`Invalid argument. The "createTracker" function requires to be passed a config argument of type "object". Received type "${typeof nonParsedConfig}".`);
  } // Apply defualts to
  // Defaults such as onError are not known until runtime.


  const trackerConfigSchemaWithDefaults = schemas.trackerConfigSchema.mutate(schema => Object.assign({}, schema, {
    debug: Object.assign({}, schema.debug, {
      default: trackerDependencies.getDebug
    }),
    onError: Object.assign({}, schema.onError, {
      default: trackerDependencies.reportError
    }),
    onWarning: Object.assign({}, schema.onWarning, {
      default: trackerDependencies.reportWarning
    })
  }));
  const trackerPropertiesSchemaWithDefaults = schemas.trackerPropertiesSchema.mutate(schema => Object.assign({}, schema, {
    email: Object.assign({}, schema.email, {
      default: trackerDependencies.getEmail
    }),
    hubId: Object.assign({}, schema.hubId, {
      default: trackerDependencies.getHubId
    }),
    hstc: Object.assign({}, schema.hstc, {
      default: trackerDependencies.getHstc
    }),
    lang: Object.assign({}, schema.lang, {
      default: trackerDependencies.getLang
    })
  })); // Normalize & validate tracker config + properties.

  const parsedConfig = trackerConfigSchemaWithDefaults.normalize(nonParsedConfig);
  trackerConfigSchemaWithDefaults.validate(parsedConfig, '"createTracker"'); // We set them to `Record<string, JsonValue>` since the actual parsed tracker properties
  // Contains `trackerPropertiesSchemaWithDefaults` + all the passed properties from the `config`

  const parsedTrackerProperties = trackerPropertiesSchemaWithDefaults.normalize(parsedConfig.properties || {});
  trackerPropertiesSchemaWithDefaults.validate(parsedTrackerProperties, '"createTracker"');
  const dictionary = dictionaryInterface.createDictionary( // Since the events from parsedConfig.events "might be unknown"
  // We want to ensure that they are known before we try to use them.
  parsedConfig.events, '"createTracker"');
  return Object.assign({
    events: dictionary,
    properties: parsedTrackerProperties
  }, helpers.omit(parsedConfig, ['events', 'properties']), {}, trackerDependencies);
};
export const createLockedTracker = (trackerDependencies, config = {}) => {
  const parsedConfig = parseConfig(trackerDependencies, config);
  const trackEvent = eventTracker.createEventTracker(parsedConfig);
  const propertiesResolver = propertyResolverInterface.createPropertyResolver(parsedConfig);
  const isDebugEnabled = helpers.ensureFn(config.debug, () => config.debug)();
  return {
    clone: (overrides = {}) => {
      if (!overrides || typeof overrides !== 'object') {
        throw errors.genericError(`Invalid argument. The "clone" method requires to be passed a valid tracker config of type "object". Received type "${typeof overrides}".`);
      } // There are some typing issues in making TS understand that keyof Dependencies[] is part of
      // keyof TrackerConfig[] so we assign the type as []
      // Also we cannot convert the TrackerConfigSchema


      const mergedConfig = helpers.omit(helpers.defaults(overrides, parsedConfig), helpers.getObjectKeys(trackerDependencies)); // Get only the default properties

      const supportedProperties = helpers.pick(propertiesResolver.getCache(), schemas.trackerPropertiesSchema.getKeys()); // Get only the non-default properties

      const arbitraryProperties = helpers.omit(propertiesResolver.getCache(), helpers.getObjectKeys(supportedProperties));
      mergedConfig.properties = helpers.defaults(overrides.properties || {}, supportedProperties); // If we want to preserve the tracker properties we also copy the non-default properties

      if (mergedConfig.preserveTrackerProperties) {
        mergedConfig.properties = helpers.defaults(mergedConfig.properties, arbitraryProperties);
      }

      if (mergedConfig.preserveTrackerEvents) {
        mergedConfig.events = helpers.defaults( // The type of the events from the `overrides` is `unknown` since it comes from `events.yaml`
        // For that we override the type here letting TypeScript know it is guaranteed to be a Record<string, any>
        // In the future we could make a workaround where the type for creating a tracker.events is `unknown`
        mergedConfig.events || {}, parsedConfig.events);
      }

      return createLockedTracker(trackerDependencies, mergedConfig);
    },
    getConfig: () => {
      if (isDebugEnabled) {
        return Object.assign({}, helpers.omit(parsedConfig, ['properties']), {
          properties: propertiesResolver.getCache()
        });
      }

      throw errors.genericError(`Invalid call. This method should only be used when 'debug: true'. Please do not use this in production.`);
    },
    setProperties: (properties = {}) => {
      if (!properties || typeof properties !== 'object') {
        throw errors.genericError(`Invalid argument. The "setProperties" method requires to be passed a properties argument of type "object". Received type "${typeof properties}".`);
      }

      helpers.getObjectKeys(properties).forEach(key => {
        propertiesResolver.addToCache(key, properties[key]);
      });
    },
    track: (eventKey, properties = {}) => {
      if (!eventKey || typeof eventKey !== 'string') {
        throw errors.genericError(`Invalid argument. The "track" method requires to be passed an eventKey of type "string". Received type "${typeof eventKey}".`);
      }

      if (!properties || typeof properties !== 'object') {
        throw errors.genericError(`Invalid argument. The "track" method requires the 2nd arg to be passed eventProperties of type "object". Received type "${typeof properties}".`);
      }

      if (properties.deviceId) {
        // If the EventProperties contains a deviceId we add it to the cache
        // to ensure that it is always in sync if the user changes it
        propertiesResolver.addToCache('deviceId', properties.deviceId);
      }

      propertiesResolver.resolveProperties(eventKey, properties, // Calls the Track Event method after resolving all the properties
      // that need to be sent to the network (tracked properties)
      resolvedProperties => {
        const deviceIdOverride = resolvedProperties.deviceId; // As trhe deviceId could be set as an asynchronous property
        // we want to ensure that it is resolved at this point of time

        const metaProperties = parsedConfig.getMetaProperties({
          deviceIdOverride: deviceIdOverride ? deviceIdOverride.toString() : null
        });
        trackEvent(eventKey, metaProperties, // We attempt to filter out the unknown properties from the user defined event properties
        // To match only the ones known by the event definition
        propertiesResolver.createPropertiesFilter(eventKey, // Merges the resolved asynchronous properties with the user provided properties
        helpers.defaults(properties, resolvedProperties)));
      });
    }
  };
};