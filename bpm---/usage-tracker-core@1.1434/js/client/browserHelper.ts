import enviro from 'enviro';
import { debugKey } from '../storageKeys';
import { lWindow, safeSetTimeout } from '../common/helpers';

const createBrowserHelper = localWindow => {
  // This one requires a Type Guard as Raven is not defined standarly
  // within the `window` object hence why the `prop` is set to `any`
  // This is a TypeScript limitation as TS cannot infer the Factory argument
  // And pass down to the sibling usages of this function
  const hasRaven = prop => {
    return typeof prop['Raven'] === 'object' && typeof prop['Raven'].captureException === 'function' && typeof prop['Raven'].captureMessage === 'function';
  }; // If the variable is `undefined` we don't need to execute each function
  // Since it is obvious that it will be `false`


  if (typeof localWindow === 'undefined') {
    let _isDocumentReadyTimeout = 0;
    let _isDocumentReady = false;
    return {
      hasRaven,
      isDocumentReady: () => {
        if (_isDocumentReady || _isDocumentReadyTimeout) {
          return _isDocumentReady;
        }

        _isDocumentReadyTimeout = safeSetTimeout(() => {
          // We wait for around 6 seconds before assuming that the document is ready
          // This happens as we don't really know if the page orn the environment that
          // usage-tracker was injected into has finished loading. We also do that
          // As we want to create a deferred approach for sending the events over the network
          _isDocumentReady = true;
        }, 6000);
        return _isDocumentReady;
      },
      isLocalDeployment: false,
      isQaDeployment: false,
      isProdDeployment: false,
      isDebugEnabled: false,
      hasLocalStorage: false,
      hasCookieAccess: false,
      hasBeaconSupport: false
    };
  }

  const hasLocalStorage = () => {
    try {
      return Boolean(localWindow.localStorage);
    } catch (err) {
      // window.localStorage might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `window` will deny your access to the localStorage
      return false;
    }
  };

  const hasCookieAccess = () => {
    const {
      navigator,
      document
    } = localWindow;

    try {
      return typeof navigator === 'object' && navigator.cookieEnabled || typeof document === 'object' && Boolean(document.cookie);
    } catch (err) {
      // document.cookie might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `document` will deny your access on the document cookie
      return false;
    }
  };

  const hasBeaconSupport = () => {
    const {
      navigator
    } = localWindow;

    try {
      return typeof navigator === 'object' && typeof navigator['sendBeacon'] === 'function';
    } catch (err) {
      // navigator.sendBeacon might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `navigator` will deny your access on sendBeacon capabilities
      return false;
    }
  };

  const isDocumentReady = () => {
    const {
      document
    } = localWindow;

    try {
      return typeof document === 'object' && typeof document['readyState'] === 'string' && document.readyState === 'complete';
    } catch (err) {
      // document.readyState might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `document` will deny your access on the document cookie
      return false;
    }
  };

  return {
    hasRaven,
    isDocumentReady,
    isLocalDeployment: !enviro.deployed(),
    isQaDeployment: enviro.isQa(),
    isProdDeployment: enviro.isProd(),
    isDebugEnabled: Boolean(enviro.debug(debugKey)),
    hasLocalStorage: hasLocalStorage(),
    hasCookieAccess: hasCookieAccess(),
    hasBeaconSupport: hasBeaconSupport()
  };
};

const {
  hasRaven,
  isDocumentReady,
  hasLocalStorage,
  hasCookieAccess,
  hasBeaconSupport,
  isLocalDeployment,
  isQaDeployment,
  isProdDeployment,
  isDebugEnabled // Creates a default Browser Helper using the Window object

} = createBrowserHelper(typeof lWindow !== 'undefined' ? lWindow : undefined);
export { hasRaven, isDocumentReady, isLocalDeployment, isQaDeployment, isProdDeployment, isDebugEnabled, hasLocalStorage, hasCookieAccess, hasBeaconSupport };
export default createBrowserHelper;