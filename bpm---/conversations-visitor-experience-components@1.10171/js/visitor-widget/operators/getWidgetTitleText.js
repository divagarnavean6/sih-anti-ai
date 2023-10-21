'use es6';

import { getAnyCustomChatName } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCustomChatName';
import { getRespondersNameText } from './getRespondersNameText';
export const getWidgetTitleText = (chatHeadingConfig, responders, locale) => {
  const responderNames = getRespondersNameText(responders, locale);
  return responderNames || getAnyCustomChatName(chatHeadingConfig);
};