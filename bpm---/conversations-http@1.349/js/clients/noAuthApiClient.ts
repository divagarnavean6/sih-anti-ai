import { createStack } from 'hub-http';
import promiseClient from 'hub-http/adapters/promiseClient';
import noAuthWithCredentialsHubapi from 'hub-http/stacks/noAuthWithCredentialsHubapi';
import { checkNetworkOnTimeout } from '../middlewares/checkNetworkOnTimeout';
const stack = createStack(noAuthWithCredentialsHubapi, checkNetworkOnTimeout());
const noAuthApiClient = promiseClient(stack);
export default noAuthApiClient;