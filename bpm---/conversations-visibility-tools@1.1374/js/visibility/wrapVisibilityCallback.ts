import { isHidden } from './isHidden';
export function wrapVisibilityCallback(callback) {
  return ({
    hidden = isHidden()
  }) => {
    callback({
      isVisible: !hidden
    });
  };
}