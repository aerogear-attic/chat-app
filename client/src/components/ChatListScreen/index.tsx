import React from 'react';
import styled from 'styled-components';
import ChatList from './ChatList';
import Navbar from './Navbar';

const Container = styled.div`
    height: 100vh;
`;

const ChatListScreen: React.FC = () => {
    return(
        <Container>
            <Navbar />
            <ChatList />
        </Container>
    );
};

export default ChatListScreen;
