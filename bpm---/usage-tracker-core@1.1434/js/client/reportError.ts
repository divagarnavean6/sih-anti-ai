import * as browserHelper from './browserHelper';
import * as helpers from '../common/helpers';
import * as errors from '../common/errors';

const reportError = (error, options = {}) => typeof helpers.lWindow === 'object' && browserHelper.hasRaven(helpers.lWindow) && helpers.lWindow.Raven.captureException(error, errors.mergeErrorCauseWithSentry(error, Object.assign({}, options, {
  level: 'error'
})));

export default reportError;