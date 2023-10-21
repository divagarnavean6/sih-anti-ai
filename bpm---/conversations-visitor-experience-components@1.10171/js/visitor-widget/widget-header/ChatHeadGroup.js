'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { OLAF } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import { getUserId, getAvatar, getIsBot } from 'conversations-internal-schema/responders/operators/responderGetters';
import { isAvailable } from 'conversations-internal-schema/responders/operators/isAvailable';
import ChatHead from './ChatHead';
const BORDER_WIDTH = 2;

const chatHeadCenter = (borderColor = OLAF) => ({
  padding: `${BORDER_WIDTH}px`,
  background: `${borderColor}`,
  borderRadius: '50%',
  zIndex: 0
});

const getMarginLeft = size => {
  switch (size) {
    case 'sm':
      return -10;

    case 'xs':
      return -15;

    default:
      return -10;
  }
};

const chatHeadRight = (borderColor, zIndex, size) => Object.assign({}, chatHeadCenter(borderColor), {
  zIndex,
  marginLeft: getMarginLeft(size)
});

const ChatHeadGroupWrapper = styled.div.withConfig({
  displayName: "ChatHeadGroup__ChatHeadGroupWrapper",
  componentId: "sc-45k6nk-0"
})(["display:flex;flex:0 0 ", "px;height:", "px;justify-content:center;"], ({
  size
}) => size, ({
  size
}) => AVATAR_SIZES[size] + BORDER_WIDTH * 2);

function getChatHeadStyle(index, borderColor, size) {
  if (index >= 1) {
    return chatHeadRight(borderColor, index, size);
  }

  return chatHeadCenter(borderColor);
}

function ChatHeadGroup({
  showStatusIndicator,
  responders,
  borderColor,
  size
}) {
  const chatHeadElements = responders.map((responder, index) => {
    const avatar = getAvatar(responder);
    const online = isAvailable(responder);
    const isBot = getIsBot(responder);
    const userId = getUserId(responder);
    const style = getChatHeadStyle(index, borderColor, size);
    const className = 'chat-head' + (index >= 1 ? " chat-group-head-right" : "");
    return /*#__PURE__*/_jsx(ChatHead, {
      avatar: avatar,
      className: className,
      isBot: isBot,
      isVisitorWidget: true,
      online: online,
      responder: responder,
      showStatus: showStatusIndicator,
      size: size,
      style: style
    }, `chat-head.${userId}`);
  });
  return /*#__PURE__*/_jsx(ChatHeadGroupWrapper, {
    size: size,
    children: chatHeadElements
  });
}

ChatHeadGroup.propTypes = {
  borderColor: PropTypes.string.isRequired,
  responders: PropTypes.instanceOf(List).isRequired,
  showStatusIndicator: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired
};
ChatHeadGroup.defaultProps = {
  showStatusIndicator: false,
  size: 'sm'
};
ChatHeadGroup.displayName = 'ChatHeadGroup';
export default ChatHeadGroup;