import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ICON_SIZES } from './constants/IconSizes';
import themePropType from '../utils/themePropType';
import { getIconColor } from './theme/iconThemeOperators';

function isIconSize(size) {
  return Object.keys(ICON_SIZES).includes(size);
}

const getIconSizeStyles = size => css(["font-size:", ";height:", ";width:", ";"], size && isIconSize(size) ? `${ICON_SIZES[size]}px` : size, size && isIconSize(size) ? `${ICON_SIZES[size]}px` : size, size && isIconSize(size) ? `${ICON_SIZES[size]}px` : size);

const IconWrapper = styled.div.withConfig({
  displayName: "VizExIcon__IconWrapper",
  componentId: "gyqtpm-0"
})(["display:inline-flex;vertical-align:middle;fill:", ";", ""], ({
  theme
}) => getIconColor(theme) || 'currentColor', ({
  size
}) => size && getIconSizeStyles(size));

const VizExIcon = props => {
  const {
    icon,
    size
  } = props,
        rest = _objectWithoutPropertiesLoose(props, ["icon", "size"]);

  return /*#__PURE__*/_jsx(IconWrapper, Object.assign({}, rest, {
    size: size,
    children: icon
  }));
};

VizExIcon.displayName = 'VizExIcon';
VizExIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([PropTypes.oneOf(Object.keys(ICON_SIZES)), PropTypes.string]),
  theme: themePropType
};
export default VizExIcon;