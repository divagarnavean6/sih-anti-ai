'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { getAnyCompanyLogo } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCompanyLogo';
import styled from 'styled-components';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';
const BORDER_WIDTH = 2;
const CustomUIAvatarWrapper = styled.div.withConfig({
  displayName: "CustomChatHeading__CustomUIAvatarWrapper",
  componentId: "p0b2ph-0"
})(["display:flex;flex:0 0 ", "px;height:", "px;justify-content:center;"], ({
  size
}) => size, ({
  size
}) => AVATAR_SIZES[size] + BORDER_WIDTH * 2);

class CustomChatHeading extends Component {
  render() {
    const {
      borderColor,
      chatHeadingConfig,
      size
    } = this.props;
    const borderStyles = {
      padding: '2px',
      background: `${borderColor}`,
      borderRadius: '50%'
    };
    const contentStyles = {
      borderRadius: '50%'
    };
    const src = getAnyCompanyLogo(chatHeadingConfig);
    const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
    const altText = I18n.text('conversations-visitor-experience-components.default.avatar', {
      identifier: chatHeadingConfig.get('customChatName') || defaultAgentName
    });

    if (!chatHeadingConfig) {
      return null;
    }

    return /*#__PURE__*/_jsx(CustomUIAvatarWrapper, {
      children: /*#__PURE__*/_jsx(VizExAvatar, {
        className: "chat-head-avatar",
        size: size,
        src: src,
        style: borderStyles,
        contentStyle: contentStyles,
        alt: altText
      })
    });
  }

}

CustomChatHeading.propTypes = {
  borderColor: PropTypes.string.isRequired,
  chatHeadingConfig: PropTypes.oneOfType([RecordPropType('CompanyChatHeadingConfig'), RecordPropType('OwnerChatHeadingConfig'), RecordPropType('UsersAndTeamsChatHeadingConfig')]),
  size: PropTypes.string.isRequired
};
CustomChatHeading.defaultProps = {
  size: 'sm'
};
CustomChatHeading.displayName = 'CustomChatHeading';
export default CustomChatHeading;