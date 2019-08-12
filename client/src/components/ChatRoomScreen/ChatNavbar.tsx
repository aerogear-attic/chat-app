import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from 'graphql-tag';
import React from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { History } from 'history';
import { useRemoveChatMutation } from '../../graphql/types';
import { eraseChat } from '../../services/cache.service';

const Container = styled(Toolbar)`
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;:
  color: var(--primary-text);
  font-size: 25px;
  font-weight: bold;
  border-bottom: 1px solid #f1f1f1;
`;

const BackButton = styled(Button)`
  padding-left: 0 !important;
  justify-content: left !important;

  svg {
    color: var(--accent-colour-shade);
  }
`;

const Rest = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Picture = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 3px;
  margin-left: -22px;
  object-fit: cover;
  padding: 5px;
  border-radius: 50%;
`;

const Name = styled.div`
  line-height: 100px;
`;

const DeleteButton = styled(Button)`
  padding-right: 0 !important;
  justify-content: flex-end !important;
  color: var(--accent-colour-shade) !important;
`;

export const removeChatMutation = gql`
  mutation RemoveChat($chatId: ID!) {
    removeChat(chatId: $chatId)
  }
`;

interface ChatNavbarProps {
  history: History;
  chat: {
    picture?: string | null;
    name?: string | null;
    id: string;
  };
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({ chat, history }) => {
  const [removeChat] = useRemoveChatMutation({
    variables: {
      chatId: chat.id,
    },
    update: (client: any, { data: { removeChat } }: any) => {
      eraseChat(client, removeChat);
    },
  });

  const handleRemoveChat = useCallback(() => {
    removeChat().then(() => {
      history.replace('/chats');
    });
  }, [removeChat, history]);

  const navBack = useCallback(() => {
    history.replace('/chats');
  }, [history]);

  return (
    <Container>
      <BackButton data-testid="back-button" onClick={navBack}>
        <ArrowBackIcon />
      </BackButton>
      {chat && chat.picture && chat.name && (
        <React.Fragment>
          {/* <Picture data-testid="chat-picture" src={chat.picture} /> */}
          <Name data-testid="chat-name">&#128081; &#x1F5E3; {chat.name}</Name>
        </React.Fragment>
      )}
      <Rest>
        <DeleteButton data-testid="delete-button" onClick={handleRemoveChat}>
          <DeleteIcon />
        </DeleteButton>
      </Rest>
    </Container>
  );
};

export default ChatNavbar;
