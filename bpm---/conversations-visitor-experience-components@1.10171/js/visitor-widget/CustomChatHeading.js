'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { getAnyCompanyLogo } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCompanyLogo';
import { getChatHeadGroupStyle } from '../util/getChatHeadGroupStyle';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';

class CustomChatHeading extends Component {
  render() {
    const {
      chatHeadingConfig,
      mobile,
      size
    } = this.props;
    const src = getAnyCompanyLogo(chatHeadingConfig);
    const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
    const altText = I18n.text('conversations-visitor-experience-components.default.avatar', {
      identifier: chatHeadingConfig.get('customChatName') || defaultAgentName
    });

    if (!chatHeadingConfig) {
      return null;
    }

    return /*#__PURE__*/_jsx("div", {
      className: "justify-center align-center",
      style: getChatHeadGroupStyle({
        mobile
      }),
      children: /*#__PURE__*/_jsx(VizExAvatar, {
        src: src,
        className: "chat-head-avatar",
        size: size,
        alt: altText
      })
    });
  }

}

CustomChatHeading.propTypes = {
  chatHeadingConfig: PropTypes.oneOfType([RecordPropType('CompanyChatHeadingConfig'), RecordPropType('OwnerChatHeadingConfig')]),
  mobile: PropTypes.bool,
  size: PropTypes.string.isRequired
};
CustomChatHeading.displayName = 'CustomChatHeading';
export default CustomChatHeading;