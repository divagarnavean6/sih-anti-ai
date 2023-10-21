import { I18nInternal as I18n } from '../internal/i18n-internal';
export default (() => {
  const lang = I18n.locale.split('-')[0];
  return lang !== 'en' && !I18n.langEnabled && !I18n.publicPage ? 'en' : lang;
});