'use es6';

import getIn from 'transmute/getIn';
import { ENABLED, TIME_DELAY_SECONDS } from '../constants/timeDelayTriggerKeyPaths';
export const getEnabled = getIn(ENABLED);
export const getTimeDelaySeconds = getIn(TIME_DELAY_SECONDS);