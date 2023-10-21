'use es6';

import I18n from 'I18n';
import { translate } from './text';
export const html = function html(key, opts) {
  if (opts == null) {
    opts = {};
  }

  let gap = '';

  if (opts.useGap === true || opts.noGap === false) {
    gap = ' ';
  }

  return `${gap}<i18n-string data-key='${key}' data-locale-at-render='${I18n.locale}'>${translate(key, opts)}</i18n-string>${gap}`;
};