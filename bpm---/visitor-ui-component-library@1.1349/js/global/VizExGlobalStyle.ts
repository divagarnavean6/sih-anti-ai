let _ = t => t,
    _t;

import { createGlobalStyle } from 'styled-components';
import { getGlobalTypographyStyles } from './utils/getGlobalTypographyStyles';
import { focusRing } from '../utils/mixins';
const VizExGlobalStyle = createGlobalStyle(_t || (_t = _`
  *, ::after, ::before {
    box-sizing: border-box;
  }
  ${0}
  &:focus-visible {
    ${0}
    outline-offset: -2px;
  }
`), getGlobalTypographyStyles, focusRing);
export default VizExGlobalStyle;