import getIn from 'transmute/getIn';
import { COMPANY_LOGO, FALLBACK, CUSTOM_CHAT_NAME, TEAM_IDS, TYPE, USER_IDS, USE_CUSTOM_BRANDING_ALIAS } from './../constants/keyPaths';
export const getCustomChatName = getIn(CUSTOM_CHAT_NAME);
export const getFallback = getIn(FALLBACK);
export const getTeamIds = getIn(TEAM_IDS);
export const getType = getIn(TYPE);
export const getUserIds = getIn(USER_IDS);
export const getCompanyLogo = getIn(COMPANY_LOGO);
export const getUseCustomBrandingAsAgentAlias = getIn(USE_CUSTOM_BRANDING_ALIAS);