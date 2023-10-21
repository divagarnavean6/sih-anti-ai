/* hs-eslint ignored failing-rules */

/* eslint-disable prefer-const */
'use es6';

import { translate } from './text';
const CONNECTOR_DEFAULTS = {
  inclusive: {
    wordsConnector: '|, ',
    twoWordsConnector: '| and ',
    lastWordConnector: '|, and '
  },
  exclusive: {
    wordsConnector: '|, ',
    twoWordsConnector: '| or ',
    lastWordConnector: '|, or '
  }
};

const interleave = function interleave(between, items) {
  const lastIndex = items.length - 1;
  return items.reduce((acc, item, index) => {
    acc.push(item);

    if (index !== lastIndex) {
      acc.push(between);
    }

    return acc;
  }, []);
};

export const formatListArray = function formatListArray(list, options) {
  let result;

  if (options == null) {
    options = {};
  }

  let {
    wordsConnector,
    twoWordsConnector,
    lastWordConnector,
    limit,
    excessKey,
    exclusive
  } = options;

  if (limit != null && limit <= 2) {
    throw new Error('The formatList limit must be 3 or larger');
  }

  if (limit != null && excessKey == null) {
    throw new Error('When using a limit in formatList, you must pass excessKey (that is a external, plurlized string reference)');
  }

  if (Array.isArray != null) {
    // Hack to use Array.isArray in a node envionment (since instanceof check won't work for arrays
    // created across vm/context boundaries)
    if (!Array.isArray(list)) {
      throw new Error('The first argument to I18n.formatList must be an array');
    }
  } else {
    if (!(list instanceof Array)) {
      throw new Error('The first argument to I18n.formatList must be an array');
    }
  } // Use passed options, then config for the locale, then defaults if missing


  const rootKey = 'number.human.array';
  let connectorType = 'inclusive';

  if (exclusive === true) {
    connectorType = 'exclusive';
  }

  wordsConnector = options.wordsConnector || translate(`${rootKey}.${connectorType}.wordsConnector`, {
    locale: options.locale
  }) || CONNECTOR_DEFAULTS[connectorType].wordsConnector;
  twoWordsConnector = options.twoWordsConnector || translate(`${rootKey}.${connectorType}.twoWordsConnector`, {
    locale: options.locale
  }) || CONNECTOR_DEFAULTS[connectorType].twoWordsConnector;
  lastWordConnector = options.lastWordConnector || translate(`${rootKey}.${connectorType}.lastWordConnector`, {
    locale: options.locale
  }) || CONNECTOR_DEFAULTS[connectorType].lastWordConnector;
  const {
    length
  } = list;

  if (length === 0) {
    return [];
  } else if (length === 1) {
    return [list[0]];
  } else if (length === 2) {
    return [list[0], twoWordsConnector, list[1]];
  } else if (limit == null || limit >= length) {
    result = interleave(wordsConnector, list.slice(0, -1));
    result.push(lastWordConnector);
    result.push(list[list.length - 1]);
    return result;
  } else {
    const excessString = translate(excessKey, {
      count: list.length - limit,
      locale: options.locale
    });
    result = interleave(wordsConnector, list.slice(0, limit));
    result.push(lastWordConnector);
    result.push(excessString);
    return result;
  }
};
export const formatList = function formatList(list, options) {
  if (options == null) {
    options = {};
  }

  return formatListArray(list, options).join('');
};