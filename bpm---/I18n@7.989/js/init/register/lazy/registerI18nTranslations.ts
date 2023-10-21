import i18nData from 'i2l?query=sporks!../../../../lang/en.lyaml';
import { getLangEnabledLocales } from '../../internal/legacyI18nInit';
export default (Provider => Provider.register(i18nData, {
  getLocales: getLangEnabledLocales
}));