import * as browserHelper from '../client/browserHelper';
import * as cookieHelper from '../client/cookieHelper';
import { lWindow } from '../common/helpers'; // @TODO: This should be moved to the `client` folder as it is a Browser API

const getItem = (key = '') => {
  let value = '';

  if (browserHelper.hasLocalStorage) {
    try {
      value = lWindow.localStorage.getItem(key) || '';
    } catch (err) {
      value = cookieHelper.get(key);
    }
  }

  return value;
}; // @TODO: This should be moved to the `client` folder as it is a Browser API


const setItem = (key = '', value = '') => {
  if (browserHelper.hasLocalStorage) {
    try {
      lWindow.localStorage.setItem(key, value || '');
    } catch (err) {
      cookieHelper.set(key, value);
    }
  }

  return value;
}; // @TODO: This should be moved to the `client` folder as it is a Browser API


export default {
  getItem,
  setItem
};