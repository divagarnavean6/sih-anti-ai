import { curryable } from './curryable';
export const get = curryable((key, data) => data[key]);