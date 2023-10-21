'use es6';

import { buildChatHeadingConfig } from './buildChatHeadingConfig';
import { buildDefaultChatHeadingConfig } from './buildDefaultChatHeadingConfig';
export const buildChatHeadingConfigFromJS = payload => {
  if (!payload) {
    return buildDefaultChatHeadingConfig();
  }

  return buildChatHeadingConfig(payload);
};