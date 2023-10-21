import { BASE_WIDGET_HEIGHT } from './constants/dimensions';
import { calculatePixelsToShrinkBy } from './calculatePixelsToShrinkBy';
export function calculateChatWidgetHeight(windowHeight, {
  showCloseButton
}) {
  return BASE_WIDGET_HEIGHT - calculatePixelsToShrinkBy(windowHeight, {
    showCloseButton
  });
}