'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { isAway } from 'conversations-internal-schema/responders/operators/isAway';
import { getFriendlyOrFormalName } from 'conversations-internal-schema/responders/operators/responderGetters';
import { OFFLINE, ONLINE } from 'visitor-ui-component-library/indicator/constants/StatusIndicatorStatus';
import VizExStatusIndicator from 'visitor-ui-component-library/indicator/VizExStatusIndicator';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';

class ChatHead extends Component {
  renderAvatar() {
    const {
      avatar,
      size,
      responder,
      showStatus,
      style
    } = this.props;
    const contentStyles = {
      borderRadius: '50%'
    };
    let status = '';

    if (showStatus && responder) {
      const agentIsAway = isAway(responder);
      status = agentIsAway ? OFFLINE : ONLINE;
    }

    const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
    const altText = I18n.text(status === ONLINE ? 'conversations-visitor-experience-components.default.avatarAvailable' : status === OFFLINE ? 'conversations-visitor-experience-components.default.avatarAway' : 'conversations-visitor-experience-components.default.avatar', {
      identifier: getFriendlyOrFormalName(responder) || defaultAgentName
    });

    const avatarJSX = /*#__PURE__*/_jsx(VizExAvatar, {
      style: style,
      src: avatar,
      className: "chat-head-avatar",
      size: size,
      contentStyle: contentStyles,
      alt: altText
    });

    if (status) {
      return /*#__PURE__*/_jsx(VizExStatusIndicator, {
        status: status,
        size: size,
        children: avatarJSX
      });
    }

    return avatarJSX;
  }

  render() {
    const {
      onClick,
      className,
      disabled
    } = this.props;
    const classes = classNames('chat-head', className, disabled && 'chat-head-disabled');
    return /*#__PURE__*/_jsx("div", {
      className: classes,
      onClick: onClick,
      children: this.renderAvatar()
    });
  }

}

ChatHead.propTypes = {
  avatar: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  responder: RecordPropType('Responder'),
  showStatus: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired,
  style: PropTypes.object
};
ChatHead.defaultProps = {
  avatar: null,
  away: false,
  disabled: false,
  online: false,
  showStatus: false,
  isVisitorWidget: false,
  size: 'md'
};
ChatHead.displayName = 'ChatHead';
export default ChatHead;