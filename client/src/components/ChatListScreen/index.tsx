import React from 'react';
import { History } from 'history';
import styled from 'styled-components';
import ChatList from './ChatList';
import Navbar from './Navbar';

const Container = styled.div`
    height: 100vh;
`;

interface ChatListScreenProps {
  history: History;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ history }) => {
    return(
        <Container>
            <Navbar history={history} />
            <ChatList history={history} />
        </Container>
    );
};

export default ChatListScreen;
