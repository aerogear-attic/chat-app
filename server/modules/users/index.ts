import { gql } from "apollo-server-express";
import { Resolvers } from "../../types/graphql";
import { GraphQLModule } from "@graphql-modules/core";
import commonModule from "../common";
import { Users } from "./users.provider";
import { Auth } from "./auth.provider";

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
    me(root, args, { injector }) {
      return injector.get(Auth).currentUser();
    },

    // return all users that are not current logged in user
    async users(root, args, { injector }) {
      const currentUser = await injector.get(Auth).currentUser();
      if (!currentUser) return [];
      return injector.get(Users).findAllExcept(currentUser.id);
    }
  },
  Mutation: {
    // finds all users with current user username, compares password, and responds with cookie
    async signIn(root, { username, password }, { injector }) {
      return injector.get(Auth).signIn({ username, password });
    },

    // returns current user from DB, if not found creates a new user
    async signUp(
      root,
      { name, username, password, passwordConfirm },
      { injector }
    ) {
      return injector
        .get(Auth)
        .signUp({ name, username, password, passwordConfirm });
    }
  }
};

export default new GraphQLModule({
  name: "users",
  typeDefs,
  resolvers,
  imports: () => [commonModule],
  providers: () => [Users, Auth]
});
