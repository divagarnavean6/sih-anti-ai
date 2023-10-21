export function getBrowserPrefix(global = window) {
  const doc = global.document;
  const browserPrefixes = ['', 'webkit', 'moz', 'ms', 'o'];

  for (let i = 0; i < browserPrefixes.length; i++) {
    const prefix = browserPrefixes[i];
    const withPrefix = prefix ? `${prefix}Hidden` : 'hidden';

    if (typeof doc[withPrefix] !== 'undefined') {
      return prefix;
    }
  }

  return null;
}