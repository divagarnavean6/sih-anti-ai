import get from 'transmute/get';
import getIn from 'transmute/getIn';
export const getId = get('id');
export const getTimestamp = get('timestamp');
export const getType = get('@type');
export const getNewChannelName = getIn(['newChannel', 'name']);
export const getNewChannelDescriptor = get('newChannel');
export const getOldChannelName = getIn(['oldChannel', 'name']);
export const getOldChannelDescriptor = get('oldChannel');