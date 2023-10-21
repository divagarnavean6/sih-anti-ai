'use es6';

import { List } from 'immutable';
const MAX_POTENTIAL_RESPONDERS = 3;
export const buildPotentialResponders = (sendFrom, responders) => {
  const hasAgentResponders = responders && responders.size > 0;
  const hasSendFromResponders = sendFrom && sendFrom.size > 0;

  if (!hasSendFromResponders && !hasAgentResponders) {
    return List();
  }

  if (hasSendFromResponders) {
    return sendFrom.take(MAX_POTENTIAL_RESPONDERS);
  }

  return responders.take(MAX_POTENTIAL_RESPONDERS);
};