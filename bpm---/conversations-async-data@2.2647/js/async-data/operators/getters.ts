import get from 'transmute/get';
export const getData = asyncData => get('data', asyncData);
export const getError = asyncData => get('error', asyncData);
export const getStatus = asyncData => get('status', asyncData);
export const getUpdatedAt = asyncData => get('updatedAt', asyncData);