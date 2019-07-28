import gql from 'graphql-tag';
import React, { useCallback } from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import styled from 'styled-components';
import ChatNavbar from './ChatNavbar';
import MessageInput from './MessageInput';
import MessagesList from './MessagesList';
import { History } from 'history';
import * as queries from '../../graphql/queries';
import * as fragments from '../../graphql/fragments';

const Container = styled.div`
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`;

const addMessageMutation = gql`
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      ...Message
    }
  }
  ${fragments.message}
`;

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      ...FullChat
    }
  }
  ${fragments.fullChat}
`;

interface ChatRoomScreenParams {
  chatId: string;
  history: History;
}

export interface ChatQueryMessage {
  id: string;
  content: string;
  createdAt: number;
}

export interface ChatQueryResult {
  id: string;
  name: string;
  picture: string;
  messages: ChatQueryMessage[];
}

type OptionalChatQueryResult = ChatQueryResult | null;

interface ChatsResult {
  chats: any[];
}

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({ history, chatId }) => {

  const {
    data, loading, error
  } = useQuery<any>(getChatQuery, {
    variables: { chatId }
  });

  const chat = data && data.chat ? data.chat : null;

  const [addMessage]: any = useMutation(addMessageMutation);

  const onSendMessage = useCallback(
    (content: string) => {
      addMessage({
        variables: { chatId, content },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            id: Math.random()
              .toString(36)
              .substr(2, 9),
            createdAt: new Date(),
            content
          }
        },
        // tslint:disable-next-line:no-shadowed-variable
        update: (client: any, { data: { addMessage } }: any) => {
          client.writeQuery({
            query: getChatQuery,
            variables: { chatId },
            data: {
              chat: {
                ...chat,
                messages: chat.messages.concat(addMessage)
              }
            }
          });

          let data;

          try {
            data = client.readQuery({
              query: queries.chats
            });
          } catch (e) {
            return;
          }
          if (!data || data === null) {
            return null;
          }
          if (!data.chats || data.chats === undefined) {
            return null;
          }
          const chats = data.chats;
          const chatIndex = chats.findIndex((c: any) => c.id === chatId);
          if (chatIndex === -1) { return; }
          const chatWhereAdded = chats[chatIndex];
          chatWhereAdded.lastMessage = addMessage;
          // The chat will appear at the top of the ChatsList component
          chats.splice(chatIndex, 1);
          chats.unshift(chatWhereAdded);
          client.writeQuery({
            query: queries.chats,
            data: { chats }
          });

        }
      });
    },
    [chat, chatId, addMessage]
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      {chat.messages && <MessagesList messages={chat.messages} />}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  );

};

export default ChatRoomScreen;
