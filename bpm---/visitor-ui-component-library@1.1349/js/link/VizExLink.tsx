import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import themePropType from '../utils/themePropType';
import { interactionPropTypes } from '../utils/types';
import { ON_BRIGHT, DEFAULT, ERROR } from './constants/LinkVariations';
import { useLink } from '@react-aria/link';
import { useRef } from 'react';
import { mergeProps } from '@react-aria/utils';
import { linkTheme } from './theme/linkTheme';
import mergeThemeStyles from '../theme/mergeThemeStyles';
const StyledATag = styled.a.withConfig({
  displayName: "VizExLink__StyledATag",
  componentId: "sc-461e4o-0"
})(["", ""], ({
  theme
}) => mergeThemeStyles({
  component: 'Link',
  defaultStyles: linkTheme,
  theme
}));

const VizExLink = props => {
  const {
    as,
    onClick,
    onPress
  } = props,
        rest = _objectWithoutPropertiesLoose(props, ["as", "onClick", "onPress"]);

  const ref = useRef(null);
  const {
    linkProps
  } = useLink({
    elementType: as,
    onPress: onPress || onClick
  }, ref);
  return /*#__PURE__*/_jsx(StyledATag, Object.assign({
    as: as,
    ref: ref
  }, mergeProps(linkProps, rest)));
};

VizExLink.displayName = 'VizExLink';
VizExLink.propTypes = Object.assign({
  as: PropTypes.oneOf(['a', 'span']),
  children: PropTypes.node,
  external: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
  onPress: PropTypes.func,
  theme: themePropType,
  use: PropTypes.oneOf([ON_BRIGHT, DEFAULT, ERROR])
}, interactionPropTypes);
VizExLink.defaultProps = {
  use: DEFAULT,
  tabIndex: 0
};
export default VizExLink;