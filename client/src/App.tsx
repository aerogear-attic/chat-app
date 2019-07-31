import React from 'react';
import { BrowserRouter, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import ChatListScreen from './components/ChatListScreen';
import ChatRoomScreen from './components/ChatRoomScreen';
import MyAnimatedSwitch from './components/AnimatedSwitch';
import { withAuth } from './services/auth.service';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MyAnimatedSwitch>
        <Route exact path='/sign-(in|up)' component={AuthScreen} />
        <Route exact path='/chats' component={ChatListScreen} />

        <Route
          exact
          path='/chats/:chatId'
          component={withAuth(
            ({ match, history }: RouteComponentProps<{ chatId: string }>) => (
              <ChatRoomScreen chatId={match.params.chatId} history={history} />
            )
          )}
        />
      </MyAnimatedSwitch>
      <Route exact path='/' render={redirectToChats} />
    </BrowserRouter>
  );
};

const redirectToChats = () => <Redirect to='/chats' />;

export default App;
