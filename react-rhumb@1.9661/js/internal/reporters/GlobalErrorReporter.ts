import BaseReporter from './BaseReporter';
import { INTERNAL_ERROR_MARKERS } from '../Constants';
const [__, RHUMB_GLOBAL_ERROR_BOUNDARY] = INTERNAL_ERROR_MARKERS;
export default class GlobalErrorReporter extends BaseReporter {
  constructor() {
    super();
    this.stopped = false;
  }

  report(action) {
    if (this.stopped) {
      return;
    }

    if (action.type === 'GLOBAL_ERROR') {
      const {
        entry,
        extra
      } = action.payload;
      const {
        error
      } = extra;
      const {
        pathname
      } = entry;
      this.captureError(error, {
        data: {
          pathname
        },
        tags: {
          [RHUMB_GLOBAL_ERROR_BOUNDARY]: 'true'
        }
      });
      this.stopped = true;
    }
  }

}