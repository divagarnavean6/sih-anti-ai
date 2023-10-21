import * as helpers from './common/helpers';
import * as storageKeys from './storageKeys';
const SESSION_LENGTH_IN_MILLISECONDS = 1000 * 60 * 30; // 30 minutes

const OPERATING_SYSTEMS = [{
  name: 'windows 10',
  pattern: /(Windows 10.0|Windows NT 10.0)/
}, {
  name: 'windows 8',
  pattern: /(Windows 8|Windows8.1|Windows NT 6.2|Windows NT 6.3)/
}, {
  name: 'windows 7',
  pattern: /(Windows 7|Windows NT 6.1)/
}, {
  name: 'windows vista',
  pattern: /Windows NT 6.0/
}, {
  name: 'windows xp',
  pattern: /(Windows NT 5.1|Windows XP)/
}, {
  name: 'android',
  pattern: /Android/
}, {
  name: 'linux',
  pattern: /(Linux|X11)/
}, {
  name: 'ios',
  pattern: /(iPhone|iPad|iPod)/
}, {
  name: 'mac',
  pattern: /Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh/
}];

const getDefaultHamplitudeProperties = (currentTime, deviceIdOverride) => {
  return {
    device_id: deviceIdOverride || helpers.makeUuid(),
    last_event_id: 0,
    last_sequence_number: 0,
    last_timestamp_checked_against_session: currentTime,
    session_id: currentTime
  };
};

const getHamplitudeProperties = (getTempStorage, currentTime, deviceIdOverride) => {
  const storageProperties = getTempStorage(storageKeys.hamplitudeKey);

  if (storageProperties) {
    try {
      return JSON.parse(storageProperties);
    } catch (err) {// proceed with the default amplitude properties below
    }
  }

  return getDefaultHamplitudeProperties(currentTime, deviceIdOverride);
};

const setHamplitudeProperties = (setTempStorage, hamplitudeProperties) => {
  setTempStorage(storageKeys.hamplitudeKey, JSON.stringify(hamplitudeProperties));
};

export const refreshHamplitudeProperties = (hamplitudeProperties, currentTime, deviceIdOverride) => {
  const {
    device_id,
    last_event_id,
    last_sequence_number,
    last_timestamp_checked_against_session,
    session_id
  } = hamplitudeProperties;
  const refreshed = {
    device_id,
    last_event_id,
    last_sequence_number,
    last_timestamp_checked_against_session,
    session_id
  };
  const timeSinceSessionRefresh = currentTime - last_timestamp_checked_against_session;

  if (timeSinceSessionRefresh > SESSION_LENGTH_IN_MILLISECONDS) {
    refreshed.last_event_id = 0;
    refreshed.session_id = currentTime;
  }

  refreshed.last_event_id = last_event_id + 1;
  refreshed.last_sequence_number = last_sequence_number + 1;
  refreshed.last_timestamp_checked_against_session = currentTime;

  if (deviceIdOverride && typeof deviceIdOverride === 'string' && deviceIdOverride !== device_id) {
    refreshed.device_id = deviceIdOverride;
  }

  return refreshed;
};

const getAndRefreshHamplitudeProperties = (getTempStorage, setTempStorage, currentTime, deviceIdOverride) => {
  const hamplitudeProperties = refreshHamplitudeProperties(getHamplitudeProperties(getTempStorage, currentTime, deviceIdOverride), currentTime, deviceIdOverride);
  setHamplitudeProperties(setTempStorage, hamplitudeProperties);
  return hamplitudeProperties;
};

const lookupOperatingSystem = fingerprint => {
  let match = 'unknown';

  try {
    OPERATING_SYSTEMS.forEach(({
      name,
      pattern
    }) => {
      if (pattern.test(fingerprint)) {
        match = name;
      }
    });
  } catch (err) {
    /* DO NOTHING */
  }

  return match.toLowerCase();
};

export const getDynamicMetaProperties = ({
  getCurrentHref,
  getNetworkType,
  getNetworkSpeed,
  getTempStorage,
  setTempStorage
}, deviceIdOverride) => {
  const currentTime = Date.now();
  const currentPageUrl = getCurrentHref();
  const hamplitudeProperties = getAndRefreshHamplitudeProperties(getTempStorage, setTempStorage, currentTime, deviceIdOverride);
  const dynamicProperties = Object.assign({}, hamplitudeProperties, {
    timestamp: currentTime,
    currentPageUrl: '',
    networkType: '',
    networkSpeed: '',
    hasDeviceIdOverride: false
  });
  dynamicProperties.currentPageUrl = helpers.truncate(currentPageUrl, 256);
  dynamicProperties.networkType = getNetworkType();
  dynamicProperties.networkSpeed = getNetworkSpeed();

  if (deviceIdOverride && typeof deviceIdOverride === 'string') {
    dynamicProperties.hasDeviceIdOverride = true;
  }

  return dynamicProperties;
}; // These are Properties always sent on the Event Payload
// and that have static value (properties defined when the client is created)

// Args visible for tests
export const getStaticMetaProperties = ({
  clientName,
  getReferrer,
  getUserAgent,
  getScreenWidth,
  getScreenHeight,
  getWindowWidth,
  getWindowHeight,
  getDeployableName,
  getDeployableVersion
}) => {
  const staticProperties = {
    windowWidth: -1,
    windowHeight: -1,
    screenWidth: -1,
    screenHeight: -1,
    screenSize: '',
    lastPageUrl: '',
    howOsDetailed: '',
    singlePageAppSessionId: Date.now(),
    trackingClient: clientName || 'custom',
    deployableName: '',
    deployableVersion: ''
  };
  staticProperties.windowWidth = getWindowWidth();
  staticProperties.windowHeight = getWindowHeight();
  staticProperties.deployableName = getDeployableName();
  staticProperties.deployableVersion = getDeployableVersion();
  staticProperties.howOsDetailed = lookupOperatingSystem(helpers.between(getUserAgent(), '(', ')'));
  staticProperties.screenWidth = getScreenWidth();
  staticProperties.screenHeight = getScreenHeight();

  if (!isNaN(getScreenWidth())) {
    if (getScreenWidth() > 1024) {
      staticProperties.screenSize = 'large (> 1024)';
    } else if (getScreenWidth() > 680) {
      staticProperties.screenSize = 'medium (680 - 1024)';
    } else {
      staticProperties.screenSize = 'small (< 680)';
    }
  }

  const lastPageUrl = getReferrer();
  staticProperties.lastPageUrl = helpers.truncate(lastPageUrl, 256);
  return staticProperties;
};

/*
 *  metaProperties = properties that get stamped to each event
 *  staticProperties = properties that get set once on page load
 *  dynamicProperties = properties that can change for each event
 */
const getStaticMetaPropertiesOnce = helpers.once(getStaticMetaProperties);
export const getMetaProperties = (dependencies, {
  deviceIdOverride = ''
} = {}) => {
  const metaProperties = Object.assign({}, getStaticMetaPropertiesOnce(dependencies), {}, getDynamicMetaProperties(dependencies, deviceIdOverride));
  const emptyProperties = helpers.getObjectKeys(metaProperties).filter(key => !metaProperties[key]); // We cast the emptyProperties as [] since the emptyProperties are evaluated
  // during runtime, and we don't know which ones are empty during build time.

  return helpers.omit(metaProperties, emptyProperties);
};