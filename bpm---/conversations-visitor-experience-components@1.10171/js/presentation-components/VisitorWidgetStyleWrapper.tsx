import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { LEFT_ALIGNED, RIGHT_ALIGNED, WidgetLocationProp } from '../visitor-widget/constants/WidgetLocations';
import { calculateChatWidgetHeight } from '../widget-dimensions/calculateChatWidgetHeight';
import { OLAF } from 'HubStyleTokens/colors';
import { BASE_WIDGET_WIDTH, WIDGET_SHADOW_WIDTH } from '../widget-dimensions/constants/dimensions';
const sizes = {
  small: 'small',
  'extra-small': 'extra-small',
  default: 'default'
};
export const VISITOR_WIDGET_BORDER_RADIUS = 8;
export const WidgetStyleWrapper = styled.div.withConfig({
  displayName: "VisitorWidgetStyleWrapper__WidgetStyleWrapper",
  componentId: "yj2kg7-0"
})(["display:flex;flex-direction:column;align-items:flex-end;height:", ";width:", ";margin-top:", ";transform:", ";transform-origin:bottom right;"], ({
  inline,
  mobile
}) => inline || mobile ? '100%' : undefined, ({
  mobile
}) => mobile ? '100%' : undefined, ({
  inline
}) => inline ? '0' : undefined, ({
  size
}) => {
  if (size === sizes.small) {
    return 'scale(0.75)';
  } else if (size === sizes['extra-small']) {
    return 'scale(0.5)';
  } else {
    return undefined;
  }
});
const WidgetWrapperLocation = {
  [LEFT_ALIGNED]: css(["margin-left:0;margin-right:", "px;"], WIDGET_SHADOW_WIDTH),
  [RIGHT_ALIGNED]: css(["margin-left:", "px;margin-right:0;"], WIDGET_SHADOW_WIDTH)
};
export const WidgetContentStyleWrapper = styled.div.withConfig({
  displayName: "VisitorWidgetStyleWrapper__WidgetContentStyleWrapper",
  componentId: "yj2kg7-1"
})(["height:", ";background:", ";border-radius:", "px;box-shadow:0 5px 20px rgba(0,0,0,0.1);position:relative;width:", "px;transition:bottom 0.25s ease-in-out;&.inline{box-shadow:none;height:100%;margin:0;width:100%;border-radius:0;}", ""], ({
  mobile,
  browserWindowHeight,
  showCloseButton
}) => !mobile ? `${calculateChatWidgetHeight(browserWindowHeight, {
  showCloseButton
})}px` : '100%', OLAF, VISITOR_WIDGET_BORDER_RADIUS, BASE_WIDGET_WIDTH, ({
  widgetLocation
}) => WidgetWrapperLocation[widgetLocation || RIGHT_ALIGNED]);
export const WIDGET_CONTENT_STYLE_WRAPPER_TEST_ID = 'chat-widget-wrapper';

const VisitorWidgetStyleWrapper = props => {
  const {
    browserWindowHeight,
    children,
    className,
    inline = false,
    showCloseButton = true,
    size = sizes.default,
    style,
    mobile,
    widgetLocation = RIGHT_ALIGNED,
    forwardedRef
  } = props,
        rest = _objectWithoutPropertiesLoose(props, ["browserWindowHeight", "children", "className", "inline", "showCloseButton", "size", "style", "mobile", "widgetLocation", "forwardedRef"]);

  return /*#__PURE__*/_jsx(WidgetStyleWrapper, {
    style: style,
    inline: inline,
    size: size,
    mobile: !!mobile,
    children: /*#__PURE__*/_jsx(WidgetContentStyleWrapper, Object.assign({
      className: classNames('chat-widget', className, mobile && "mobile", inline && "inline"),
      "data-test-id": WIDGET_CONTENT_STYLE_WRAPPER_TEST_ID,
      browserWindowHeight: browserWindowHeight,
      widgetLocation: widgetLocation,
      mobile: !!mobile,
      showCloseButton: !!showCloseButton,
      ref: forwardedRef
    }, rest, {
      children: children
    }))
  });
};

VisitorWidgetStyleWrapper.propTypes = {
  browserWindowHeight: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  forwardedRef: PropTypes.object,
  inline: PropTypes.bool.isRequired,
  mobile: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  size: PropTypes.oneOf(Object.keys(sizes)).isRequired,
  style: PropTypes.object,
  widgetLocation: WidgetLocationProp
};
VisitorWidgetStyleWrapper.defaultProps = {
  inline: false,
  showCloseButton: true,
  size: sizes.default,
  widgetLocation: RIGHT_ALIGNED
};
VisitorWidgetStyleWrapper.displayName = 'VisitorWidgetStyleWrapper';
export default VisitorWidgetStyleWrapper;