import { OfflineClient } from 'offix-client';
import { OffixClientConfig } from 'offix-client/types/config/OffixClientConfig';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const url = process.env.NODE_ENV === 'production' ? window.location.origin : process.env.REACT_APP_SERVER_URL

const httpUri = url + '/graphql';

console.log(`using url ${httpUri}`)
let wsUri: string

if (httpUri.includes('https://')) {
  wsUri = httpUri.replace(/^https/, 'wss');
} else {
  wsUri = httpUri.replace(/^http/, 'ws');
}

const httpLink = new HttpLink({
  uri: httpUri,
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    // Automatic reconnect in case of connection error
    reconnect: true,
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation }: any = getMainDefinition(query);
    // If this is a subscription query, use wsLink, otherwise use httpLink
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const apolloOptions: OffixClientConfig = {
  httpUrl: httpUri,
  terminatingLink
}

export function createOfflineClient() {
  const options = {
    ...apolloOptions,
    authContextProvider: undefined
  }

  return new OfflineClient(options);
}
