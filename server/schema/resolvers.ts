import { GraphQLDateTime } from "graphql-iso-date";
import { chats, messages } from "../db";

const resolvers = {
  Date: GraphQLDateTime,
  Chat: {
    messages(chat: any) {
      return messages.filter(m => chat.messages.includes(m.id));
    },
    lastMessage(chat: any) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return messages.find(m => m.id === lastMessage);
    },
  },
  Query: {
    chats() {
      return chats;
    },

    chat(root: any, { chatId }: any) {
      return chats.find(c => c.id === chatId);
    }
  },

  Mutation: {
    addMessage(root: any, { chatId, content }: any) {
      //find index of chat by chatId
      const chatIndex = chats.findIndex(c => c.id === chatId);
      console.log("index is " + chatIndex)


      if (chatIndex === -1) return null;
    
      //pull chat from chats[index no]
      const chat = chats[chatIndex];
      
      //fetching last message in chat
      const lastMessageId = messages.length;

      //creating new incoming message Id number which is increment of last message by 1
      const messageId = String(Number(lastMessageId) + 1);
      
      //creating new incoming message
      const message = {
        id: messageId,
        createdAt: new Date(),
        content
      };
      
      //adding new message to the array of messages in db
      messages.push(message);
      //pushing messageId to the array of chat.messages field
      chat.messages.push(messageId);

      //chat message will appear at the top of the chatslist component
      chats.splice(chatIndex, 1);
      chats.unshift(chat);
      return message;
      
    }
  }
};

export default resolvers;
