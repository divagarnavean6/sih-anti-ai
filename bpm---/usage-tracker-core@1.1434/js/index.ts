import * as browserHelper from './client/browserHelper';
import * as schemas from './schemas';
import * as eventPoolInterface from './eventPool';
import * as eventInterface from './event';
import * as metaPropertiesInterface from './metaProperties';
import * as trackerInterface from './tracker';
import * as storageKeys from './storageKeys';
export const createClient = (dependencies = {}) => {
  const parsedDependencies = schemas.clientDependenciesSchema.normalize(dependencies);
  schemas.clientDependenciesSchema.validate(parsedDependencies, '"createClient"');
  const {
    clientName,
    getDebug,
    getEmail,
    getHubId,
    getHstc,
    getLang,
    getCurrentHref,
    getReferrer,
    getUserAgent,
    getNetworkType,
    getNetworkSpeed,
    getScreenWidth,
    getScreenHeight,
    getWindowWidth,
    getWindowHeight,
    getDeployableName,
    getDeployableVersion,
    getTempStorage,
    logMessage,
    logWarning,
    logError,
    reportError,
    reportWarning,
    send,
    setTempStorage
  } = parsedDependencies;
  const eventPool = eventPoolInterface.createEventPool({
    getTempStorage,
    setTempStorage
  });
  const {
    scheduleFlush
  } = eventPoolInterface.createScheduler(browserHelper.isDocumentReady);

  const sendToNetwork = (options, events) => {
    const {
      identifiers,
      isBeforeUnload,
      isExternalHost
    } = options;
    const isAuthed = !!(identifiers.raw.email && identifiers.raw.hubId);
    let query = `clientSendTimestamp=${Date.now()}`;

    if (isExternalHost) {
      query = `${query}&dil=true`;
    }

    send({
      events,
      isBeforeUnload: !!isBeforeUnload,
      isAuthed,
      query
    });
  };

  const flushPoolAndSendToNetwork = identifiers => {
    const events = eventPool.flush();

    if (events && events.length) {
      sendToNetwork({
        identifiers
      }, events);
    }
  };

  const sendToPool = (identifiers, event) => {
    if (!eventPool.getIsInitialized()) {
      eventPool.initialize({
        normalizeEvent: (...eventToNormalize) => eventInterface.normalizeIdentifiers(identifiers, ...eventToNormalize)
      });
    }

    eventPool.push(event);
    scheduleFlush(() => flushPoolAndSendToNetwork(identifiers));
  };

  const getShouldRecordEvents = () => getTempStorage(storageKeys.recorderEnabled) === 'true';

  const safeRecordToStorage = (storageKey, data, limit) => {
    try {
      const records = JSON.parse(getTempStorage(storageKey) || JSON.stringify([]));

      if (limit && records.length >= limit) {
        records.shift();
      }

      records.push(data);
      setTempStorage(storageKey, JSON.stringify(records));
    } catch (err) {
      /* NOOP */
    }
  };

  const metaPropertiesDependencies = {
    clientName,
    getCurrentHref,
    getReferrer,
    getUserAgent,
    getNetworkType,
    getNetworkSpeed,
    getScreenWidth,
    getScreenHeight,
    getWindowWidth,
    getWindowHeight,
    getDeployableName,
    getDeployableVersion,
    getTempStorage,
    setTempStorage
  };

  const getMetaProperties = args => metaPropertiesInterface.getMetaProperties(metaPropertiesDependencies, args);

  const scheduleEvent = (options, identifiers, eventKey = '', event) => {
    if (!options.bypassPool && !options.isBeforeUnload) {
      sendToPool(identifiers, event);
    } else {
      sendToNetwork(Object.assign({}, options, {
        identifiers
      }), [event]);
    }

    if (getShouldRecordEvents()) {
      safeRecordToStorage(storageKeys.recordedEventKeys, eventKey, 1000);
      safeRecordToStorage(storageKeys.recordedEvents, event, 25);
    }
  };

  return {
    createTracker: config => trackerInterface.createLockedTracker({
      clientName,
      getMetaProperties,
      getDebug,
      getEmail,
      getHubId,
      getHstc,
      getLang,
      logError,
      logMessage,
      logWarning,
      reportError,
      reportWarning,
      scheduleEvent
    }, config)
  };
};