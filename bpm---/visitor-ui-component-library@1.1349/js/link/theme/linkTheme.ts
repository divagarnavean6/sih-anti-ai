import { css } from 'styled-components';
import { focusRing } from '../../utils/mixins';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { ON_BRIGHT, ERROR } from '../constants/LinkVariations';

const getLinkColor = ({
  use,
  theme
}) => {
  if (use === ON_BRIGHT) return theme.text;
  if (use === ERROR) return theme.errorText;
  return theme.linkText || theme.primary;
};

export const linkTheme = {
  baseStyle: css(["cursor:pointer;text-decoration:none;transition:all 0.15s ease-out;font-weight:400;color:", ";", " ", ""], getLinkColor, ({
    use
  }) => use === ON_BRIGHT && `text-decoration: underline;`, ({
    use
  }) => use === ERROR && `font-weight: bold;`),
  _hovered: css(["color:", ";text-decoration:underline;"], ({
    use,
    theme
  }) => adjustLuminance(getLinkColor({
    use,
    theme
  }), -30)),
  _focused: focusRing,
  _pressed: css(["color:", ";"], ({
    use,
    theme
  }) => adjustLuminance(getLinkColor({
    use,
    theme
  }), 30))
};