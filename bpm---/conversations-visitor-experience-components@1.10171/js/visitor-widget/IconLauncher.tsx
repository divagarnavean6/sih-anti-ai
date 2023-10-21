import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import OpenIcon from './OpenIcon';
import { OBSIDIAN, OLAF } from 'HubStyleTokens/colors';
import { launcherHeight, launcherWidth } from './constants/launcherDimensions';
import { useAccessibilityContext } from 'conversations-visitor-message-history/accessibility/AccessibilityContext';
import launcherInteractionStyles from './constants/launcherInteractionStyles';
import TwistFadeTransition from '../presentation-components/TwistFadeTransition'; // @ts-expect-error Not typed

import CloseIcon from './CloseIcon';
const BaseLauncher = styled.button.withConfig({
  displayName: "IconLauncher__BaseLauncher",
  componentId: "gtp6fl-0"
})(["border:none;position:relative;", ""], launcherInteractionStyles);
const ShapedLauncher = styled(BaseLauncher).withConfig({
  displayName: "IconLauncher__ShapedLauncher",
  componentId: "gtp6fl-1"
})(["border-radius:50%;height:", "px;width:", "px;"], launcherHeight, launcherWidth);
const LauncherIcon = styled.div.withConfig({
  displayName: "IconLauncher__LauncherIcon",
  componentId: "gtp6fl-2"
})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;"]);

const IconLauncher = ({
  ariaLabel,
  badgeNumber,
  className,
  onClick,
  showBadge,
  style,
  useDefaultColor,
  open
}) => {
  const color = useDefaultColor ? OBSIDIAN : OLAF;

  const icon = /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(TwistFadeTransition, {
      in: open,
      direction: "left",
      children: /*#__PURE__*/_jsx(LauncherIcon, {
        children: /*#__PURE__*/_jsx(CloseIcon, {
          color: color,
          width: 20,
          height: 20
        })
      })
    }), /*#__PURE__*/_jsx(TwistFadeTransition, {
      in: !open,
      direction: "right",
      children: /*#__PURE__*/_jsx(LauncherIcon, {
        children: /*#__PURE__*/_jsx(OpenIcon, {
          color: color,
          width: 32,
          height: 30
        })
      })
    })]
  });

  const {
    setLauncherRef
  } = useAccessibilityContext();
  return /*#__PURE__*/_jsx(VizExNotificationBadge, {
    badgeLabel: badgeNumber,
    showBadge: showBadge,
    positioning: "on-circle",
    children: /*#__PURE__*/_jsx(ShapedLauncher, {
      "aria-label": ariaLabel,
      "aria-haspopup": "dialog",
      isDark: useDefaultColor,
      style: style,
      className: className,
      onClick: onClick,
      ref: setLauncherRef,
      children: icon
    })
  });
};

IconLauncher.displayName = 'IconLauncher';
IconLauncher.defaultProps = {
  open: false,
  onClick: () => {},
  showBadge: false
};
IconLauncher.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  badgeNumber: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  open: PropTypes.bool.isRequired,
  showBadge: PropTypes.bool.isRequired,
  style: PropTypes.object,
  useDefaultColor: PropTypes.bool.isRequired
};
export default IconLauncher;