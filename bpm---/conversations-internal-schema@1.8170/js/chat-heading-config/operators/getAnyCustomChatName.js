'use es6';

import getIn from 'transmute/getIn';
import { CUSTOM_CHAT_NAME } from './../constants/keyPaths';
import { getCustomChatName, getFallback } from './chatHeadingConfigGetters';
export const getAnyCustomChatName = chatHeadingConfig => getIn(CUSTOM_CHAT_NAME, chatHeadingConfig) || getCustomChatName(getFallback(chatHeadingConfig));