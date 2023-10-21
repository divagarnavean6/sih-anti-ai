import { getBrowserPrefix } from './getBrowserPrefix';
import { getVisibilityChangeNamespace } from './getVisibilityChangeNamespace';
import { wrapVisibilityCallback } from './wrapVisibilityCallback';
export function addVisibilityChangeListener(callback) {
  const prefix = getBrowserPrefix();

  if (prefix) {
    const visibilityChange = getVisibilityChangeNamespace(prefix);
    document.addEventListener(visibilityChange, wrapVisibilityCallback(callback));
  } else {
    window.addEventListener('focus', wrapVisibilityCallback(callback));
    window.addEventListener('blur', wrapVisibilityCallback(callback));
  }
}