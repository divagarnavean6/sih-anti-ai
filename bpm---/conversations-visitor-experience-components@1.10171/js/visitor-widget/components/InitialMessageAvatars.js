'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import InitialMessageChatHeadGroup from './InitialMessageChatHeadGroup';
import CustomChatHeading from '../CustomChatHeading';

class InitialMessageAvatars extends PureComponent {
  render() {
    const {
      chatHeadingConfig,
      chatHeadingResponders,
      mobile,
      showStatusIndicator
    } = this.props;
    const size = mobile ? 'sm' : 'md';
    const AvatarComponent = chatHeadingResponders.size ? InitialMessageChatHeadGroup : CustomChatHeading;
    return /*#__PURE__*/_jsx(AvatarComponent, {
      size: size,
      mobile: mobile,
      responders: chatHeadingResponders,
      chatHeadingConfig: chatHeadingConfig,
      showStatusIndicator: showStatusIndicator
    });
  }

}

InitialMessageAvatars.propTypes = {
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  mobile: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired
};
InitialMessageAvatars.defaultProps = {
  mobile: false,
  showStatusIndicator: false
};
InitialMessageAvatars.displayName = 'InitialMessageAvatars';
export default InitialMessageAvatars;