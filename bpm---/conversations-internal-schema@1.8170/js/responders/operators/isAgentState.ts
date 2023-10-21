import curry from 'transmute/curry';
import { getAgentState } from './responderGetters';
export const isAgentState = curry((agentState, agentRecord) => {
  return getAgentState(agentRecord) === agentState;
});