import registerI18nTranslations from './registerI18nTranslations';
import registerNumberFormatting from './registerNumberFormatting';
export default (Provider => {
  return Promise.all([registerI18nTranslations(Provider), registerNumberFormatting(Provider)]);
});