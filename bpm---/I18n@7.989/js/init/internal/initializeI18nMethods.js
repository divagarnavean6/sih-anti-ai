'use es6';

import { initializeNewLoaderSettings } from '../../utils/internal/newLoaderSettings';
import { lookup, prepareOptions } from '../../utils/internal/translateHelpers';
import { formatParam } from '../../utils/internal/paramFormatters';
import { missingTranslation, missingPlaceholder } from '../../utils/internal/warnings';
import { translate } from '../../utils/internal/text';
import { formatListArray, formatList } from '../../utils/internal/listFormatters';
import { parseNumber, formatNumber, formatPercentage, formatCurrency, abbreviateNumber, advancedFormatNumber } from '../../utils/internal/numberFormatters';
import { toHumanSize } from '../../utils/internal/sizeFormatters';
import { html } from '../../utils/internal/htmlFormatters';
import { initializeLocaleSettings } from '../../utils/internal/localeSettings';
import { SafeString } from '../../utils/internal/SafeString';
import { debugLog } from '../../utils/internal/debugHelpers';
export function initializeI18nMethods(I18n) {
  // Global settings for I18n
  // Or methods intended as internal API for I18n
  // Should be removed as methods when I18n library moves to reference functions directly
  initializeLocaleSettings(I18n);
  initializeNewLoaderSettings(I18n);
  I18n.lookup = lookup;
  I18n.prepareOptions = prepareOptions;
  I18n.missingTranslation = missingTranslation;
  I18n.missingPlaceholder = missingPlaceholder;
  I18n.formatParam = formatParam;
  I18n.debugLog = debugLog; // Mostly functions we intend for people to use

  I18n.text = translate;
  I18n.formatListArray = formatListArray;
  I18n.formatList = formatList;
  I18n.parseNumber = parseNumber;
  I18n.formatNumber = formatNumber;
  I18n.formatPercentage = formatPercentage;
  I18n.formatCurrency = formatCurrency;
  I18n.abbreviateNumber = abbreviateNumber;
  I18n.advancedFormatNumber = advancedFormatNumber;
  I18n.formatSize = toHumanSize;
  I18n.html = html;
  I18n.SafeString = SafeString;
}