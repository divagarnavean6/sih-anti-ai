'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { HEADER_HEIGHT } from '../widget-dimensions/constants/dimensions';
import { getBrandStyle } from '../visitor-widget/util/color';
import { HEADER_TEXT_DESCRIPTION_ID, HEADER_TEXT_TITLE_ID } from '../visitor-widget/constants/textIds';
export const FullHeightDiv = styled.div.withConfig({
  displayName: "WidgetHeaderStyleWrapper__FullHeightDiv",
  componentId: "sc-1tup56h-0"
})(["align-items:center;color:", ";display:flex;height:100%;padding:16px 16px;"], ({
  textColor
}) => textColor);
export const BackgroundPanelContent = styled.nav.withConfig({
  displayName: "WidgetHeaderStyleWrapper__BackgroundPanelContent",
  componentId: "sc-1tup56h-1"
})(["height:", "px;border-radius:", ";"], HEADER_HEIGHT, ({
  mobile,
  inline
}) => mobile || inline ? '0' : '8px 8px 0 0');

class WidgetHeaderStyleWrapper extends Component {
  render() {
    const {
      inline,
      mobile,
      coloring: {
        accentColor,
        textColor
      }
    } = this.props;
    return /*#__PURE__*/_jsx(BackgroundPanelContent, {
      className: 'widget-background-panel',
      style: getBrandStyle(accentColor),
      role: "banner",
      "aria-labelledby": HEADER_TEXT_TITLE_ID,
      "aria-describedby": HEADER_TEXT_DESCRIPTION_ID,
      mobile: mobile,
      inline: inline,
      children: /*#__PURE__*/_jsx(FullHeightDiv, {
        textColor: textColor,
        children: this.props.children
      })
    });
  }

}

WidgetHeaderStyleWrapper.displayName = 'WidgetHeaderStyleWrapper';
WidgetHeaderStyleWrapper.propTypes = {
  children: PropTypes.node,
  coloring: RecordPropType('ColoringRecord').isRequired,
  inline: PropTypes.bool.isRequired,
  mobile: PropTypes.bool
};
export default WidgetHeaderStyleWrapper;