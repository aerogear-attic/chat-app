import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import ChatRoomScreen from './components/ChatRoomScreen';
import ChatsListScreen from './components/ChatsListScreen';
import ChatCreationScreen from './components/ChatCreationScreen';
import AnimatedSwitch from './components/AnimatedSwitch';
import { withAuth } from './services/auth.service';
import { ApolloOfflineClient } from 'offix-client';
import { ApolloProvider } from 'react-apollo-hooks'
import { useOffixClient } from 'react-offix-hooks';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatedSwitch>
        <Route exact path="/sign-(in|up)" component={AuthScreen} />
        <Route exact path="/chats" component={withAuth(ChatsListScreen)} />

        <Route
          exact
          path="/chats/:chatId"
          component={withAuth(
            ({ match, history }: RouteComponentProps<{ chatId: string }>) => (
              <ChatRoomScreen chatId={match.params.chatId} history={history} />
            )
          )}
        />

        <Route exact path="/new-chat" component={withAuth(ChatCreationScreen)} />
      </AnimatedSwitch>
      <Route exact path="/" render={redirectToChats} />
    </BrowserRouter>
  )
};

const App: React.FC = () => {
  const offixClient = useOffixClient()

  // First we initialize a piece of state called apolloClient
  // It's null at the start
  const [apolloClient, setApolloClient] = useState(null as unknown as ApolloOfflineClient)

  // Inside useEffect, initialize the offix client and set the apollo client
  // This only happens once.
  useEffect(() => {
    offixClient.init().then((client: React.SetStateAction<ApolloOfflineClient>) => {
      console.log('offline client initialized')
      setApolloClient(client)
    })
  }, [offixClient])

  // load the app if the apolloClient is there, otherwise load a loading screen
  if (apolloClient) {
    return (
      <ApolloProvider client={apolloClient}>
        <Router />
      </ApolloProvider>
    )
  }
  return <div>Loading...</div>
};

const redirectToChats = () => <Redirect to="/chats" />;

export default App;
