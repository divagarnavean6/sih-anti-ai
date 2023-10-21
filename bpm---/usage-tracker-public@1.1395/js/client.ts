import noAuthApiClient from 'hub-http/clients/noAuthApiClient';
import { getFullUrl } from 'hubspot-url-utils';
import { createClient } from 'usage-tracker-core';
import { genericClient } from 'usage-tracker-core/client';
import { attemptToGetTrackerHstc } from './utils';
const origin = getFullUrl('app-api');
const path = '/usage-logging/v1/log/hublytics-multi/no-auth';

const reportNetworkError = err => {
  return genericClient.reportError(err, {
    fingerprint: ['usage-tracker-js', 'network']
  });
};

const publicTrackingClient = createClient({
  clientName: 'public',
  getDebug: genericClient.getDebug,
  getLang: genericClient.getLang,
  getTempStorage: genericClient.getTempStorage,
  setTempStorage: genericClient.setTempStorage,
  logWarning: genericClient.logWarning,
  logError: genericClient.logError,
  reportWarning: genericClient.reportWarning,
  reportError: genericClient.reportError,
  getHstc: attemptToGetTrackerHstc,
  getEmail: () => null,
  getHubId: () => null,
  send: ({
    events,
    query,
    isBeforeUnload
  }) => {
    const endpoint = `${origin}${path}?${query}`;

    const sendXhr = () => {
      noAuthApiClient.post(endpoint, {
        data: events
      }).catch(reportNetworkError);
    };

    if (isBeforeUnload) {
      genericClient.sendBeacon(endpoint, events, sendXhr);
    } else {
      sendXhr();
    }
  }
});
export default publicTrackingClient;