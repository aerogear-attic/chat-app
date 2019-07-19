import { GraphQLDateTime } from "graphql-iso-date";
import { User, Message, Chat, chats, messages, users } from "../db";
import { Resolvers } from "../types/graphql";
import { withFilter } from "graphql-subscriptions";
import { secret, expiration } from "../env";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateLength, validatePassword } from "../validators";

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
    // sends a current user from the context to ensure that authToken references to a real user
    me(root, args, { currentUser }) {
      return currentUser || null;
    },

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
    },

    // returning a list of users that are not the current logged in user. This is done to enable kind of a friends list for logged in user.
    users(root, args, { currentUser }) {
      if (!currentUser) return [];
      return users.filter(u => u.id !== currentUser.id);
    }
  },

  Mutation: {
    //
    signUp(root, { name, username, password, passwordConfirm }) {
      validateLength("req.name", name, 3, 50);
      validateLength("req.username", username, 3, 18);
      validatePassword("req.password", password);

      if (password !== passwordConfirm) {
        throw Error("req.password and req.passwordConfirm don't match");
      }

      if (users.some(u => u.username === username)) {
        throw Error("username already exists");
      }

      const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

      const user: User = {
        id: String(users.length + 1),
        password: passwordHash,
        picture: "",
        username,
        name
      };

      users.push(user);

      return user;
    },

    // singIn mutation takes in username, password from input and response from the context
    signIn(root, { username, password }, { res }) {
      const user = users.find(u => u.username === username);

      // if user does not exists:
      if (!user) {
        throw new Error("user not found");
      }

      // comparing raw password with encrypted password using bcrypt
      // compareSync takes in two arguments and returns true if they are same or false if not
      const passwordsMatch = bcrypt.compareSync(password, user.password);

      // if password is wrong:
      if (!passwordsMatch) {
        throw new Error("password is incorrect");
      }

      // auth token with username and secret
      const authToken = jwt.sign(username, secret);

      // sets a cookie with authToke which contains user name and secret, and expiration time to be send with response
      res.cookie("authToken", authToken, { maxAge: expiration });

      return user;
    },
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
    },

    // adding a feature to create a chat room with current user and recipient from users list
    addChat(root, { recipientId }, { currentUser, pubsub }) {
      if (!currentUser) return null;

      // at least one element in users array must pass function provided in some(recipientID must be equal to one of users Id from users array) or return null
      if (!users.some(u => u.id === recipientId)) return null;

      // finding and assigning current user id and recipient id to 'chat' var from chats array
      let chat = chats.find(
        c =>
          c.participants.includes(currentUser.id) &&
          c.participants.includes(recipientId)
      );

      // if chat has value return chat
      if (chat) return chat;

      // creating new array with chats id's
      const chatsIds = chats.map(c => Number(c.id));

      // creating new chat object with new ID which is incrementing max exisiting chat id by 1
      chat = {
        id: String(Math.max(...chatsIds) + 1),
        participants: [currentUser.id, recipientId],
        messages: []
      };

      chats.push(chat);

      // adding subscription to addChat mutation
      pubsub.publish("chatAdded", {
        chatAdded: chat
      });

      return chat;
    },

    // removing chat by chatId and only if currentUser is one of participants, also, removing all the messages of that chat.
    removeChat(root, { chatId }, { currentUser, pubsub }) {
      if (!currentUser) return null;

      const chatIndex = chats.findIndex(c => c.id === chatId);

      if (chatIndex === -1) return null;

      const chat = chats[chatIndex];

      // if at theres not at least 1 participant of id same as current user return null
      if (!chat.participants.some(p => p === currentUser.id)) return null;

      // chatMessage is an id of message that belongs to chat object pulled from const chat
      // then going through all messages and looking for a message with ID same as chatMessage ID
      chat.messages.forEach(chatMessage => {
        const chatMessageIndex = messages.findIndex(m => m.id === chatMessage);

        // if message is found ( chatmessageindex is not equal to -1 ) removing 1 message from chatMessageIndex position in the array
        // process is repeated until chatMessageIndex is equal to -1
        if (chatMessageIndex !== -1) {
          messages.splice(chatMessageIndex, 1);
        }
      });
      // Once messages are removed, removing 1 element from Chat with position of chatIndex
      chats.splice(chatIndex, 1);

      pubsub.publish("chatRemoved", {
        chatRemoved: chat.id,
        targetChat: chat
      });

      return chatId;
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
    },
    // adding a subcription for chatAdded. It will broadcast to the current user only if he is a participant of published chat
    chatAdded: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator("chatAdded"),
        ({ chatAdded }: { chatAdded: Chat }, args, { currentUser }) => {
          if (!currentUser) return false;
          return chatAdded.participants.some(p => p === currentUser.id);
        }
      )
    },
    // adding subscription for chatRemoved. It will broadcast to the current user only if he is a participant of published chat
    chatRemoved: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator("chatRemoved"),
        ({ targetChat }: { targetChat: Chat }, args, { currentUser }) => {
          if (!currentUser) return false;

          return targetChat.participants.some(p => p === currentUser.id);
        }
      )
    }
  }
};

export default resolvers;
