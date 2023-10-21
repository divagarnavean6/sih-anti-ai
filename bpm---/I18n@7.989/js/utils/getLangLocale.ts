import { I18nInternal as I18n } from '../internal/i18n-internal';
export default (() => {
  return I18n.locale !== 'en-us' && !I18n.langEnabled && !I18n.publicPage ? 'en-us' : I18n.locale;
});