'use es6';

import { getUserId } from './responderGetters';
export function findResponderByIdFromList({
  responders,
  responderId
}) {
  return responders.find(responder => getUserId(responder) === String(responderId));
}