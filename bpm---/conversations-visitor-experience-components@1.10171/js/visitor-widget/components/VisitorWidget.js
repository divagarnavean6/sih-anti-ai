'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { List } from 'immutable';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { RIGHT_ALIGNED, WidgetLocationProp } from '../constants/WidgetLocations';
import WidgetHeader from './WidgetHeader';
import VisitorWidgetStyleWrapper from '../../presentation-components/VisitorWidgetStyleWrapper';
import { HEADER_HEIGHT } from '../../widget-dimensions/constants/dimensions';
import styled from 'styled-components';
import WidgetViews from '../proptypes/WidgetViews';
import { THREAD_VIEW } from '../constants/views';
export const WidgetBodyDiv = styled.div.withConfig({
  displayName: "VisitorWidget__WidgetBodyDiv",
  componentId: "sc-1069v0u-0"
})(["display:flex;flex-direction:column;height:calc(100% - ", "px);"], HEADER_HEIGHT);

const VisitorWidget = props => {
  const {
    browserWindowHeight,
    chatHeadingConfig,
    chatHeadingResponders,
    children,
    coloring,
    closeWidget,
    customHeaderText,
    inline,
    isPreview,
    isThreadAssigned,
    createNewThread,
    mobile,
    officeHoursMessage,
    showAvailabilityMessage,
    navigateToThreadList,
    showBackButton,
    size,
    style,
    typicalResponseTimeMessage,
    unseenThreadsCountExcludingCurrentThread,
    view,
    widgetLocation,
    backButtonDisabled
  } = props;
  return /*#__PURE__*/_jsxs(VisitorWidgetStyleWrapper, {
    browserWindowHeight: browserWindowHeight,
    inline: inline,
    size: size,
    style: style,
    mobile: mobile,
    widgetLocation: widgetLocation,
    children: [/*#__PURE__*/_jsx(WidgetHeader, {
      chatHeadingConfig: chatHeadingConfig,
      coloring: coloring,
      createNewThread: createNewThread,
      chatHeadingResponders: chatHeadingResponders,
      customHeaderText: customHeaderText,
      inline: inline,
      isThreadAssigned: isThreadAssigned,
      mobile: mobile,
      officeHoursMessage: officeHoursMessage,
      onClose: closeWidget,
      preview: isPreview,
      showAvailabilityMessage: showAvailabilityMessage,
      navigateToThreadList: navigateToThreadList,
      showBackButton: showBackButton,
      typicalResponseTimeMessage: typicalResponseTimeMessage,
      unseenThreadsCountExcludingCurrentThread: unseenThreadsCountExcludingCurrentThread,
      view: view,
      backButtonDisabled: backButtonDisabled
    }), /*#__PURE__*/_jsx(WidgetBodyDiv, {
      children: children
    })]
  });
};

VisitorWidget.propTypes = {
  backButtonDisabled: PropTypes.bool,
  browserWindowHeight: PropTypes.number.isRequired,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List),
  children: PropTypes.node.isRequired,
  closeWidget: PropTypes.func.isRequired,
  coloring: RecordPropType('ColoringRecord').isRequired,
  createNewThread: PropTypes.func,
  customHeaderText: PropTypes.string,
  inline: PropTypes.bool.isRequired,
  isPreview: PropTypes.bool.isRequired,
  isThreadAssigned: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  navigateToThreadList: PropTypes.func,
  officeHoursMessage: PropTypes.string,
  showAvailabilityMessage: PropTypes.bool,
  showBackButton: PropTypes.bool.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  typicalResponseTimeMessage: PropTypes.string,
  unseenThreadsCountExcludingCurrentThread: PropTypes.number,
  view: WidgetViews,
  widgetLocation: WidgetLocationProp
};
VisitorWidget.defaultProps = {
  customHeaderText: null,
  inline: false,
  isPreview: false,
  isThreadAssigned: false,
  mobile: false,
  onUpdateOpened: () => {},
  widgetLocation: RIGHT_ALIGNED,
  view: THREAD_VIEW
};
VisitorWidget.displayName = 'VisitorWidget';
export default VisitorWidget;