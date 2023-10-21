'use es6';

import { Record } from 'immutable';
const TimeDelayTrigger = new Record({
  enabled: false,
  timeDelaySeconds: 0
}, 'TimeDelayTrigger');
export default TimeDelayTrigger;