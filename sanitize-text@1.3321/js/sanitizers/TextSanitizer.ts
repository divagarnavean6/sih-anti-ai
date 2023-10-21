import { sanitize } from './Sanitize';
import { config } from './SanitizeConfiguration';
import memoize from 'transmute/memoize';
export const getTextContentFromHtml = memoize(text => {
  return sanitize(text, config.TEXTONLY);
});