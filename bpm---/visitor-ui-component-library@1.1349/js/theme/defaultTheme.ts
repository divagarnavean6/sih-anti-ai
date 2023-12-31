import { DEFAULT_PRIMARY_COLOR, DEFAULT_TEXT_COLOR, DEFAULT_ERROR_TEXT_COLOR, DISABLED_BACKGROUND_COLOR, DISABLED_TEXT_COLOR, WHITE, DEFAULT_PLACEHOLDER_TEXT_COLOR, DEFAULT_INPUT_BACKGROUND_COLOR, DEFAULT_INPUT_BORDER_COLOR, DEFAULT_HELP_TEXT_COLOR, DEFAULT_SAD_COLOR, DEFAULT_NEUTRAL_COLOR, DEFAULT_HAPPY_COLOR } from './ColorConstants';
export const colors = {
  primary: DEFAULT_PRIMARY_COLOR,
  text: DEFAULT_TEXT_COLOR,
  textOnPrimary: WHITE,
  errorText: DEFAULT_ERROR_TEXT_COLOR,
  disabledBackground: DISABLED_BACKGROUND_COLOR,
  disabledText: DISABLED_TEXT_COLOR,
  placeholderText: DEFAULT_PLACEHOLDER_TEXT_COLOR,
  inputBorder: DEFAULT_INPUT_BORDER_COLOR,
  inputBackground: DEFAULT_INPUT_BACKGROUND_COLOR,
  helpText: DEFAULT_HELP_TEXT_COLOR,
  happyColor: DEFAULT_HAPPY_COLOR,
  neutralColor: DEFAULT_NEUTRAL_COLOR,
  sadColor: DEFAULT_SAD_COLOR
};
export const components = {
  Button: {},
  IconButton: {},
  Link: {},
  List: {},
  ListItemButton: {}
};
export const defaultTheme = Object.assign({}, colors, {
  // will refactor out colors from here to the new colors key in the future
  colors,
  components
});