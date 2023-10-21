'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { ChatWidgetLocaleContextConsumer } from '../ChatWidgetLocaleContext';
import ThreadListHeader from './ThreadListHeader';
import WidgetHeaderAvatarWrapper from './WidgetHeaderAvatarWrapper';

class WidgetHeaderContent extends Component {
  render() {
    const {
      textColor
    } = this.props.coloring;
    const {
      availabilityMessage,
      chatHeadingConfig,
      chatHeadingResponders,
      createNewThread,
      customHeaderText,
      mobile,
      showAvailabilityMessage,
      showCreateThreadButton,
      showStatusIndicator,
      showThreadListHeader
    } = this.props;
    return /*#__PURE__*/_jsx(Fragment, {
      children: showThreadListHeader ? /*#__PURE__*/_jsx(ThreadListHeader, {
        createNewThread: createNewThread,
        customHeaderText: customHeaderText,
        textColor: textColor,
        mobile: mobile,
        showCreateThreadButton: showCreateThreadButton
      }) : /*#__PURE__*/_jsx(ChatWidgetLocaleContextConsumer, {
        children: locale => /*#__PURE__*/_jsx(WidgetHeaderAvatarWrapper, {
          availabilityMessage: availabilityMessage,
          borderColor: textColor,
          chatHeadingConfig: chatHeadingConfig,
          chatHeadingResponders: chatHeadingResponders,
          locale: locale,
          mobile: mobile,
          showAvailabilityMessage: showAvailabilityMessage,
          showStatusIndicator: showStatusIndicator
        })
      })
    });
  }

}

WidgetHeaderContent.propTypes = {
  availabilityMessage: PropTypes.string,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  coloring: RecordPropType('ColoringRecord').isRequired,
  createNewThread: PropTypes.func.isRequired,
  customHeaderText: PropTypes.string,
  mobile: PropTypes.bool,
  showAvailabilityMessage: PropTypes.bool.isRequired,
  showCreateThreadButton: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired,
  showThreadListHeader: PropTypes.bool.isRequired
};
WidgetHeaderContent.displayName = 'WidgetHeaderContent';
export default WidgetHeaderContent;