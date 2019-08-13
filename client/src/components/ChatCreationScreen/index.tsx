import gql from 'graphql-tag';
import React from 'react';
import { useCallback, useReducer } from 'react';
import styled from 'styled-components';
import * as fragments from '../../graphql/fragments';
import UsersList from '../UsersList';
import ChatCreationNavbar from './ChatCreationNavbar';
import { History } from 'history';
import { useAddChatMutation } from '../../graphql/types';
import { writeChat } from '../../services/cache.service';
import CreateChatButton from './CreateChatButton';

// eslint-disable-next-line
const Container = styled.div`
  height: calc(100% - 56px);
  overflow-y: overlay;
`;

// eslint-disable-next-line
const StyledUsersList = styled(UsersList)`
  height: calc(100% - 56px);
`;

// eslint-disable-next-line
const addChatMutation = gql`
  mutation AddChat($recipientId: [ID!]!) {
    addChat(recipientId: $recipientId) {
      ...Chat
    }
  }
  ${fragments.chat}
`;

interface ChildComponentProps {
  history: History;
}

const ChatCreationScreen: React.FC<ChildComponentProps> = ({ history }) => {
  const [addChat] = useAddChatMutation({
    update: (client: any, { data: { addChat }}: any) => {
      writeChat(client, addChat);
    },
  });

  const [selectedUsers, dispatch] = useReducer((myArray, { type, value }) => {
    console.log(`dispatch ${type}, ${value}`)
    switch (type) {
      case "add":
        return [...myArray, value];
      case "remove":
        return myArray.filter((_: any, index: any) => index !== value);
      default:
        return myArray;
    }
  }, []);

  const onCreateClick = () => {
    createChat(selectedUsers)
   }

  const createChat = useCallback(selectedUsers => {
      addChat({
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   addChat: {
        //     __typename: 'Chat',
        //     id: Math.random()
        //       .toString(36)
        //       .substr(2, 9),
        //     // name: user.name,
        //     // picture: user.picture,
        //     lastMessage: null,
        //   },
        // },
        variables: {
          recipientId: selectedUsers,
        },
      }).then(({ data }: any) => {
        if (data !== null) {
          history.push(`/chats/${data.addChat.id}`);
        }
      });
    },
    [addChat, history]
  );

  return (
    <div>
      <ChatCreationNavbar history={history} />
      <UsersList dispatch={dispatch} selectedUsers={selectedUsers} />
      <CreateChatButton history={history} onCreateClick={onCreateClick}/>
    </div>
  );
};

export default ChatCreationScreen;
