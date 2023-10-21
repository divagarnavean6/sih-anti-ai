import { getBrowserPrefix } from './getBrowserPrefix';
import { getHiddenNamespace } from './getHiddenNamespace';
export function isHidden() {
  const prefix = getBrowserPrefix();

  if (prefix) {
    const hidden = getHiddenNamespace(prefix);
    return document[hidden];
  }

  if (typeof document.hasFocus === 'function') {
    return !document.hasFocus();
  }

  return false;
}