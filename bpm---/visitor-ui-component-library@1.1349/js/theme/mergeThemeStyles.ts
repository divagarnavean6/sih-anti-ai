import { css } from 'styled-components';
export const wrapWithSelector = (selector, style) => css(["", "{", "}"], selector, style);
export function getComponentStyles({
  baseStyle,
  _disabled,
  _focused,
  _hovered,
  _pressed
}) {
  return css(["", " ", " ", " ", " ", " ", " ", " ", " ", ""], baseStyle, ({
    disabled
  }) => disabled ? _disabled : '', ({
    focused
  }) => focused ? _focused : '', ({
    hovered
  }) => hovered ? _hovered : '', ({
    pressed
  }) => pressed ? _pressed : '', _disabled && wrapWithSelector('&:disabled', _disabled), _focused && wrapWithSelector('&:focus-visible', _focused), _hovered && wrapWithSelector(_disabled ? '&:hover:enabled' : '&:hover', _hovered), _pressed && wrapWithSelector(_disabled ? '&:active:enabled' : '&:active', _pressed));
}

function mergeThemeStyles({
  component,
  defaultStyles,
  theme
}) {
  const themeStyles = theme && theme.components && theme.components[component] || {};
  return getComponentStyles(Object.assign({}, defaultStyles, {}, themeStyles));
}

export default mergeThemeStyles;