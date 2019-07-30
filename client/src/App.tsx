import React from 'react';
import { BrowserRouter, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import ChatListScreen from './components/ChatListScreen';
import ChatRoomScreen from './components/ChatRoomScreen';
import MyAnimatedSwitch from './components/AnimatedSwitch';
import { useCacheService } from './services/cache.service';

const App: React.FC = () => {
  useCacheService();

  return (
    <BrowserRouter>
      <MyAnimatedSwitch>
        <Route exact path='/chats' component={ChatListScreen} />

        <Route
          exact
          path='/chats/:chatId'
          component={({ match, history }: RouteComponentProps<{ chatId: string }>) => (
            <ChatRoomScreen chatId={match.params.chatId} history={history} />
          )} />
      </MyAnimatedSwitch>
      <Route exact path='/' render={redirectToChats} />
    </BrowserRouter>
  );
};

const redirectToChats = () => <Redirect to='/chats' />;

export default App;
