import { hstcKey, utkKey } from '../storageKeys';
import * as cookieHelper from '../client/cookieHelper';
export function getHstc() {
  return cookieHelper.get(hstcKey) || null;
}
export function getUtk() {
  const hstc = getHstc();
  const utk = cookieHelper.get(utkKey);
  return utk || hstc && hstc.split('.')[1] || null;
}