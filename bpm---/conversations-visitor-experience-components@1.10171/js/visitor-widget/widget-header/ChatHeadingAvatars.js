'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import ChatHeadGroup from './ChatHeadGroup';
import CustomChatHeading from './CustomChatHeading';

class ChatHeadingAvatars extends PureComponent {
  render() {
    const {
      chatHeadingConfig,
      chatHeadingResponders,
      mobile,
      showStatusIndicator,
      borderColor,
      size
    } = this.props;
    const AvatarComponent = chatHeadingResponders.size ? ChatHeadGroup : CustomChatHeading;
    return /*#__PURE__*/_jsx(AvatarComponent, {
      chatHeadingConfig: chatHeadingConfig,
      mobile: mobile,
      responders: chatHeadingResponders,
      showStatusIndicator: showStatusIndicator,
      borderColor: borderColor,
      size: size
    });
  }

}

ChatHeadingAvatars.propTypes = {
  borderColor: PropTypes.string.isRequired,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  mobile: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired
};
ChatHeadingAvatars.defaultProps = {
  mobile: false,
  showStatusIndicator: false,
  size: 'sm'
};
ChatHeadingAvatars.displayName = 'ChatHeadingAvatars';
export default ChatHeadingAvatars;