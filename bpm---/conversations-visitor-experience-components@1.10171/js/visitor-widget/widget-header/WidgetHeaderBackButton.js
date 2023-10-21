'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import I18n from 'I18n';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGLeft from 'visitor-ui-component-library-icons/icons/SVGLeft';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';

class WidgetHeaderBackButton extends Component {
  render() {
    const {
      navigateToThreadList,
      unseenThreadsCountExcludingCurrentThread,
      disabled
    } = this.props;
    const hasNotification = Boolean(unseenThreadsCountExcludingCurrentThread);
    return /*#__PURE__*/_jsx(VizExNotificationBadge, {
      className: "m-right-1",
      badgeLabel: unseenThreadsCountExcludingCurrentThread,
      showBadge: hasNotification,
      badgeDescription: I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.badgeDescription'),
      children: /*#__PURE__*/_jsx(VizExIconButton, {
        use: "transparent-on-primary",
        onClick: navigateToThreadList,
        className: "selenium-test-marker-show-threads-button",
        "data-test-id": "show-threads-button",
        "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.showThreadList', {
          unreadThreadCount: unseenThreadsCountExcludingCurrentThread
        }),
        disabled: disabled,
        children: /*#__PURE__*/_jsx(VizExIcon, {
          icon: /*#__PURE__*/_jsx(SVGLeft, {}),
          size: "md"
        })
      })
    });
  }

}

WidgetHeaderBackButton.propTypes = {
  disabled: PropTypes.bool,
  navigateToThreadList: PropTypes.func.isRequired,
  unseenThreadsCountExcludingCurrentThread: PropTypes.number.isRequired
};
WidgetHeaderBackButton.displayName = 'WidgetHeaderBackButton';
export default WidgetHeaderBackButton;