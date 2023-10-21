import * as browserHelper from './browserHelper';
import * as helpers from '../common/helpers';
import * as errors from '../common/errors';

const reportWarning = (warning, options = {}) => typeof helpers.lWindow === 'object' && browserHelper.hasRaven(helpers.lWindow) && helpers.lWindow.Raven.captureException(warning, errors.mergeErrorCauseWithSentry(warning, Object.assign({}, options, {
  level: 'warning'
})));

export default reportWarning;