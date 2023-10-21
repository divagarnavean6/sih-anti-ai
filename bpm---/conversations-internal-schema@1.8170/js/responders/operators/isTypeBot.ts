import { BOT } from '../constants/agentTypes';
import { getAgentType } from './responderGetters';
export const isTypeBot = responder => getAgentType(responder) === BOT;