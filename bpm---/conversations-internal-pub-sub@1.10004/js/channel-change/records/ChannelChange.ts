import { Record, Map as ImmutableMap } from 'immutable';
export const CHANNEL_CHANGE = 'CHANNEL_CHANGE'; // eslint-disable-next-line conversations/use-named-records

const ChannelChangeRecord = Record({
  '@type': CHANNEL_CHANGE,
  oldChannel: ImmutableMap(),
  newChannel: ImmutableMap(),
  id: null,
  timestamp: null
}, 'ChannelChange');
export class ChannelChange extends ChannelChangeRecord {
  constructor(props) {
    super(Object.assign({}, props, {
      oldChannel: ImmutableMap(props.oldChannel),
      newChannel: ImmutableMap(props.newChannel),
      '@type': CHANNEL_CHANGE
    }));
  }

}