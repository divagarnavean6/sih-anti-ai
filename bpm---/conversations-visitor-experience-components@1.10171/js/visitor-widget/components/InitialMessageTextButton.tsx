import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useButton } from '@react-aria/button';
import I18n from 'I18n';

const InitialMessageTextButton = ({
  children,
  onPress
}) => {
  const ref = useRef();
  const {
    buttonProps
  } = useButton({
    onPress,
    elementType: 'div'
  }, ref);
  return /*#__PURE__*/_jsx("div", Object.assign({}, buttonProps, {
    className: "initial-message-bubble",
    "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.open'),
    "aria-describedby": "welcome-message",
    "aria-haspopup": "dialog",
    children: children
  }));
};

InitialMessageTextButton.displayName = 'InitialMessageTextButton';
InitialMessageTextButton.propTypes = {
  children: PropTypes.node
};
export default InitialMessageTextButton;