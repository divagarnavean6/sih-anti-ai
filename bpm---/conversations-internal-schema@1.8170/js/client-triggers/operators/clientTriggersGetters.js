'use es6';

import getIn from 'transmute/getIn';
import { DISPLAY_ON_SCROLL_PERCENTAGE, DISPLAY_ON_TIME_DELAY, DISPLAY_ON_EXIT_INTENT } from '../constants/clientTriggersKeyPaths';
export const getDisplayOnScrollPercentage = getIn(DISPLAY_ON_SCROLL_PERCENTAGE);
export const getDisplayOnTimeDelay = getIn(DISPLAY_ON_TIME_DELAY);
export const getDisplayOnExitIntent = getIn(DISPLAY_ON_EXIT_INTENT);