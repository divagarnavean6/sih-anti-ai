import { getDefaultLanguage } from './langHelper';
import { isDebugEnabled, isLocalDeployment, isQaDeployment } from './browserHelper';
import { getHstc } from '../common/defaultTrackers';
import tempStorage from '../containers/tempStorage';
import reportError from './reportError';
import reportWarning from './reportWarning';
import sendBeacon from './sendBeacon'; // These are reusable/shared client dependencies that can be used by any client implementation

const genericClient = {
  getHstc,
  sendBeacon,
  reportError,
  reportWarning,
  getDebug: () => isDebugEnabled,
  getLang: getDefaultLanguage,
  getTempStorage: tempStorage.getItem,
  setTempStorage: tempStorage.setItem,
  logError: (...errors) => {
    if (isLocalDeployment || isQaDeployment || isDebugEnabled) {
      console.error(...errors);
    }
  },
  logWarning: (...warnings) => {
    if (isLocalDeployment || isQaDeployment || isDebugEnabled) {
      console.warn(...warnings);
    }
  }
};
export default genericClient;