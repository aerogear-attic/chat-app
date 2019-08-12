import React from 'react';
import { Button, Toolbar } from '@material-ui/core';
import styled from 'styled-components';
import SignOutIcon from '@material-ui/icons/PowerSettingsNew';
import { useCallback } from 'react';
import { useSignOut } from '../../services/auth.service';
import { History } from 'history';

const Container = styled(Toolbar)`
  display: flex;
  background-color: var(--primary-bg);
  justify-content: space-between;
  color: var(--primary-text);
  font-size: 25px;
  line-height: 100px;
  font-weight: bold;
`;

const Title = styled.div`
`;

const LogoutButton = styled(Button)`
  color: var(--primary-text) !important;
  padding-right: 0 !important;
  justify-content: flex-end !important;
`;

interface ChildComponentProps {
  history: History;
}

const ChatsNavbar: React.FC<ChildComponentProps> = ({ history }) => {
  const signOut = useSignOut();

  const handleSignOut = useCallback(() => {
    signOut().then(() => {
      history.replace('/sign-in');
    });
  }, [history, signOut]);

  return (
    <Container>
      <Title>Chats &#128276; &#128172;</Title>
      <LogoutButton data-testid="sign-out-button" onClick={handleSignOut}>
        <SignOutIcon />
      </LogoutButton>
    </Container>
  );
};

export default ChatsNavbar;
