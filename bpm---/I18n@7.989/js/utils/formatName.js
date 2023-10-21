'use es6';

import getLangLocale from './getLangLocale';
import TitleFormatters from './TitleFormatters';
const CJK_HIRAGANA_REGEX = new RegExp(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\u3040-\u309F]|[\u3005]|[\u3031-\u3032]|[\u3131-\uD79D]/);
const KATAKANA_REGEX = new RegExp(/[\u30A0-\u30FF]/); // Formats a first and last name depending on the character set.

export default (({
  name,
  firstName,
  lastName,
  email,
  titleType
}, options) => {
  const first = firstName && firstName.trim();
  const last = lastName && lastName.trim();
  const fullName = name && name.trim();
  let formattedName;

  if (!first && !last) {
    formattedName = fullName || email || '';
  } else if (first && !last) {
    formattedName = first;
  } else if (!first && last) {
    formattedName = last;
  }

  if (typeof formattedName === 'undefined') {
    const cjkLastTest = CJK_HIRAGANA_REGEX.test(last);
    const cjkFirstTest = CJK_HIRAGANA_REGEX.test(first);
    const katakanaLastTest = KATAKANA_REGEX.test(last);
    const katakanaFirstTest = KATAKANA_REGEX.test(first);

    if (cjkLastTest && cjkFirstTest || cjkLastTest && katakanaFirstTest || katakanaLastTest && cjkFirstTest) {
      formattedName = `${last} ${first}`;
    } else if (katakanaFirstTest && katakanaLastTest) {
      // Should be formatted last first: https://issues.hubspotcentral.com/browse/CRM-44973
      formattedName = `${last} ${first}`;
    } else {
      formattedName = `${first} ${last}`;
    }
  }

  if (titleType) {
    const lang = options && options.locale || getLangLocale();
    const titleFormatter = TitleFormatters[lang] && TitleFormatters[lang][titleType];

    if (titleFormatter) {
      formattedName = titleFormatter(formattedName);
    }
  }

  return formattedName;
});