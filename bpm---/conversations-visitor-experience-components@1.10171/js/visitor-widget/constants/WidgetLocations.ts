import PropTypes from 'prop-types';
import { LEFT_ALIGNED, RIGHT_ALIGNED } from 'conversations-internal-schema/widget-location/constants/WidgetLocations';
export const WidgetLocationProp = PropTypes.oneOf([LEFT_ALIGNED, RIGHT_ALIGNED]);
export { LEFT_ALIGNED, RIGHT_ALIGNED };