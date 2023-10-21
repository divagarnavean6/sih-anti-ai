import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import themePropType from '../utils/themePropType';
import { interactionPropTypes } from '../utils/types';
import * as IconButtonUses from './constants/IconButtonUses';
import { CIRCLE, DEFAULT } from './constants/IconButtonShapes';
import { MEDIUM, EXTRA_SMALL, SMALL } from '../constants/sizes';
import { forwardRef } from 'react';
import { iconButtonTheme } from './theme/iconButtonTheme';
import mergeThemeStyles from '../theme/mergeThemeStyles';
const defaultProps = {
  shape: DEFAULT,
  size: MEDIUM,
  use: IconButtonUses.PRIMARY
};
const AbstractVizExIconButton = styled.button.withConfig({
  displayName: "VizExIconButton__AbstractVizExIconButton",
  componentId: "sc-10d84js-0"
})(["", ""], ({
  theme
}) => mergeThemeStyles({
  component: 'IconButton',
  defaultStyles: iconButtonTheme,
  theme
}));
const VizExIconButton = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(AbstractVizExIconButton, Object.assign({}, props, {
    ref: ref
  }));
});
VizExIconButton.displayName = 'VizExIconButton';
VizExIconButton.propTypes = Object.assign({
  children: PropTypes.node,
  onClick: PropTypes.func,
  shape: PropTypes.oneOf([CIRCLE, DEFAULT]),
  size: PropTypes.oneOf([EXTRA_SMALL, SMALL, MEDIUM]),
  theme: themePropType,
  use: PropTypes.oneOf(Object.values(IconButtonUses))
}, interactionPropTypes);
VizExIconButton.defaultProps = defaultProps;
export default VizExIconButton;