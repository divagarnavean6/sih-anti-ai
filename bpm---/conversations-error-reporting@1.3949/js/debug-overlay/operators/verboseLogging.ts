import enviro from 'enviro';

const safelyCallLocalStorage = method => {
  return (...args) => {
    try {
      const fn = localStorage[method];
      return fn(...args);
    } catch (e) {
      return undefined;
    }
  };
};

const safeStorage = {
  setItem: safelyCallLocalStorage('setItem'),
  getItem: safelyCallLocalStorage('getItem'),
  removeItem: safelyCallLocalStorage('removeItem')
};
const DEBUG_LOGGING = '4';

const enableVerboseLogging = () => {
  enviro.setDebug('conversations', true);
  safeStorage.setItem('ABLY_LOG_LEVEL', DEBUG_LOGGING);
};

const disableVerboseLogging = () => {
  enviro.setDebug('conversations', false);
  safeStorage.removeItem('ABLY_LOG_LEVEL');
};

export const isEnabled = () => {
  const logLevelVerbose = safeStorage.getItem('ABLY_LOG_LEVEL') === DEBUG_LOGGING;
  return Boolean(enviro.debug('conversations') && logLevelVerbose);
};
export const toggleVerboseLogging = () => {
  if (isEnabled()) {
    disableVerboseLogging();
  } else {
    enableVerboseLogging();
  }
};