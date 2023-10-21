'use es6';

import getIn from 'transmute/getIn';
import { COMPANY_LOGO } from './../constants/keyPaths';
import { getFallback, getCompanyLogo } from './chatHeadingConfigGetters';
export const getAnyCompanyLogo = chatHeadingConfig => getIn(COMPANY_LOGO, chatHeadingConfig) || getCompanyLogo(getFallback(chatHeadingConfig));