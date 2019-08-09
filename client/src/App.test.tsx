import React from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import { OffixProvider } from 'react-offix-hooks';
import { createOfflineClient } from './client'
import ReactDOM from 'react-dom';
import App from './App';
import { mockApolloClient } from './test-helpers';
import * as subscriptions from './graphql/subscriptions';

it('renders without crashing', () => {
  const client = createOfflineClient()

  const div = document.createElement('div');

  ReactDOM.render(
    <>
      {/*
      // @ts-ignore */}
      <OffixProvider client={client}>
        <App />
      </OffixProvider>
    </>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
