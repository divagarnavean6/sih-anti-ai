'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import I18n from 'I18n';
import { EERIE, OBSIDIAN } from 'HubStyleTokens/colors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import { formatHtml } from 'sanitize-text/sanitizers/HtmlSanitizer';
import InitialMessageTextButton from './components/InitialMessageTextButton.tsx';
import { LEFT_ALIGNED, RIGHT_ALIGNED, WidgetLocationProp } from './constants/WidgetLocations';
import InitialMessageAvatars from './components/InitialMessageAvatars';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import { createThemeV2 } from 'visitor-ui-component-library/theme/createThemeV2';
const WrapperLocation = {
  [LEFT_ALIGNED]: css(["padding-right:20px;.initial-message-close-button{right:inherit !important;left:8px;}"]),
  [RIGHT_ALIGNED]: css(["padding-left:20px;"])
};
export const StyleWrapper = styled.div.withConfig({
  displayName: "InitialMessageBubble__StyleWrapper",
  componentId: "sc-1e5951z-0"
})(["position:relative;width:260px;&.mobile{width:inherit;}", ";"], ({
  widgetLocation
}) => WrapperLocation[widgetLocation] || WrapperLocation[RIGHT_ALIGNED]);
export const CloseButton = styled(VizExIconButton).withConfig({
  displayName: "InitialMessageBubble__CloseButton",
  componentId: "sc-1e5951z-1"
})(["position:absolute;top:0;width:36px;height:36px;right:", ";color:", ";z-index:2;&:focus-visible{outline-offset:-2px;}"], ({
  widgetLocation
}) => widgetLocation === LEFT_ALIGNED ? '20px' : '0px', EERIE);
export default class InitialMessageBubble extends Component {
  constructor(...args) {
    super(...args);

    this.onClose = () => {
      try {
        this.props.onClose();
      } catch (err) {
        reportError({
          error: 'InitialMessageBubble Mysterious Error',
          fingerprint: ['ComponentError'],
          tags: {
            componentDidCatch: true
          }
        });
      }
    };

    this.renderAvatar = () => {
      const {
        avatarHeightAboveBubble,
        chatHeadingConfig,
        chatHeadingResponders,
        mobile,
        onClick
      } = this.props;
      const avatarHeightPx = mobile ? AVATAR_SIZES.sm : AVATAR_SIZES.md;
      const top = -(avatarHeightAboveBubble || avatarHeightPx / 2);
      return /*#__PURE__*/_jsx("div", {
        "data-test-id": "initial-message-avatar-wrapper",
        className: "initial-message-avatar justify-center",
        onClick: onClick,
        style: {
          top
        },
        children: /*#__PURE__*/_jsx(InitialMessageAvatars, {
          chatHeadingConfig: chatHeadingConfig,
          chatHeadingResponders: chatHeadingResponders,
          mobile: mobile
        })
      });
    };

    this.renderCloseButton = () => {
      const {
        widgetLocation
      } = this.props;
      return /*#__PURE__*/_jsx(CloseButton, {
        "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.dismiss'),
        size: "md",
        use: "transparent-on-background",
        shape: "circle",
        theme: createThemeV2({
          colors: {
            primary: OBSIDIAN
          }
        }),
        "data-test-id": "initial-message-close-button",
        onClick: this.onClose,
        widgetLocation: widgetLocation,
        children: /*#__PURE__*/_jsx(VizExIcon, {
          size: "13px",
          icon: /*#__PURE__*/_jsx(SVGClose, {})
        })
      });
    };
  }

  componentDidMount() {
    this.props.onUpdateSize();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.initialMessage !== this.props.initialMessage) {
      this.props.onUpdateSize();
    }
  }

  render() {
    const {
      initialMessage,
      onClick,
      mobile,
      setInitialMessageRef,
      widgetLocation
    } = this.props;
    /* eslint-disable  react/no-danger */

    return /*#__PURE__*/_jsxs(StyleWrapper, {
      className: mobile ? "mobile" : "",
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.welcomeMessage'),
      role: "status",
      ref: setInitialMessageRef,
      widgetLocation: widgetLocation,
      children: [/*#__PURE__*/_jsxs(InitialMessageTextButton, {
        onPress: onClick,
        children: [this.renderAvatar(), /*#__PURE__*/_jsx("p", {
          id: "welcome-message",
          role: "status",
          "data-test-id": "initial-message-text",
          className: "initial-message-text m-top-1 m-bottom-0",
          onClick: onClick,
          dangerouslySetInnerHTML: {
            __html: formatHtml(initialMessage)
          }
        })]
      }), this.renderCloseButton()]
    });
    /* eslint-enable  react/no-danger */
  }

}
InitialMessageBubble.displayName = 'InitialMessageBubble';
InitialMessageBubble.propTypes = {
  avatarHeightAboveBubble: PropTypes.number,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  initialMessage: PropTypes.string.isRequired,
  mobile: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSize: PropTypes.func.isRequired,
  setInitialMessageRef: PropTypes.func,
  widgetLocation: WidgetLocationProp
};
InitialMessageBubble.defaultProps = {
  mobile: false,
  onUpdateSize: () => {},
  setInitialMessageRef: () => {}
};