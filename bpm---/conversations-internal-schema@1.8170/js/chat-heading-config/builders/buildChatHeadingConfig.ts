import { getType } from '../operators/chatHeadingConfigGetters';
import { buildChatHeadingConfigFromType } from './buildChatHeadingConfigFromType';
export const buildChatHeadingConfig = options => {
  const chatConfigType = getType(options);
  return buildChatHeadingConfigFromType(chatConfigType, options);
};