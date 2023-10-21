import * as errors from './common/errors';
import * as storageKeys from './storageKeys';

const resolveUserAndTeamIdentifiers = ({
  deviceId,
  utk,
  email,
  hubId
}, {
  allowUnauthed,
  isExternalHost
}) => {
  let anon;
  let user;
  let team;

  if (hubId) {
    team = hubId;
  }

  if (email) {
    user = `EMAIL:::${email}:::${storageKeys.accountId}`;
  } else if (utk) {
    if (isExternalHost) {
      anon = `TEMP_ID:::${utk}:::${storageKeys.accountId}`;
    } else {
      anon = `VISITOR:::${utk}:::${storageKeys.accountId}`;
    }
  } else if (deviceId) {
    anon = `TEMP_ID:::${deviceId}:::${storageKeys.accountId}`;
  }

  if (!user && !allowUnauthed) {
    throw errors.eventError('Could not identify an authenticated user. Please specify an email address (email).');
  }

  if (!team && !allowUnauthed) {
    throw errors.eventError('Could not identify a HubSpot Portal ID. Please specify a Portal ID (hubId).');
  }

  if (!anon && !user && allowUnauthed) {
    throw errors.eventError('Could not identify the user. Please specify an email address (email) or an __hstc cookie (hstc) or a device id (deviceId).');
  }

  return {
    user: user || anon,
    team
  };
};

const parseUtk = hstc => {
  let utk;

  if (hstc) {
    const hstcParts = hstc.split('.');

    if (hstcParts.length > 1) {
      utk = hstcParts[1];
    }
  }

  return utk;
};

export const createIdentifiers = ({
  email,
  userId,
  hubId,
  hstc,
  deviceId
}, {
  allowUnauthed,
  isExternalHost
}) => {
  const utk = parseUtk(hstc);
  const {
    user,
    team
  } = resolveUserAndTeamIdentifiers({
    deviceId,
    utk,
    email,
    hubId
  }, {
    allowUnauthed,
    isExternalHost
  });
  return {
    user,
    team,
    utk,
    raw: {
      email,
      userId,
      hubId,
      hstc,
      deviceId
    }
  };
};