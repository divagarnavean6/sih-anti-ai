'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as React from 'react';
import FormattedMessage from './FormattedMessage';
import I18n from 'I18n';
const defaultElements = {
  wrapper: 'span'
};

function createElement(elements, type, ...args) {
  return /*#__PURE__*/React.createElement(elements && elements[type] || defaultElements[type] || defaultElements.wrapper, ...args);
}

function renderMissingOrInvalidKey(props) {
  console.warn(`I18n: FormattedJSXMessage called with missing or non-JSX message key ${props.message}. See go/i18n-react for more info.`);
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: props.message,
    options: props.options
  });
}

const isSet = value => {
  return value !== undefined && value !== null;
};

const FormattedJSXMessage = props => {
  let fn = I18n.lookup(props.message, {
    locale: I18n.langEnabled ? I18n.locale : 'en'
  });

  if (!isSet(fn)) {
    return renderMissingOrInvalidKey(props);
  }

  const count = props.options && props.options.count;
  const countIsSet = isSet(count);

  if (typeof fn === 'object' && countIsSet) {
    const pluralizer = I18n.pluralization.get();
    const keys = pluralizer(count);

    while (keys.length) {
      const key = keys.shift();

      if (isSet(fn[key])) {
        fn = fn[key];
        break;
      }
    }
  }

  const formattedProps = Object.assign({}, props.options);

  if (countIsSet && typeof count === 'number') {
    formattedProps.count = I18n.formatNumber(count);
  } else if (typeof fn === 'string') {
    return renderMissingOrInvalidKey(props);
  }

  return fn(createElement, props.elements, formattedProps);
};

FormattedJSXMessage.propTypes = {
  message: PropTypes.string.isRequired,
  elements: PropTypes.object.isRequired,
  options: PropTypes.object,
  jsxMessageValidator: (props, propName, componentName) => {
    if (!props.message.endsWith('_jsx')) {
      console.warn(`I18n: ${componentName} called with invalid message prop not ending in _jsx for ${props.message}`);
    }
  }
};
export default FormattedJSXMessage;