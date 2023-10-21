import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { MEDIUM, LARGE, EXTRA_LARGE, EXTRA_EXTRA_SMALL, EXTRA_SMALL, SMALL } from '../constants/sizes';
import { AVATAR_SIZES } from './constants/AvatarSizes';

const getSizeStyles = ({
  size
}) => {
  const sizePx = AVATAR_SIZES[size];
  return css(["height:", "px;width:", "px;"], sizePx, sizePx);
};

const VizExAvatarWrapper = styled.div.withConfig({
  displayName: "VizExAvatar__VizExAvatarWrapper",
  componentId: "x5hgqn-0"
})(["display:inline-flex;align-items:center;justify-content:center;box-sizing:content-box;font-size:initial;overflow:hidden;position:relative;border-radius:50%;", ";"], getSizeStyles);
const VizExAvatarContent = styled.div.withConfig({
  displayName: "VizExAvatar__VizExAvatarContent",
  componentId: "x5hgqn-1"
})(["background-image:url(", ");background-position:center center;background-size:cover;height:100%;width:100%;"], ({
  src
}) => `"${src}"`);
const VizExAvatarImg = styled.img.withConfig({
  displayName: "VizExAvatar__VizExAvatarImg",
  componentId: "x5hgqn-2"
})(["border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;"]);

const VizExAvatar = (_ref) => {
  let {
    size,
    src = MEDIUM,
    contentStyle,
    alt = ''
  } = _ref,
      rest = _objectWithoutPropertiesLoose(_ref, ["size", "src", "contentStyle", "alt"]);

  return /*#__PURE__*/_jsxs(VizExAvatarWrapper, Object.assign({}, rest, {
    size: size,
    children: [/*#__PURE__*/_jsx(VizExAvatarContent, {
      src: src,
      style: contentStyle
    }), /*#__PURE__*/_jsx(VizExAvatarImg, {
      src: src,
      alt: alt
    })]
  }));
};

VizExAvatar.displayName = 'VizExAvatar';
VizExAvatar.propTypes = {
  alt: PropTypes.string.isRequired,
  contentStyle: PropTypes.object,
  size: PropTypes.oneOf([EXTRA_EXTRA_SMALL, EXTRA_SMALL, SMALL, MEDIUM, LARGE, EXTRA_LARGE]),
  src: PropTypes.string.isRequired
};
export default VizExAvatar;