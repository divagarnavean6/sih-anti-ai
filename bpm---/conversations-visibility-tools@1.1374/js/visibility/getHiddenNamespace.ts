export function getHiddenNamespace(prefix) {
  const withPrefix = prefix ? `${prefix}Hidden` : 'hidden';
  return withPrefix;
}