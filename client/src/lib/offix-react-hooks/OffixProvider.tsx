import ApolloClient from 'apollo-client';
import React, { ReactElement, ReactNode, useContext } from 'react';
import { OfflineClient } from 'offix-client';

const OffixContext = React.createContext<null | OfflineClient>(null);

export interface OffixProviderProps {
  readonly children?: ReactNode;
  readonly client: OfflineClient;
}

/**
 * 
 * The Offix Provider is a Context Provider that lets us initialize the
 * offix client once in our app and then we can access it from any other component in our app
 * using `useOffixClient`
 * 
 * See ../index.tsx for usage of OffixProvider
 * See ../components/TaskList/index.tsx for usage of useOffixClient
 */
export function OffixProvider({ client, children }: OffixProviderProps): ReactElement<OffixProviderProps> {
  return (
    <OffixContext.Provider value={client}>{children}</OffixContext.Provider>
  );
}

export function useOffixClient(overrideClient?: OfflineClient): OfflineClient {
  const client = useContext(OffixContext);

  // Ensures that the number of hooks called from one render to another remains
  // constant, despite the Apollo client read from context being swapped for
  // one passed directly as prop.
  if (overrideClient) {
    return overrideClient;
  }

  if (!client) {
    // https://github.com/apollographql/react-apollo/blob/5cb63b3625ce5e4a3d3e4ba132eaec2a38ef5d90/src/component-utils.tsx#L19-L22
    throw new Error(
      'Could not find "client" in the context or passed in as a prop. ' +
        'Wrap the root component in an <ApolloProvider>, or pass an ' +
        'ApolloClient instance in via props.'
    );
  }
  return client;
}