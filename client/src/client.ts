import { OfflineClient } from 'offix-client';

const httpUri = process.env.REACT_APP_SERVER_URL + '/graphql';
const wsUri = httpUri.replace(/^https?/, 'ws');

const apolloOptions = {
  httpUrl: httpUri,
  wsUrl: wsUri
}
export function createOfflineClient() {
  const options = {
    ...apolloOptions,
    authContextProvider: undefined
  }

  return new OfflineClient(options);
}
