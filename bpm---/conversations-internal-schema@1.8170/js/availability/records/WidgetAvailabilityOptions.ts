/* hs-eslint ignored failing-rules */

/* eslint-disable conversations/use-named-records */
import { Record } from 'immutable';
import TypicalResponseTime from '../../typical-response-time/records/TypicalResponseTime';

class WidgetAvailabilityOptions extends Record({
  awayMessage: null,
  typicalResponseTime: null,
  officeHoursStartTime: null
}) {
  constructor(properties = {}) {
    super(Object.assign({}, properties, {
      typicalResponseTime: properties.typicalResponseTime ? TypicalResponseTime(properties.typicalResponseTime) : null
    }));
  }

}

export default WidgetAvailabilityOptions;