import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";

/* hs-eslint ignored failing-rules */

/* eslint-disable @typescript-eslint/no-floating-promises */

/* eslint-disable promise/catch-or-return */

/* eslint-disable hubspot-dev/no-unsafe-i18n-at-module-eval */
import { I18nInternal as I18n } from '../../internal/i18n-internal';
import { setManualOverwrites, getValidLocale, setupTimezone, defaultLanguage, momentMappings, setHtmlLang } from '../internal/legacyI18nInit';
import { create } from '../internal/hs-intl';
import localeMapper from '../internal/localeMapper';
import * as localStorage from '../internal/localStorage';
import { PUBLIC_CACHE, STANDARD_CACHE } from '../internal/localeCacheKeys';
export default (options => {
  const intl = create();

  const {
    setLocale,
    register
  } = intl,
        rest = _objectWithoutPropertiesLoose(intl, ["setLocale", "register"]);

  const localesToLoad = [];
  const I18nProvider = Object.assign({
    register(lang, registerOptions = {}) {
      const mapper = registerOptions.localeMapper || localeMapper;
      const p = register.call(intl, lang, Object.assign({}, registerOptions, {
        localeMapper(...args) {
          const l = mapper(...args);

          if (l && !localesToLoad.includes(l)) {
            localesToLoad.push(l);
          }

          return l;
        }

      }));
      p.then(() => {
        if (!options || options.__localesCacheKey !== PUBLIC_CACHE) {
          localStorage.setItem(options && options.__localesCacheKey || STANDARD_CACHE, JSON.stringify(localesToLoad));
        }
      });
      return p;
    },

    setLocale({
      locale,
      langEnabled,
      timezone
    }) {
      setManualOverwrites();
      setupTimezone(timezone);
      I18n.locale = I18n.manualLocale || getValidLocale(locale);
      I18n.lang = I18n.locale.split('-')[0]; // deprecated, use getLang() instead

      I18n.langEnabled = !!I18n.manualLocale || langEnabled;
      const loaderLocales = I18n.langEnabled ? [I18n.locale] : [];

      if (!I18n.langEnabled && I18n.locale === defaultLanguage) {
        // We still set new users to en instead of en-us if they have never changed their settings
        // We need to load en-us number formats
        loaderLocales.push('en-us');
      }

      const shouldLoadFallback = !(options && options.excludeFallback);

      if (shouldLoadFallback) {
        loaderLocales.push(defaultLanguage);
      }

      I18n.fired.ready = true;
      I18n.Info.resolve({
        locale: I18n.locale,
        langEnabled: I18n.langEnabled,
        timezone: I18n.timezone
      });

      if (I18n.moment) {
        let validMomentLocale = momentMappings[I18n.locale] || momentMappings[I18n.locale.split('-')[0]];

        if (I18n.moment.locales().indexOf(validMomentLocale) < 0) {
          validMomentLocale = defaultLanguage;
        }

        if (validMomentLocale !== I18n.moment.locale()) {
          I18n.moment.locale(validMomentLocale);
        }
      }

      setHtmlLang();
      return setLocale(loaderLocales);
    }

  }, rest);
  return I18nProvider;
});