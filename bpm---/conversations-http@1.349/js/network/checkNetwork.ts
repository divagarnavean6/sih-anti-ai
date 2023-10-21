import enviro from 'enviro';
import noAuthApiClient from 'hub-http/clients/noAuthApiClient';
export const NETWORK_CHECK_TIMEOUT_MS = 5000;

const getHostName = () => enviro.deployed() ? 'app' : 'local';

const getDomainSuffix = () => enviro.isQa() ? 'qa' : '';

export const checkNetwork = () => {
  return noAuthApiClient.get(`https://${getHostName()}.hubspot${getDomainSuffix()}.com/network-check/is-the-internet-up.txt`, {
    timeout: NETWORK_CHECK_TIMEOUT_MS,
    query: {
      rnd: Math.random()
    }
  }).then(() => ({
    online: true
  }), error => ({
    online: false,
    error
  }));
};