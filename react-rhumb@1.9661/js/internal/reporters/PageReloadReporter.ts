import BaseReporter from './BaseReporter';
import { PageLoadMetrics } from '../Metrics';
import { isReload } from '../navigation';
export default class PageReloadReporter extends BaseReporter {
  report(action) {
    switch (action.type) {
      case 'ROUTE_STARTED':
        {
          if (isReload()) {
            PageLoadMetrics.counter('reloaded').increment();
          }

          break;
        }

      default:
    }
  }

}