import { createMetricsFactory } from 'metrics-js';
export const PageLoadMetrics = createMetricsFactory('page-load', {
  library: 'react-rhumb'
});
export const ReduxStoreSizeMetrics = createMetricsFactory('redux-store-metrics', {
  library: 'react-rhumb'
});
export const MemoryMetrics = createMetricsFactory('application-memory', {
  library: 'react-rhumb'
});
export const GlobalErrorMetrics = createMetricsFactory('global-error', {
  library: 'react-rhumb'
});