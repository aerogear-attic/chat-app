import { gql } from "apollo-server-express";
import sql from "sql-template-strings";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret, expiration } from "../../env";
import { validateLength, validatePassword } from "../../validators";
import { Resolvers } from "../../types/graphql";
import { GraphQLModule } from "@graphql-modules/core";
import { pool } from "../../db";
import cookie from "cookie";
import commonModule from "../common";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    picture: String
  }
  extend type Query {
    me: User
    users: [User!]!
  }
  extend type Mutation {
    signIn(username: String!, password: String!): User
    signUp(
      name: String!
      username: String!
      password: String!
      passwordConfirm: String!
    ): User
  }
`;

const resolvers: Resolvers = {
  Query: {
    // returns current logged in user
    me(root, args, { currentUser }) {
      return currentUser || null;
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
    }
  }
};

export default new GraphQLModule({
  name: "users",
  typeDefs,
  resolvers,
  imports: () => [commonModule],
  async context(session) {
    let currentUser;

    // access the requested object
    let req = session.connection
      ? session.connection.context.request
      : session.req;

    // it's subscription
    if (session.connection) {
      req.cookies = cookie.parse(req.headers.cookie || "");
    }

    if (req.cookies.authToken) {
      const username = jwt.verify(req.cookies.authToken, secret) as string;

      if (username) {
        const { rows } = await pool.query(
          sql`SELECT * FROM users WHERE username = ${username}
                `
        );
        currentUser = rows[0];
      }
    }
    return {
      currentUser
    };
  }
});
