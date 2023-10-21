'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import I18n from 'I18n';
import unescapedText from 'I18n/utils/unescapedText';
export const getValue = ({
  useGap,
  message,
  options
}, unescapeOptions = false) => {
  let value = unescapeOptions ? // i18n-lint-describe-next-line key-is-argument
  unescapedText(message, options) : // i18n-lint-describe-next-line key-is-argument
  I18n.text(message, options);

  if (useGap === true) {
    value = ` ${value} `;
  }

  return value;
};
export const getPassThroughProps = allProps => {
  const localeOverwrite = allProps.options && allProps.options.locale;
  const result = {
    'data-locale-at-render': localeOverwrite || I18n.locale,
    'data-key': allProps.message
  };

  for (const propKey of Object.keys(allProps)) {
    if (['message', 'options', 'useGap'].indexOf(propKey) < 0) {
      result[propKey] = allProps[propKey];
    }
  }

  return result;
};
export const classNameFix = props => {
  const {
    className,
    class: classProp
  } = props,
        restProps = _objectWithoutPropertiesLoose(props, ["className", "class"]);

  if (className && !classProp) {
    return Object.assign({
      class: className
    }, restProps);
  }

  return props;
};
export const isSet = function isSet(value) {
  return value !== undefined && value !== null;
}; // interpolateToArray function to translate strings while preserving React element params (#108)

export const interpolateToArray = function interpolateToArray(key, options, escapeFunction) {
  const modifiedOpts = I18n.prepareOptions(options);
  modifiedOpts.__scope = key;
  const result = [];

  if (!options.locale && !I18n.langEnabled && !I18n.publicPage) {
    I18n.debugLog('Forcing translation in English, lang is not enabled');
    modifiedOpts.locale = 'en';
  } // i18n-lint-describe-next-line key-is-argument


  let remainingMessage = I18n.lookup(key, modifiedOpts);

  if (remainingMessage == null) {
    return [I18n.missingTranslation(key)];
  }

  if (remainingMessage === Object(remainingMessage) && isSet(options.count)) {
    if (options.count === 0 && remainingMessage.zero) {
      remainingMessage = remainingMessage.zero;
    } else if (options.count === 1 && remainingMessage.one) {
      remainingMessage = remainingMessage.one;
    } else {
      remainingMessage = remainingMessage.other;
    }
  }

  let i = 0;
  let match = I18n.placeholder.exec(remainingMessage);

  while (match) {
    // Custom HubSpot change for default escaping of params
    const prefix = remainingMessage.substring(0, match.index);

    if (prefix !== '') {
      result.push(escapeFunction('text-chunk', prefix, i++));
    }

    const optName = match[1];
    const rawOptValue = modifiedOpts[optName] != null ? modifiedOpts[optName] : I18n.missingPlaceholder(optName, remainingMessage, modifiedOpts);
    const escapedOptValue = escapeFunction(optName, rawOptValue, i++);

    if (escapedOptValue !== '') {
      result.push(escapedOptValue);
    }

    remainingMessage = remainingMessage.substring(match.index + match[0].length); // Reset `lastIndex` because we are re-using the same regex (and it maintains state when doing `exec`)

    I18n.placeholder.lastIndex = 0;
    match = I18n.placeholder.exec(remainingMessage);
  }

  if (remainingMessage !== '') {
    result.push(escapeFunction('text-chunk', remainingMessage, i++));
  }

  return result;
};