import { lWindow } from '../common/helpers';
export const getDefaultLanguage = (fallbackLanguage = 'en-US') => {
  if (typeof lWindow !== 'undefined' && typeof lWindow.navigator === 'object') {
    const preferredLanguage = lWindow.navigator.languages ? lWindow.navigator.languages[0] : lWindow.navigator.language;

    if (preferredLanguage) {
      return preferredLanguage.toLocaleLowerCase();
    }
  }

  return fallbackLanguage;
};