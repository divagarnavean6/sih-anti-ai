import * as schema from './common/schema';
import * as errors from './common/errors';
import * as helpers from './common/helpers';
// Schema for createClient() function args
export const clientDependenciesSchema = schema.create('client dependency', errors.configError, {
  clientName: {
    types: ['string'],
    default: 'custom'
  },
  getDebug: {
    types: ['function']
  },
  getEmail: {
    types: ['function']
  },
  getHubId: {
    types: ['function']
  },
  getHstc: {
    types: ['function']
  },
  getLang: {
    types: ['function']
  },
  getCurrentHref: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['window', 'location', 'href'], '')
  },
  getReferrer: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['document', 'referrer'], '')
  },
  getUserAgent: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['navigator', 'userAgent'], '')
  },
  getNetworkType: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['navigator', 'connection', 'effectiveType'], '')
  },
  getNetworkSpeed: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['navigator', 'connection', 'downlink'], '')
  },
  getScreenWidth: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['screen', 'width'], '')
  },
  getScreenHeight: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['screen', 'height'], '')
  },
  getWindowWidth: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['window', 'innerWidth'], '')
  },
  getWindowHeight: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['window', 'innerHeight'], '')
  },
  getDeployableName: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['window', 'hubspot', 'bender', 'currentProject'], '')
  },
  getDeployableVersion: {
    types: ['function'],
    isOptional: true,
    default: () => helpers.safeGetOrDefault(['window', 'hubspot', 'bender', 'currentProjectVersion'], '')
  },
  logMessage: {
    types: ['function'],
    isOptional: true,
    default: (...m) => helpers.safeGetOrDefault(['console', 'debug'], (...p) => p)(...m)
  },
  logWarning: {
    types: ['function'],
    isOptional: true,
    default: (...w) => helpers.safeGetOrDefault(['console', 'warn'], (...p) => p)(...w)
  },
  logError: {
    types: ['function'],
    default: (...e) => helpers.safeGetOrDefault(['console', 'error'], (...p) => p)(...e)
  },
  reportError: {
    types: ['function'],
    isOptional: true,
    default: () => {}
  },
  reportWarning: {
    types: ['function'],
    isOptional: true,
    default: () => {}
  },
  getTempStorage: {
    types: ['function']
  },
  setTempStorage: {
    types: ['function']
  },
  send: {
    types: ['function']
  }
}); // Schema for createTracker() function args

export const trackerConfigSchema = schema.create('config option', errors.configError, {
  trackerName: {
    types: ['string'],
    isOptional: true,
    default: 'default'
  },
  allowUnauthed: {
    types: ['boolean'],
    isOptional: true,
    default: false
  },
  bypassPool: {
    types: ['boolean'],
    isOptional: true,
    default: false
  },
  debug: {
    types: ['boolean', 'function'],
    isOptional: true
  },
  events: {
    types: ['object']
  },
  isBeforeUnload: {
    types: ['boolean'],
    isOptional: true,
    default: false
  },
  isExternalHost: {
    types: ['boolean'],
    isOptional: true,
    default: false
  },
  lastKnownEventProperties: {
    types: ['array'],
    isOptional: true,
    default: []
  },
  onError: {
    types: ['function'],
    isOptional: true
  },
  onWarning: {
    types: ['function'],
    isOptional: true
  },
  onScheduled: {
    types: ['function'],
    isOptional: true,
    default: () => {}
  },
  preserveTrackerProperties: {
    types: ['boolean'],
    isOptional: true,
    default: true
  },
  preserveTrackerEvents: {
    types: ['boolean'],
    isOptional: true,
    default: false
  },
  properties: {
    types: ['object'],
    isOptional: true,
    default: {}
  }
}); // These properties comes from the client and are always present
// They're considered the default properties becuase of their nature
// They're also resolved during the `.track` process

// // Schema for the Default Tracker Properties
// Those are Properties that can always be set in any Tracker instance
export const trackerPropertiesSchema = schema.create('tracker properties', errors.configError, {
  email: {
    types: ['string', 'function', 'object', 'null']
  },
  hubId: {
    types: ['number', 'function', 'object', 'null']
  },
  hstc: {
    types: ['string', 'function', 'object', 'null']
  },
  lang: {
    types: ['string', 'function', 'object', 'null']
  },
  deviceId: {
    types: ['string', 'function', 'object', 'null'],
    isOptional: true
  }
}, false);
export const eventClasses = ['activation', 'creation', 'error', 'exposure', 'funnel', 'interaction', 'none', 'signup', 'usage', 'view', 'warning']; // Schema for events.yaml definitions

export const eventDefinitionSchema = schema.create('event property', errors.configError, {
  name: {
    types: ['string']
  },
  namespace: {
    types: ['string'],
    isOptional: true,
    default: ''
  },
  class: {
    types: ['string'],
    oneOf: [...eventClasses]
  },
  version: {
    types: ['string'],
    isOptional: true,
    default: 'v1'
  },
  properties: {
    types: ['object'],
    isOptional: true,
    default: {}
  },
  meta: {
    types: ['object'],
    isOptional: true
  }
}); // All the allowed types for Event Properties (property.type)

export const eventPropertyTypes = ['boolean', 'string', 'number', 'array'];
export const eventPropertySchema = schema.create('event property', errors.configError, {
  type: {
    types: ['string', 'array'],
    oneOf: [...eventPropertyTypes]
  },
  isOptional: {
    types: ['boolean'],
    isOptional: true,
    default: false
  },
  description: {
    types: ['string'],
    isOptional: true,
    default: ''
  }
});