import { Record as ImmutableRecord, fromJS } from 'immutable';
import get from 'transmute/get';
import { OWNER } from '../constants/ChatHeadingConfigTypes';
import { buildChatHeadingConfig } from '../builders/buildChatHeadingConfig';

class OwnerChatHeadingConfig extends ImmutableRecord({
  '@type': OWNER,
  fallback: null
}, 'OwnerChatHeadingConfig') {
  constructor(options) {
    const optionMap = fromJS(options);
    const fallback = get('fallback', optionMap);
    super({
      fallback: buildChatHeadingConfig(fallback)
    });
  }

}

export default OwnerChatHeadingConfig;