// @ts-expect-error `i18n-data/data/locales/en` is untyped
import numberFormatting from 'i2l?query=sporks!i18n-data/data/locales/en';
import { getLangEnabledLocales } from '../../internal/legacyI18nInit';
export default (Provider => Provider.register(numberFormatting, {
  getLocales: getLangEnabledLocales
}));