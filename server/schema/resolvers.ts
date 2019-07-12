import { GraphQLDateTime } from "graphql-iso-date";
import { chats, messages } from "../db";

const resolvers = {
  Date: GraphQLDateTime,
  Chat: {
    messages(chat: any) {
      return messages.filter(m => chat.messages.includes(m.id));
    }
  },
  Query: {
    chats() {
      return chats;
    },

    chat(root: any, { chatId }: any) {
      return chats.find(c => c.id === chatId);
    }
  }
};

export default resolvers;
