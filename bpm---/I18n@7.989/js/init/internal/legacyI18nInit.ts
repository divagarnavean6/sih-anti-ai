import { I18nInternal as I18n } from '../../internal/i18n-internal';
import getLangLocale from '../../utils/getLangLocale';
import getLang from '../../utils/getLang';
import { Metrics } from '../../utils/Metrics';
export const defaultLanguage = 'en'; // Keys that should map from one to another specific locale

export const languageMappings = {
  nb: 'no-no',
  noNO: 'no-no',
  pt: 'pt-br',
  no: 'no-no',
  ca: 'ca-es',
  ar: 'ar-eg'
};
export const momentMappings = {
  pt: 'pt-br',
  'en-ie': 'en-gb',
  'en-nz': 'en-au',
  'es-co': 'es-do',
  'es-ar': 'es-do',
  'es-mx': 'es',
  de: 'de',
  ja: 'ja',
  'en-gb': 'en-gb',
  'en-in': 'en-au',
  es: 'es',
  'zh-cn': 'zh-cn',
  'zh-hk': 'zh-hk',
  nl: 'nl',
  'en-au': 'en-au',
  'en-ca': 'en-ca',
  fi: 'fi',
  fr: 'fr',
  'fr-ca': 'fr-ca',
  it: 'it',
  'pt-br': 'pt-br',
  sv: 'sv',
  da: 'da',
  pl: 'pl',
  cs: 'cs',
  ko: 'ko',
  no: 'nb',
  'no-no': 'nb',
  noNO: 'nb',
  'x-pseudo': 'x-pseudo',
  id: 'id',
  ro: 'ro',
  ru: 'ru',
  th: 'th',
  hr: 'hr',
  vi: 'vi',
  hu: 'hu',
  bn: 'bn',
  af: 'af',
  'ar-eg': 'ar',
  bg: 'bg',
  'ca-es': 'ca',
  sl: 'sl',
  tr: 'tr',
  uk: 'uk',
  'he-il': 'he',
  he: 'he',
  sk: 'sk',
  lt: 'lt',
  ms: 'ms',
  'zh-tw': 'zh-tw',
  tl: 'tl-ph',
  'pt-pt': 'pt'
};
export function setupTimezone(timezone) {
  if (!I18n.moment) {
    return;
  }

  if (!timezone || !timezone.id) {
    // If we don't have portal data, then we can't use portalTz and even setting a timezone will cause issues
    // If no timezone data, then we should fall back to userTz
    // Without a timezone setting, portalTz returns undefined. So make portalTz work as userTz
    // @ts-expect-error I18n.moment.portalTz is read only
    I18n.moment.portalTz = I18n.manualTimezone ? I18n.moment.portalTz : I18n.moment.userTz; // Fall back on some timezone to not break I18n.moment.fn.portalTz
    // TO DO - modify I18n.moment.fn.portalTz so that it doesn't break without I18n.timezone

    I18n.timezone = I18n.manualTimezone || 'US/Eastern';

    if (I18n.manualTimezone) {
      I18n.moment.tz.setDefault(I18n.manualTimezone);
    }

    return;
  }

  if (I18n.manualTimezone) {
    I18n.moment.tz.setDefault(I18n.manualTimezone);
    return;
  }

  const timezoneId = timezone.id;

  try {
    if (timezone['moment-data']) {
      if (!I18n.moment.tz.zone(timezoneId)) {
        I18n.moment.tz.add(`${timezoneId}|${timezone['moment-data']}`);
      }

      I18n.moment.tz(timezoneId);
      I18n.timezone = timezoneId;
    } else {
      if (window.Raven) {
        window.Raven.captureMessage(`I18n failed to parse api-verify data`);
      }
    }
  } catch (e) {
    console.error('Unable to set up timezone', e);

    if (window.Raven) {
      window.Raven.captureException(e);
    }
  }

  I18n.timezone = I18n.manualTimezone || window.I18N_RENDERED_TZ || I18n.timezone;
}
export function getValidLocale(locale) {
  let validLocale = (locale || defaultLanguage).toLowerCase();
  const fallbackLookup = languageMappings[validLocale] || languageMappings[validLocale.substring(0, 2)];

  if (fallbackLookup) {
    validLocale = fallbackLookup;
  }

  return validLocale || I18n.locale;
}
export function momentLocaleMapper(locale) {
  const validLocale = getValidLocale(locale);
  let localeMatch = validLocale;

  if (!momentMappings[localeMatch]) {
    localeMatch = null;
  } else {
    localeMatch = momentMappings[localeMatch] || null;
  }

  return localeMatch;
}
export function getLangEnabledLocales(locales) {
  return !I18n.langEnabled ? [I18n.locale, ...locales] : locales;
}
export function setManualOverwrites() {
  I18n.manualLocale = window.I18N_MANUAL_LANG;
  I18n.manualTimezone = window.I18N_TZ;

  try {
    const localeOverwrite = localStorage && localStorage.I18N_MANUAL_LANG;
    const timezoneOverwrite = localStorage && localStorage.I18N_TZ;

    if (localeOverwrite) {
      Metrics.counter('localStorage-overwrote-locale').increment();
      I18n.manualLocale = localeOverwrite;
    }

    if (timezoneOverwrite) {
      Metrics.counter('localStorage-overwrote-timezone').increment();
      I18n.manualTimezone = timezoneOverwrite;
    }
  } catch (e) {
    I18n.debugLog(`Failed access localStorage ${e}`);
  }
}
export function setHtmlLang() {
  const html = document.querySelector('html');
  html.className = html.className.replace(/(^|\b)lang-[a-z]{2}($|\b)/, '');
  html.className += ` lang-${getLang()}`;
  html.setAttribute('lang', getLangLocale());
}