import { isAgentState } from './isAgentState';
import { AVAILABLE } from '../constants/AgentStates';
export const isAvailable = isAgentState(AVAILABLE);