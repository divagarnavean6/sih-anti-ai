import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { getNotificationBackgroundColor } from './theme/notificationThemeOperators';

const badgeMargin = ({
  showBadge,
  positioning
}) => {
  return showBadge && positioning !== 'on-circle' && css(["margin-right:14px;"]);
};

const Wrapper = styled.div.withConfig({
  displayName: "VizExNotificationBadge__Wrapper",
  componentId: "sc-1mktq6i-0"
})(["position:relative;display:inline-flex;align-items:baseline;", ";line-height:1;"], badgeMargin);

const getVariationStyles = ({
  positioning
}) => positioning === 'on-circle' ? css(["left:75%;top:5%;"]) : css(["right:-12px;top:-4px;"]);

const CountBadge = styled.span.withConfig({
  displayName: "VizExNotificationBadge__CountBadge",
  componentId: "sc-1mktq6i-1"
})(["background-color:", ";border:1px solid white;box-shadow:0 0 0 1px white;display:inline;pointer-events:none;text-align:center;font-size:11px;vertical-align:baseline;border-radius:500px;color:white;padding:1px 4px;position:absolute;", ";"], ({
  theme
}) => getNotificationBackgroundColor(theme), getVariationStyles);
const defaultProps = {
  badgeDescription: 'notifications',
  positioning: 'default'
};

const VizExNotificationBadge = props => {
  const {
    badgeDescription,
    badgeLabel,
    children,
    showBadge,
    positioning
  } = props,
        rest = _objectWithoutPropertiesLoose(props, ["badgeDescription", "badgeLabel", "children", "showBadge", "positioning"]);

  return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
    showBadge: showBadge,
    positioning: positioning,
    children: [children, showBadge && /*#__PURE__*/_jsx(CountBadge, {
      "aria-label": badgeDescription,
      positioning: positioning,
      children: badgeLabel
    })]
  }));
};

VizExNotificationBadge.displayName = 'VizExNotificationBadge';
VizExNotificationBadge.propTypes = {
  badgeDescription: PropTypes.string,
  badgeLabel: PropTypes.node,
  children: PropTypes.node,
  positioning: PropTypes.oneOf(['default', 'on-circle']),
  showBadge: PropTypes.bool
};
VizExNotificationBadge.defaultProps = {
  badgeDescription: 'notifications',
  positioning: 'default'
};
export default VizExNotificationBadge;