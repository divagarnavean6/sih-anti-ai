import { SMALLEST_WIDGET_HEIGHT, SPACING_ABOVE_WIDGET, CLOSE_BUTTON_AND_SPACING } from './constants/dimensions';
export function calculateMinWidgetHeight({
  showCloseButton
}) {
  let minHeight = SMALLEST_WIDGET_HEIGHT + SPACING_ABOVE_WIDGET;

  if (showCloseButton) {
    minHeight += CLOSE_BUTTON_AND_SPACING;
  }

  return minHeight;
}