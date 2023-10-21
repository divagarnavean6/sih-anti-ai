import pipe from 'transmute/pipe';
import get from 'transmute/get';
import formatName from 'I18n/utils/formatName';
import getLang from 'I18n/utils/getLang';
import { AVATAR, FIRST_NAME, LAST_NAME, IS_BOT, USER_ID, IS_ONLINE, EMAIL, AGENT_STATE, AGENT_TYPE, MEETINGS_LINKS_TEXT, MEETINGS_LINKS_URL } from '../constants/keyPaths';
import { AGENT } from '../constants/agentTypes';
const formalNameLanguages = ['de', 'ja'];
export const getAvatar = get(AVATAR);
export const getFirstName = get(FIRST_NAME);
export const getLastName = get(LAST_NAME);
export const getEmail = get(EMAIL);
export const getFullName = responder => {
  return formatName({
    firstName: getFirstName(responder),
    lastName: getLastName(responder)
  });
};
export const getFriendlyOrFormalName = (responder, locale) => {
  const lang = locale || getLang();
  return formalNameLanguages.indexOf(lang) >= 0 ? getFullName(responder) : getFirstName(responder);
};
export const getIsBot = get(IS_BOT);
export const getIsOnline = get(IS_ONLINE);
export const getUserId = responder => pipe(get(USER_ID), userId => userId && `${userId}`)(responder);
export const getAgentState = get(AGENT_STATE);
export const getAgentType = get(AGENT_TYPE);
export const getMeetingsLinkText = get(MEETINGS_LINKS_TEXT);
export const getMeetingsLinkUrl = get(MEETINGS_LINKS_URL);
export const getAgentRespondersList = get(AGENT);