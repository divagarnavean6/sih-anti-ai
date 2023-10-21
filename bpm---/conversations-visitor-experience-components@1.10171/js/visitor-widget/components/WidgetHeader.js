'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { Component } from 'react';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import WidgetHeaderContent from '../widget-header/WidgetHeaderContent';
import WidgetHeaderBackButton from '../widget-header/WidgetHeaderBackButton';
import WidgetHeaderStyleWrapper from '../../presentation-components/WidgetHeaderStyleWrapper';
import WidgetViews from '../proptypes/WidgetViews';
import { THREAD_VIEW, THREAD_LIST, KNOWLEDGE_BASE } from '../constants/views';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import styled, { ThemeProvider } from 'styled-components';
import { getAccentColor, getUseDefaultColor } from 'conversations-internal-schema/coloring/operators/coloringGetters';
import { setPrimaryColor, setTextOnPrimaryColor } from 'visitor-ui-component-library/theme/defaultThemeOperators';
import { DEFAULT_TEXT_COLOR } from 'visitor-ui-component-library/theme/ColorConstants';
import { createTheme } from 'visitor-ui-component-library/theme/createTheme';
const Spacer = styled.div.withConfig({
  displayName: "WidgetHeader__Spacer",
  componentId: "ezm3zv-0"
})(["flex-grow:1;"]);

class WidgetHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAvailabilityMessage: false
    };
  }

  getAvailabilityMessage() {
    return this.props.preview ? this.props.previewResponseTimeText : this.props.typicalResponseTimeMessage || this.props.officeHoursMessage;
  }

  getShowAvailabilityMessage() {
    const {
      showAvailabilityMessage,
      typicalResponseTimeMessage,
      officeHoursMessage,
      preview,
      previewResponseTimeText
    } = this.props;
    const showRealAvailabilityMessage = showAvailabilityMessage && (typicalResponseTimeMessage || officeHoursMessage);

    if (showRealAvailabilityMessage) {
      return true;
    }

    return Boolean(preview && !!previewResponseTimeText);
  }

  render() {
    const {
      isThreadAssigned,
      chatHeadingConfig,
      chatHeadingResponders,
      customHeaderText,
      coloring,
      mobile,
      inline,
      onClose,
      showBackButton,
      view,
      backButtonDisabled
    } = this.props;
    const primaryColor = getAccentColor(coloring);
    const useDefaultColor = getUseDefaultColor(coloring);
    const operators = [setPrimaryColor(primaryColor)];

    if (useDefaultColor) {
      operators.push(setTextOnPrimaryColor(DEFAULT_TEXT_COLOR));
    }

    return /*#__PURE__*/_jsx(ThemeProvider, {
      theme: createTheme(...operators),
      children: /*#__PURE__*/_jsxs(WidgetHeaderStyleWrapper, {
        mobile: mobile,
        coloring: coloring,
        inline: inline,
        children: [showBackButton && /*#__PURE__*/_jsx(WidgetHeaderBackButton, {
          navigateToThreadList: this.props.navigateToThreadList,
          unseenThreadsCountExcludingCurrentThread: this.props.unseenThreadsCountExcludingCurrentThread,
          disabled: backButtonDisabled
        }), /*#__PURE__*/_jsx(WidgetHeaderContent, {
          availabilityMessage: this.getAvailabilityMessage(),
          chatHeadingConfig: chatHeadingConfig,
          createNewThread: this.props.createNewThread,
          coloring: coloring,
          customHeaderText: customHeaderText,
          showStatusIndicator: isThreadAssigned,
          mobile: mobile,
          chatHeadingResponders: chatHeadingResponders,
          showAvailabilityMessage: this.getShowAvailabilityMessage(),
          showCreateThreadButton: view === THREAD_LIST,
          showThreadListHeader: view === THREAD_LIST || view === KNOWLEDGE_BASE
        }), /*#__PURE__*/_jsx(Spacer, {}), mobile && !inline && /*#__PURE__*/_jsx(VizExIconButton, {
          "data-test-id": "mobile-close-button",
          onClick: onClose,
          className: "m-left-2",
          use: "transparent-on-primary",
          children: /*#__PURE__*/_jsx(VizExIcon, {
            icon: /*#__PURE__*/_jsx(SVGClose, {})
          })
        })]
      })
    });
  }

}

WidgetHeader.propTypes = {
  backButtonDisabled: PropTypes.bool,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  coloring: RecordPropType('ColoringRecord').isRequired,
  createNewThread: PropTypes.func.isRequired,
  customHeaderText: PropTypes.string,
  inline: PropTypes.bool.isRequired,
  isThreadAssigned: PropTypes.bool,
  mobile: PropTypes.bool,
  navigateToThreadList: PropTypes.func,
  officeHoursMessage: PropTypes.string,
  onClose: PropTypes.func,
  preview: PropTypes.bool,
  previewResponseTimeText: PropTypes.string,
  showAvailabilityMessage: PropTypes.bool,
  showBackButton: PropTypes.bool,
  typicalResponseTimeMessage: PropTypes.string,
  unseenThreadsCountExcludingCurrentThread: PropTypes.number,
  view: WidgetViews
};
WidgetHeader.defaultProps = {
  createNewThread: () => {},
  inline: false,
  isThreadAssigned: false,
  onClose: () => {},
  navigateToThreadList: () => {},
  showBackButton: false,
  showAvailabilityMessage: false,
  unseenThreadsCountExcludingCurrentThread: 0,
  view: THREAD_VIEW
};
WidgetHeader.displayName = 'WidgetHeader';
export default WidgetHeader;