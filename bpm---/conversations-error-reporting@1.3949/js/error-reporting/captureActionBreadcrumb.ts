import Raven from 'raven-js';
/**
 * @description Capture action breadcrumbs in sentry
 * @param {Object} action Action to add as a breadcrumb
 */

export const captureActionBreadcrumb = action => {
  Raven.captureBreadcrumb({
    message: action.type,
    category: 'redux action'
  });
};