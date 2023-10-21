'use es6';

import { getFriendlyOrFormalName, getEmail } from 'conversations-internal-schema/responders/operators/responderGetters';
export const getRespondersNameText = (responders, locale) => responders.map(responder => getFriendlyOrFormalName(responder, locale) || getEmail(responder)).join(', ');