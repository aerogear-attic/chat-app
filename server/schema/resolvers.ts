import { GraphQLDateTime } from "graphql-iso-date";
import { User, Message, chats, messages, users } from "../db";
import { Resolvers } from "../types/graphql";

const resolvers: Resolvers = {
  Date: GraphQLDateTime,

  Message: {
    // finds the sender of the message by matching message.sender (string) with user.id (string)
    sender(message) {
      return users.find(u => u.id === message.sender) || null;
    },

    // finds the recipient by matching user.id with message.recipent
    recipient(message) {
      return users.find(u => u.id === message.recipent) || null;
    },

    // marks message send with sender equal to current "logged in" user, = 1, to identify which messages came from "logged in" user
    isMine(message, args, { currentUser }) {
      return message.sender === currentUser.id;
    }
  },

  Chat: {
    // name accepts chat as parent object, no arguments and current user from context
    name(chat, args, { currentUser }) {
      // if no user "logged in" is found its going to return null
      if (!currentUser) return null;

      // looking for participantId which equals to looking through array of participants of chat that have different ID than registered User
      // for now, each chat room has only 2 users, logged in user and another user from user array.
      const participantId = chat.participants.find(p => p !== currentUser.id);

      // if there is no other participant in chat room null value is returned
      if (!participantId) return null;

      // finding other participant by participant id comparison to user.id
      const participant = users.find(u => u.id === participantId);

      // grabbing participant name from user array using participant object created above
      return participant ? participant.name : null;
    },

    picture(chat, args, { currentUser }) {
      // same rules as with name except it return picture of the non logged in participant of chat room
      if (!currentUser) return null;

      const participantId = chat.participants.find(p => p !== currentUser.id);

      if (!participantId) return null;

      const participant = users.find(u => u.id === participantId);

      return participant ? participant.picture : null;
    },

    // returning messages that relate to parent chat object by message Id from message array in db.ts
    messages(chat) {
      return messages.filter(m => chat.messages.includes(m.id));
    },

    // returns last message from chat --- TODO: consider removing this after confirming with Milena that it is no longer required
    lastMessage(chat) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return messages.find(m => m.id === lastMessage) || null;
    },

    // returns participants of chat room by matching participant ID with User Id
    participants(chat) {
      return chat.participants.map(p => users.find(u => u.id === p)) as User[];
    }
  },
  Query: {
    // chats return all chats that exist for current logged in user as all chats returned must include current user ID
    chats(root, args, { currentUser }) {
      if (!currentUser) return [];
      return chats.filter(c => c.participants.includes(currentUser.id));
    },

    // returns chat room by ID of chat and also must include current user ID
    chat(root, { chatId }, { currentUser }) {
      if (!currentUser) return null;
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return null;
      return chat.participants.includes(currentUser.id) ? chat : null;
    }
  },

  Mutation: {
    // addMessage mutation accept args chatId and content of the message and context currentUser and pubsub event emitter
    addMessage(root, { chatId, content }, { currentUser, pubsub }) {
      if (!currentUser) return null;

      const chatIndex = chats.findIndex(c => c.id === chatId);

      if (chatIndex === -1) return null;

      const chat = chats[chatIndex];

      if (!chat.participants.includes(currentUser.id)) return null;

      const lastMessageId = messages.length;
      const messageId = String(Number(lastMessageId) + 1);

      const message: Message = {
        id: messageId,
        createdAt: new Date(),
        sender: currentUser.id,
        recipent: chat.participants.find(p => p !== currentUser.id) as string,
        content
      };

      messages.push(message);
      chat.messages.push(messageId);
      chats.splice(chatIndex, 1);
      chats.unshift(chat);

      // publishing "message added" after the message has been pushed to the []
      pubsub.publish("messageAdded", {
        messageAdded: message
      });
      return message;
    }
  },

  // building a relationship between messageAdded subscription and messageAdded publish. So that whenever 'messageAdded' is
  // triggered by addMessage resolver subscription is triggered thanks to pubsub event listener
  Subscription: {
    messageAdded: {
      subscribe: (root, args, { pubsub }) =>
        // asyncIterator returns an iterator like object that by default parameter that has similiar name to the subscription will be returned
        // in this scenario message will be returned from messageAdded publish inside addMessage resolver
        pubsub.asyncIterator("messageAdded")
    }
  }
};

export default resolvers;
