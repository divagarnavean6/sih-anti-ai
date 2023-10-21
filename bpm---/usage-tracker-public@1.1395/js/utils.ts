import { genericClient } from 'usage-tracker-core/client';
import { once } from 'usage-tracker-core/common/helpers'; // This method attempts to retrieve the HSTC cookie from the Browser's cookie store.
// It will first attempt to retrieve the cookie during first call, and then it will
// keep retrying every 100ms until it finds the cookie or until 2 seconds have passed.
// Meaning that it will attempt to retrieve the HSTC cookie for 20 times before exhausting.
// Note that this method will only execute once, otherwise it would delay the dispatch of Events
// every time that the `.track` method is being called

export const attemptToGetTrackerHstc = once(() => {
  return new Promise(resolve => {
    let interval = 0;
    let timeout = 0;

    const retrieveCookie = () => {
      const hstc = genericClient.getHstc();

      if (hstc) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve(hstc);
      }
    }; // We set an interval for every 100ms to retrieve the cookie


    interval = setInterval(retrieveCookie, 100); // If after 20 attempts (2 seconds) we haven't retrieved the cookie, we resolve with `null`

    timeout = setTimeout(() => {
      clearInterval(interval);
      resolve(null);
    }, 2000); // We attempt to retrieve the cookie immediately (as it might already be resolved)

    retrieveCookie();
  });
});