import * as browserHelper from './browserHelper';
import { lWindow } from '../common/helpers'; // this is a clone from the method of `hub-http/helpers/cookie`

const getCookie = (name, cookies) => {
  const value = `; ${cookies}`;
  const splitCookies = value.split(';');

  if (splitCookies.length) {
    for (let i = 0; i < splitCookies.length; i++) {
      const parts = splitCookies[i].split('=');

      if (parts.length === 2 && parts[0].trim() === name) {
        return parts[1];
      }
    }
  }

  return null;
}; // This represents two months in miliseconds


const defaultCookieExpiration = 60 * 24 * 60 * 60 * 1000;
export const get = key => {
  return browserHelper.hasCookieAccess ? getCookie(key, lWindow.document.cookie) : null;
};
export const set = (key, value, expiresInMillis = defaultCookieExpiration) => {
  if (browserHelper.hasCookieAccess) {
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.setTime(currentTime.getTime() + expiresInMillis)).toUTCString();
    lWindow.document.cookie = `${key}=${value};expires=${expiryTime};path=/`;
  }
};