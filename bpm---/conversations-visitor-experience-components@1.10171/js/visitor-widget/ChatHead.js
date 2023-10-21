'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import mrHubBot from 'bender-url!../../img/visitor-widget/bot-avatar.svg';
import VizExStatusIndicator from 'visitor-ui-component-library/indicator/VizExStatusIndicator';
import { OFFLINE, ONLINE } from 'visitor-ui-component-library/indicator/constants/StatusIndicatorStatus';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';
export default class ChatHead extends Component {
  constructor(...args) {
    super(...args);

    this.renderAvatar = () => {
      const {
        isBot,
        avatar,
        avatarAlt,
        avatarName,
        style,
        size,
        online,
        showStatus
      } = this.props;
      let avatarSrc = avatar;

      if (avatar === null && isBot) {
        avatarSrc = mrHubBot;
      }

      const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
      const avatarProps = {
        style,
        src: avatarSrc,
        className: 'chat-head-avatar',
        size,
        alt: avatarAlt === undefined ? I18n.text('conversations-visitor-experience-components.default.avatar', {
          identifier: avatarName || defaultAgentName
        }) : avatarAlt
      };

      if (showStatus) {
        const status = online ? ONLINE : OFFLINE;
        avatarProps.alt = I18n.text(status === ONLINE ? 'conversations-visitor-experience-components.default.avatarAvailable' : 'conversations-visitor-experience-components.default.avatarAway', {
          identifier: avatarName || defaultAgentName
        });
        return /*#__PURE__*/_jsx(VizExStatusIndicator, {
          status: status,
          size: size,
          children: /*#__PURE__*/_jsx(VizExAvatar, Object.assign({}, avatarProps))
        });
      }

      return /*#__PURE__*/_jsx(VizExAvatar, Object.assign({}, avatarProps));
    };
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
ChatHead.displayName = 'ChatHead';
ChatHead.propTypes = {
  avatar: PropTypes.string,
  avatarAlt: PropTypes.string,
  avatarName: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isBot: PropTypes.bool,
  onClick: PropTypes.func,
  online: PropTypes.bool.isRequired,
  showStatus: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired,
  style: PropTypes.object
};
ChatHead.defaultProps = {
  avatar: null,
  avatarName: '',
  away: false,
  disabled: false,
  online: false,
  showStatus: false,
  isVisitorWidget: false,
  size: 'md'
};