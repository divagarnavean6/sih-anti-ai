'use es6';

import getIn from 'transmute/getIn';
import { ENABLED, SCROLL_PERCENTAGE } from '../constants/scrollPercentageTriggerKeyPaths';
export const getEnabled = getIn(ENABLED);
export const getScrollPercentage = getIn(SCROLL_PERCENTAGE);