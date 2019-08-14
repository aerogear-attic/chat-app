import { gql, withFilter } from "apollo-server-express";
import { Message, Chat } from "../../db";
import { Resolvers } from "../../types/graphql";
import { GraphQLModule } from "@graphql-modules/core";
import commonModule from "../common";
import usersModule from "../users";
import { UnsplashApi } from "./unsplash.api";
import { Users } from "./../users/users.provider";
import { Chats } from "./chats.provider";
import { PubSub } from "../common/pubsub.provider";
import { Auth } from "./../users/auth.provider";
import { assertGenericTypeAnnotation } from "babel-types";

// creating schema for chats
const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
    createdAt: DateTime!
    chat: Chat
    sender: User
    recipient: User
    isMine: Boolean!
  }

  type MessagesResult {
    cursor: Float
    hasMore: Boolean!
    messages: [Message!]!
  }

  type Chat {
    id: ID!
    name: String
    picture: String
    lastMessage: Message
    messages(limit: Int!, after: Float): MessagesResult!
    participants: [User!]!
  }

  extend type Query {
    chats: [Chat!]!
    chat(chatId: ID!): Chat
  }

  extend type Mutation {
    addMessage(chatId: ID!, content: String!): Message
    addChat(recipientId: [ID!]!): Chat
    removeChat(chatId: ID!): ID
  }

  extend type Subscription {
    messageAdded: Message!
    chatAdded: Chat!
    chatRemoved: ID!
  }
`;

// using chat provider module
const resolvers: Resolvers = {
  Message: {
    createdAt(message) {
      return new Date(message.created_at);
    },

    // pulling all chats for an x user
    async chat(message, args, { injector }) {
      return injector.get(Chats).findChatById(message.chat_id);
    },

    // pulling a message sender details
    async sender(message, args, { injector }) {
      return injector.get(Users).findById(message.sender_user_id);
    },

    // pulling a recipient details -------------------------------------CHECK------------------------------------------------
    async recipient(message, args, { injector }) {
      return injector.get(Chats).firstRecipient({
        chatId: message.chat_id,
        userId: message.sender_user_id
      });
    },

    // checking if message sent belongs to the current user
    async isMine(message, args, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();
      return message.sender_user_id === currentUser!.id;
    }
  },

  Chat: {
    // pulling details of participant of chat that is not the current user but belongs to current user chat room
    async name(chat, args, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();
      
      if (!currentUser) return null;
      const participants = await injector.get(Chats).participants(chat.id)

      const participantsWithoutCurrentUser = participants.filter((participant) => {
        return participant.id !== currentUser.id
      })

      
      if (participantsWithoutCurrentUser.length === 1) {
        const otherParticipant = participantsWithoutCurrentUser[0]
        return otherParticipant.name || otherParticipant.username || ""
      }

      const names = participantsWithoutCurrentUser.reduce((prev, participant) => {
        const name = participant.name || participant.username || ""
        if (prev === "") {
          return name
        }
        return `${prev}, ${name}`
      }, "")

      return names
    },

    // pulling details of participant of chat that is not the current user but belongs to current user chat room
    async picture(chat, args, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();

      if (!currentUser) return null;

      const participants = await injector.get(Chats).participants(chat.id)

      const participantsWithoutCurrentUser = participants.filter((participant) => {
        return participant.id !== currentUser.id
      })

      if (participantsWithoutCurrentUser.length === 1) {
        const participant = participantsWithoutCurrentUser[0]
        return participant && participant.picture
        ? participant.picture
        : injector.get(UnsplashApi).getRandomPhoto();
      }
      return injector.get(UnsplashApi).getRandomPhoto();
    },

    // pulling all messages for X chat room
    async messages(chat, args, { injector }) {
      return injector.get(Chats).findMessagesByChat({
        chatId: chat.id,
        limit: args.limit,
        after: args.after
      });
    },

    // pulling last message of X chat room
    async lastMessage(chat, args, { injector }) {
      return injector.get(Chats).lastMessage(chat.id);
    },

    // pulling both participants of X chat room
    async participants(chat, args, { injector }) {
      return injector.get(Chats).participants(chat.id);
    }
  },

  Query: {
    // pulls all chat ID's which current user is part of
    async chats(root, args, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();

      if (!currentUser) return [];

      return injector.get(Chats).findChatsByUser(currentUser.id);
    },

    // pulls X chat room that current user is part of
    async chat(root, { chatId }, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();

      if (!currentUser) return null;

      return injector
        .get(Chats)
        .findChatByUser({ chatId, userId: currentUser.id });
    }
  },

  Mutation: {
    // adds message to the db, publishes messageAdded subscription
    async addMessage(root, { chatId, content }, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();

      if (!currentUser) return null;

      return injector
        .get(Chats)
        .addMessage({ chatId, content, userId: currentUser.id });
    },

    // creates a chat room between current user and a recipient, publish chat added subscription
    async addChat(root, args, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();
      if (!currentUser) return null;
      return injector
        .get(Chats)
        .addChat({ userId: currentUser.id, recipientsId: args.recipientId});
    },

    // removes chat of X chat Id that belongs to current user, publish chat removed pubsub
    async removeChat(root, { chatId }, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();

      if (!currentUser) return null;

      return injector.get(Chats).removeChat({ chatId, userId: currentUser.id });
    }
  },

  // subscription for messageAdded where user ID equals current user and chat ID equals ID of message.chatId
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (root, args, { injector }) =>
          injector.get(PubSub).asyncIterator("messageAdded"),
        async (
          { messageAdded }: { messageAdded: Message },
          args,
          { injector }
        ) => {
          const currentUser = await injector.get(Auth).currentUser();
          if (!currentUser) return false;

          return injector.get(Chats).isParticipant({
            chatId: messageAdded.chat_id,
            userId: currentUser.id
          });
        }
      )
    },

    // subscription for chatAdded where subscribing user is the current user and chat subscribed to is the chat of created chatID
    chatAdded: {
      subscribe: withFilter(
        (root, args, { injector }) =>
          injector.get(PubSub).asyncIterator("chatAdded"),
        async ({ chatAdded }: { chatAdded: Chat }, args, { injector }) => {
          const currentUser = await injector.get(Auth).currentUser();
          if (!currentUser) return false;

          return injector.get(Chats).isParticipant({
            chatId: chatAdded.id,
            userId: currentUser.id
          });
        }
      )
    },
    // subscription for removing a chat room for current user and chat room of chat id of removed chat room.
    chatRemoved: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator("chatRemoved"),
        async ({ targetChat }: { targetChat: Chat }, args, { injector }) => {
          const currentUser = await injector.get(Auth).currentUser();
          if (!currentUser) return false;

          return injector.get(Chats).isParticipant({
            chatId: targetChat.id,
            userId: currentUser.id
          });
        }
      )
    }
  }
};

export default new GraphQLModule({
  name: "chats",
  typeDefs,
  resolvers,
  imports: () => [commonModule, usersModule],
  providers: () => [UnsplashApi, Chats]
});
