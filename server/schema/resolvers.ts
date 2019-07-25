import { GraphQLDateTime } from "graphql-iso-date";
import { Message, Chat, pool } from "../db";
import { Resolvers } from "../types/graphql";
import { withFilter } from "graphql-subscriptions";
import { secret, expiration } from "../env";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateLength, validatePassword } from "../validators";
import sql from "sql-template-strings";
import axios from "axios";
import { RandomPhoto } from "../types/unsplash";


const resolvers: Resolvers = {
  Date: GraphQLDateTime,

  Message: {
    createdAt(message) {
      return new Date(message.created_at);
    },

    // pulling all chats for an x user
    async chat(message, args, { db }) {
      const { rows } = await db.query(sql`
      SELECT * FROM chats WHERE id = ${message.chat_id}
      `);
      return rows[0] || null;
    },

    // pulling a message sender details
    async sender(message, args, { db }) {
      const { rows } = await db.query(sql`
      SELECT * FROM users WHERE id = ${message.sender_user_id}
      `);
      return rows[0] || null;
    },

    // pulling a recipient details -------------------------------------CHECK------------------------------------------------
    async recipient(message, args, { db }) {
      const { rows } = await db.query(sql`
      SELECT * FROM users WHERE id = ${message.sender_user_id}
      AND chats_users.chat_id = ${message.chat_id}
      `);
      return rows[0] || null;
    },

    // checking if message sent belongs to the current user
    isMine(message, args, { currentUser }) {
      return message.sender_user_id === currentUser.id;
    }
  },

  Chat: {
    // pulling details of participant of chat that is not the current user but belongs to current user chat room
    async name(chat, args, { currentUser, db }) {
      if (!currentUser) return null;

      const { rows } = await db.query(sql`
      SELECT users.* FROM users, chats_users
      WHERE users.id != ${currentUser.id}
      AND users.id = chats_users.user_id
      AND chats_users.chat_id = ${chat.id}`);

      const participant = rows[0];

      return participant ? participant.name : null;
    },

    // pulling details of participant of chat that is not the current user but belongs to current user chat room
    async picture(chat, args, { currentUser, db }) {
      if (!currentUser) return null;

      const { rows } = await db.query(sql`
      SELECT users.* FROM users, chats_users
      WHERE users.id != ${currentUser.id}
      AND users.id = chats_users.user_id
      AND chats_users.chat_id = ${chat.id}`);

      const participant = rows[0];

      if (participant && participant.picture) return participant.picture;

      // adding a random picture for participant from unsplash using axios which allows to make 
      // http request from node.
      try {
        return (await axios.get<RandomPhoto>(
          "https://api.unsplash.com/photos/random",
          {
            params: {
              query: "portrait",
              orientation: "squarish"
            },
            headers: {
              Authorization:
                "Client-ID 4d048cfb4383b407eff92e4a2a5ec36c0a866be85e64caafa588c110efad350d"
            }
          }
        )).data.urls.small;
      } catch (err) {
        console.log("Cannot retrieve random photo:", err);
        return null;
      }
    },

    // pulling all messages for X chat room
    async messages(chat, args, { db }) {
      const { rows } = await db.query(sql`
      SELECT * FROM messages WHERE chat_id = ${chat.id}
      `);
      return rows;
    },

    // pulling last message of X chat room
    async lastMessage(chat, args, { db }) {
      const { rows } = await db.query(sql`
      SELECT * FROM messages
      WHERE chat_id = ${chat.id}
      ORDER BY created_at DESC
      LIMIT 1
      `);
      return rows[0];
    },

    // pulling both participants of X chat room
    async participants(chat, args, { db }) {
      const { rows } = await db.query(sql`
      SELECT users.* FROM users, chats_users
      WHERE chats_users.chat_id = ${chat.id}
      AND chats_users.user_id = users.id
      `);
      return rows;
    }
  },

  Query: {
    // returns current logged in user
    me(root, args, { currentUser }) {
      return currentUser || null;
    },

    // pulls all chat ID's which current user is part of
    async chats(root, args, { currentUser, db }) {
      if (!currentUser) return [];

      const { rows } = await db.query(sql`
        SELECT chats.* FROM chats, chats_users
        WHERE chats.id = chats_users.chat_id
        AND chats_users.user_id = ${currentUser.id}
      `);
      return rows;
    },

    // pulls X chat room that current user is part of
    async chat(root, { chatId }, { currentUser, db }) {
      if (!currentUser) return null;

      const { rows } = await db.query(sql`
      SELECT chats.* FROM chats, chats_users
      WHERE chats_users.chat_id = ${chatId}
      AND chats.id = chats_users.chat_id
      AND chats_users.user_id = ${currentUser.id}
      `);
      return rows[0] ? rows[0] : null;
    },

    // return all users that are not current logged in user
    async users(root, args, { currentUser, db }) {
      if (!currentUser) return [];
      const { rows } = await db.query(sql`
      SELECT * FROM users WHERE users.id != ${currentUser.id}
      `);
      return rows;
    }
  },

  Mutation: {
    // returns current user from DB, if not found creates a new user
    async signUp(root, { name, username, password, passwordConfirm }, { db }) {
      validateLength("req.name", name, 3, 50);
      validateLength("req.username", username, 3, 18);
      validatePassword("req.password", password);

      if (password !== passwordConfirm) {
        throw Error("req.password and req.passwordConfirm don't match");
      }

      const exisitingUserQuery = await db.query(sql`
      SELECT * FROM users WHERE username = ${username}
      `);
      if (exisitingUserQuery.rows[0]) {
        throw Error("username already exists");
      }

      const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

      const createdUserQuery = await db.query(sql`
      INSERT INTO users(password, picture, username, name)
      VALUES(${passwordHash}, '', ${username}, ${name})
      RETURNING *
      `);

      const user = createdUserQuery.rows[0];

      return user;
    },

    // finds all users with current user username, compares password, and responds with cookie
    async signIn(root, { username, password }, { db, res }) {
      const { rows } = await db.query(sql`
        SELECT * FROM users WHERE username = ${username}
      `);
      const user = rows[0];

      if (!user) {
        throw new Error("user not found");
      }

      const passwordsMatch = bcrypt.compareSync(password, user.password);

      if (!passwordsMatch) {
        throw new Error("password is incorrect");
      }

      const authToken = jwt.sign(username, secret);

      res.cookie("authToken", authToken, { maxAge: expiration });

      return user;
    },

    // adds message to the db, publishes messageAdded subscription
    async addMessage(root, { chatId, content }, { currentUser, pubsub, db }) {
      if (!currentUser) return null;

      const { rows } = await db.query(sql`
      INSERT INTO messages(chat_id, sender_user_id, content)
      VALUES(${chatId}, ${currentUser.id}, ${content})
      RETURNING *
      `);

      const messageAdded = rows[0];

      pubsub.publish("messageAdded", {
        messageAdded
      });

      return messageAdded;
    },

    // creates a chat room between current user and a recipient, publish chat added subscription
    async addChat(root, { recipientId }, { currentUser, pubsub, db }) {
      if (!currentUser) return null;

      const { rows } = await db.query(sql`
        SELECT * FROM chats, (SELECT * FROM chats_users WHERE user_id = ${currentUser.id}) AS chats_of_current_user, chats_users
        WHERE chats_users.chat_id = chats_of_current_user.chat_id
        AND chats.id = chats_users.chat_id
        AND chats_users.user_id = ${recipientId}
      `);

      // If there is already a chat between these two users, return it
      if (rows[0]) {
        return rows[0];
      }

      try {
        await db.query("BEGIN");

        const { rows } = await db.query(sql`
          INSERT INTO chats
          DEFAULT VALUES
          RETURNING *
        `);

        const chatAdded = rows[0];

        await db.query(sql`
          INSERT INTO chats_users(chat_id, user_id)
          VALUES(${chatAdded.id}, ${currentUser.id})
        `);

        await db.query(sql`
          INSERT INTO chats_users(chat_id, user_id)
          VALUES(${chatAdded.id}, ${recipientId})
        `);

        await db.query("COMMIT");

        pubsub.publish("chatAdded", {
          chatAdded
        });

        return chatAdded;
      } catch (e) {
        await db.query("ROLLBACK");
        throw e;
      }
    },

    // removes chat of X chat Id that belongs to current user, publish chat removed pubsub
    async removeChat(root, { chatId }, { currentUser, pubsub, db }) {
      if (!currentUser) return null;

      try {
        await db.query("BEGIN");

        const { rows } = await db.query(sql`
        SELECT chats.* FROM chats, chats_users
        WHERE id = ${chatId}
        AND chats.id = chats_users.chat_id
        AND chats_users.user_id = ${currentUser.id}
        `);

        const chat = rows[0];

        if (!chat) {
          await db.query("ROLLBACK");
          return null;
        }

        await db.query(sql`
        DELETE FROM chats WHERE chats.id = ${chatId}
        `);

        pubsub.publish("chatRemoved", {
          chatRemoved: chat.id,
          targetChat: chat
        });

        await db.query("COMMIT");

        return chatId;
      } catch (e) {
        await db.query("ROLLBACK");
        throw e;
      }
    }
  },

  // subscription for messageAdded where user ID equals current user and chat ID equals ID of message.chatId
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator("messageAdded"),
        async (
          { messageAdded }: { messageAdded: Message },
          args,
          { currentUser }
        ) => {
          if (!currentUser) return false;

          const { rows } = await pool.query(sql`
        SELECT * FROM chats_users
        WHERE chat_id = ${messageAdded.chat_id}
        AND user_id = ${currentUser.id}
        `);

          return !!rows.length;
        }
      )
    },

    // subscription for chatAdded where subscribing user is the current user and chat subscribed to is the chat of created chatID
    chatAdded: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator("chatAdded"),
        async ({ chatAdded }: { chatAdded: Chat }, args, { currentUser }) => {
          if (!currentUser) return false;

          const { rows } = await pool.query(sql`
          SELECT * FROM chats_users
          WHERE chat_id = ${chatAdded.id}
          AND user_id = ${currentUser.id}
          `);
          return !!rows.length;
        }
      )
    },
    // subscription for removing a chat room for current user and chat room of chat id of removed chat room.
    chatRemoved: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator("chatRemoved"),
        async ({ targetChat }: { targetChat: Chat }, args, { currentUser }) => {
          if (!currentUser) return false;

          const { rows } = await pool.query(sql`
          SELECT * FROM chats_users
          WHERE chat_id = ${targetChat.id}
          AND user_id = ${currentUser.id}
          `);
          return !!rows.length;
        }
      )
    }
  }
};

export default resolvers;
