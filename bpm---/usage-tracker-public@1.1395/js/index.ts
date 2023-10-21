import { defaults } from 'usage-tracker-core/common/helpers';
import publicTrackingClient from './client';
const DEFAULT_OPTS = {
  // Public Applications are allowed to be non-Authenticated
  allowUnauthed: true,
  // Public Applications can run on non-HubSpot App Domains
  isExternalHost: true,
  // As `events` is a required property from the TrackerConfig we define it here
  // but as a `undefined` value, so once the validation of TrackerConfig is done
  // it will throw an exception for not having the `events` property supplied.
  // as `undefined` will be interpreted as the value not being provided.
  events: undefined
};
export const createTracker = options => {
  const mergedOptions = defaults(options || DEFAULT_OPTS, DEFAULT_OPTS);
  return publicTrackingClient.createTracker(mergedOptions);
};