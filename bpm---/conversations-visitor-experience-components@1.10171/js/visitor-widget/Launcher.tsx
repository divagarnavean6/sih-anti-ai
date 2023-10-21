import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import I18n from 'I18n'; // @ts-expect-error Not typed

import { getBrandStyle } from '../visitor-widget/util/color'; // @ts-expect-error Not typed

import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import IconLauncher from './IconLauncher';
import classNames from 'classnames';

const Launcher = ({
  badgeNumber,
  coloring: {
    accentColor,
    useDefaultColor
  },
  className,
  onClose,
  onOpen,
  open,
  showBadge
}) => {
  const handleLaunch = useCallback(() => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  }, [open, onClose, onOpen]);
  const commonProps = {
    className: classNames('reagan--widget-loaded', className),
    badgeNumber,
    showBadge,
    ariaLabel: open ? I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.close') : I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.open'),
    onClick: handleLaunch
  };
  return /*#__PURE__*/_jsx(IconLauncher, Object.assign({
    style: getBrandStyle(accentColor),
    useDefaultColor: useDefaultColor,
    open: open
  }, commonProps));
};

Launcher.defaultProps = {
  onOpen: emptyFunction,
  onClose: emptyFunction,
  open: false
};
Launcher.propTypes = {
  badgeNumber: PropTypes.number,
  className: PropTypes.string,
  coloring: RecordPropType('ColoringRecord').isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  showBadge: PropTypes.bool
};
Launcher.displayName = 'Launcher';
export default Launcher;