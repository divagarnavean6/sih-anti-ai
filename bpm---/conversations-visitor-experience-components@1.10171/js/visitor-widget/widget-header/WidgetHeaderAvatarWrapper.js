'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import styled from 'styled-components';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import ChatHeadingAvatars from './ChatHeadingAvatars';
import { getWidgetTitleText } from '../operators/getWidgetTitleText';
import { SMALL } from 'visitor-ui-component-library/constants/sizes';
import { HEADER_TEXT_TITLE_ID, HEADER_TEXT_DESCRIPTION_ID } from '../../visitor-widget/constants/textIds';
const BORDER_WIDTH = 2;
const Wrapper = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__Wrapper",
  componentId: "g7phcw-0"
})(["display:inline-flex;align-items:center;flex:1 1 auto;height:", "px;min-width:0;"], AVATAR_SIZES[SMALL] + BORDER_WIDTH * 2);
const HeaderTextWrapper = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__HeaderTextWrapper",
  componentId: "g7phcw-1"
})(["display:flex;flex-direction:column;height:100%;width:100%;justify-content:center;min-width:0;"]);
const HeaderName = styled.h5.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__HeaderName",
  componentId: "g7phcw-2"
})(["line-height:20px;margin-bottom:0;font-size:", ";"], props => props.titleText && props.titleText.length > 20 ? '14px' : null);
const AvailabilityMessage = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__AvailabilityMessage",
  componentId: "g7phcw-3"
})(["font-size:11px;line-height:initial;"]);
const TruncateString = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__TruncateString",
  componentId: "g7phcw-4"
})(["white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"]);

class WidgetHeaderAvatarWrapper extends PureComponent {
  render() {
    const {
      availabilityMessage,
      chatHeadingConfig,
      chatHeadingResponders,
      locale,
      mobile,
      showAvailabilityMessage,
      showStatusIndicator,
      borderColor
    } = this.props;
    const titleText = getWidgetTitleText(chatHeadingConfig, chatHeadingResponders, locale) || I18n.text('conversations-visitor-experience-components.default.agent');
    return /*#__PURE__*/_jsxs(Wrapper, {
      children: [/*#__PURE__*/_jsx("div", {
        "data-test-id": "chat-heading-avatar",
        children: /*#__PURE__*/_jsx(ChatHeadingAvatars, {
          chatHeadingConfig: chatHeadingConfig,
          chatHeadingResponders: chatHeadingResponders,
          mobile: mobile,
          showStatusIndicator: showStatusIndicator,
          borderColor: borderColor
        })
      }), /*#__PURE__*/_jsxs(HeaderTextWrapper, {
        className: "p-x-3",
        children: [/*#__PURE__*/_jsx(HeaderName, {
          titleText: titleText,
          "aria-level": "1",
          children: /*#__PURE__*/_jsx(TruncateString, {
            children: /*#__PURE__*/_jsx("span", {
              "data-test-id": "widget-header-name",
              className: "widget-header-name p-y-0",
              id: HEADER_TEXT_TITLE_ID,
              children: titleText
            })
          })
        }), showAvailabilityMessage && /*#__PURE__*/_jsx(AvailabilityMessage, {
          "data-test-type": "timestamp",
          id: HEADER_TEXT_DESCRIPTION_ID,
          children: availabilityMessage
        })]
      })]
    });
  }

}

WidgetHeaderAvatarWrapper.propTypes = {
  availabilityMessage: PropTypes.string,
  borderColor: PropTypes.string.isRequired,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  locale: PropTypes.string,
  mobile: PropTypes.bool.isRequired,
  showAvailabilityMessage: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired
};
WidgetHeaderAvatarWrapper.defaultProps = {
  mobile: false,
  showStatusIndicator: false
};
WidgetHeaderAvatarWrapper.displayName = 'WidgetHeaderAvatarWrapper';
export default WidgetHeaderAvatarWrapper;