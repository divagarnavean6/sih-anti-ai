import performance from '../vendor/performance';
export const navigationType = () => {
  try {
    const navigationEntries = performance.getEntriesByType('navigation');
    return navigationEntries && navigationEntries[0] && // @ts-expect-error PerformanceEntry.type
    navigationEntries[0].type;
  } catch (_unused) {
    return null;
  }
};
export const isReload = () => navigationType() === 'reload';