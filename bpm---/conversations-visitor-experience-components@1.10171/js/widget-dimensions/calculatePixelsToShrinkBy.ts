import { calculateMaxWidgetHeight } from './calculateMaxWidgetHeight';
import { calculateMinWidgetHeight } from './calculateMinWidgetHeight';
export function calculatePixelsToShrinkBy(windowHeight, {
  showCloseButton
}) {
  const maxWidgetHeight = calculateMaxWidgetHeight({
    showCloseButton
  });
  const minWidgetHeight = calculateMinWidgetHeight({
    showCloseButton
  });

  if (windowHeight >= maxWidgetHeight) {
    return 0;
  }

  if (windowHeight <= minWidgetHeight) {
    return maxWidgetHeight - minWidgetHeight;
  }

  return maxWidgetHeight - windowHeight;
}