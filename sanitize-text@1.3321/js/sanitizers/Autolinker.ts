// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'auto... Remove this comment to see the full error message
import Autolinker from 'autolinker';

const once = function once(func) {
  let alreadyCalled = false;
  let result;
  return function (...args) {
    if (!alreadyCalled) {
      result = func.apply(this, args);
      alreadyCalled = true;
    }

    return result;
  };
};

export default {
  get: once(() => {
    return new Autolinker({
      stripPrefix: false
    });
  }),
  getTwitter: once(() => {
    return new Autolinker({
      hashtag: 'twitter',
      mention: 'twitter',
      stripPrefix: false
    });
  })
};