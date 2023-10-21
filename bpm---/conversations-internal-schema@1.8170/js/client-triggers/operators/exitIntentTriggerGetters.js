'use es6';

import getIn from 'transmute/getIn';
import { ENABLED } from '../constants/exitIntentTriggerKeyPaths';
export const getEnabled = getIn(ENABLED);