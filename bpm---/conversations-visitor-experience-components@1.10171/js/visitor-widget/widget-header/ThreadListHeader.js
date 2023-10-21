'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import { OLAF } from 'HubStyleTokens/colors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGCompose from 'visitor-ui-component-library-icons/icons/SVGCompose';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import { HEADER_TEXT_TITLE_ID } from '../../visitor-widget/constants/textIds';
export const HeaderWrapper = styled.div.withConfig({
  displayName: "ThreadListHeader__HeaderWrapper",
  componentId: "y52uge-0"
})(["align-items:center;display:flex;justify-content:space-between;width:100%;"]);

class ThreadListHeader extends PureComponent {
  render() {
    const {
      createNewThread,
      customHeaderText,
      showCreateThreadButton,
      textColor
    } = this.props;
    return /*#__PURE__*/_jsxs(HeaderWrapper, {
      children: [/*#__PURE__*/_jsx("h4", {
        "aria-level": "1",
        style: {
          textAlign: 'center',
          color: textColor
        },
        className: "m-bottom-0",
        id: HEADER_TEXT_TITLE_ID,
        children: customHeaderText || /*#__PURE__*/_jsx(FormattedMessage, {
          message: "conversations-visitor-experience-components.visitorWidget.header.threadListTitle"
        })
      }), showCreateThreadButton ? /*#__PURE__*/_jsx(VizExIconButton, {
        onClick: createNewThread,
        "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.createNewThread'),
        "data-test-id": "new-thread-button",
        use: "transparent-on-primary",
        className: "selenium-test-marker-new-thread-button",
        children: /*#__PURE__*/_jsx(VizExIcon, {
          icon: /*#__PURE__*/_jsx(SVGCompose, {})
        })
      }) : null]
    });
  }

}

ThreadListHeader.propTypes = {
  createNewThread: PropTypes.func.isRequired,
  customHeaderText: PropTypes.node,
  showCreateThreadButton: PropTypes.bool.isRequired,
  textColor: PropTypes.string.isRequired
};
ThreadListHeader.defaultProps = {
  mobile: false,
  textColor: OLAF,
  customHeaderText: undefined
};
ThreadListHeader.displayName = 'ThreadListHeader';
export default ThreadListHeader;