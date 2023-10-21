'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { classNameFix, getPassThroughProps, getValue } from './utils';
export default class FormattedMessage extends Component {
  render() {
    const {
      useGap,
      message,
      options
    } = this.props;
    const props = classNameFix(getPassThroughProps(this.props));
    return /*#__PURE__*/_jsx("i18n-string", Object.assign({}, props, {
      children: getValue({
        useGap,
        message,
        options
      }, true)
    }));
  }

}
FormattedMessage.displayName = 'FormattedMessage';
FormattedMessage.propTypes = {
  message: PropTypes.string.isRequired,
  options: PropTypes.object,
  useGap: PropTypes.bool
};
FormattedMessage.isI18nElement = true;
FormattedMessage.defaultProps = {
  options: {},
  useGap: false
};