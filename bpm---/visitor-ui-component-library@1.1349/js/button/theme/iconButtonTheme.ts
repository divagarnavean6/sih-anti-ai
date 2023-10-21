import { css } from 'styled-components';
import { focusRing } from '../../utils/mixins';
import { CIRCLE } from '../constants/IconButtonShapes';
import { BUTTON_SIZES } from '../constants/ButtonSizes';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { hexToRgba } from '../../utils/hexToRgba';
import { TRANSPARENT_ON_PRIMARY, TRANSPARENT_ON_BACKGROUND } from '../constants/IconButtonUses';
export const iconButtonTheme = {
  baseStyle: css(["flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:", ";width:", "px;height:", "px;vertical-align:middle;padding:0;text-align:center;text-overflow:clip;font-size:18px;line-height:18px;outline:none;transition:background-color 150ms ease-out;border:none;", " ", " > *{user-select:none;}"], ({
    shape
  }) => shape === CIRCLE ? '50%' : '3px', ({
    size
  }) => size && BUTTON_SIZES[size] || 40, ({
    size
  }) => size && BUTTON_SIZES[size] || 40, ({
    use,
    theme
  }) => use === TRANSPARENT_ON_BACKGROUND || use === TRANSPARENT_ON_PRIMARY ? `background-color: transparent;` : `background-color: ${theme.primary};`, ({
    use,
    theme
  }) => use === TRANSPARENT_ON_BACKGROUND ? `color: ${theme.transparentOnBackgroundIconButton || theme.primary};` : `color: ${theme.textOnPrimary};`),
  _disabled: css(["", " color:", ";cursor:not-allowed;"], ({
    theme,
    use
  }) => `
    background-color: ${use === TRANSPARENT_ON_BACKGROUND || use === TRANSPARENT_ON_PRIMARY ? 'transparent' : theme.disabledBackground};
  `, ({
    theme
  }) => theme.disabledText),
  _focused: focusRing,
  _hovered: css(["", ""], ({
    theme,
    use
  }) => {
    if (use === TRANSPARENT_ON_BACKGROUND) {
      return `background-color: ${hexToRgba(theme.transparentOnBackgroundIconButton || theme.primary, 0.1)};`;
    }

    if (use === TRANSPARENT_ON_PRIMARY) {
      return `background-color: ${hexToRgba(theme.textOnPrimary, 0.1)};`;
    }

    return `background-color: ${adjustLuminance(theme.primary, 20)};`;
  }),
  _pressed: css(["", ""], ({
    theme,
    use
  }) => {
    if (use === TRANSPARENT_ON_BACKGROUND) {
      return `background-color: ${hexToRgba(theme.transparentOnBackgroundIconButton || theme.primary, 0.4)};`;
    }

    if (use === TRANSPARENT_ON_PRIMARY) {
      return `background-color: ${hexToRgba(theme.textOnPrimary, 0.4)};`;
    }

    return `background-color: ${adjustLuminance(theme.primary, -10)};`;
  })
};