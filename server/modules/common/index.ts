import { gql } from "apollo-server-express";
import { GraphQLDateTime } from "graphql-iso-date";
import { Resolvers } from "../../types/graphql";
import { GraphQLModule } from "@graphql-modules/core";
import { pool } from "../../db";

// Implementation of postgres notify/listen for PubSub mechanism, as apollo pubsub is not for production usage
// require instead of import from as graphql-postgres-subscription does not support typeScript
const { PostgresPubSub } = require("graphql-postgres-subscriptions");

const typeDefs = gql`
  scalar Date
  type Query {
    _dummy: Boolean
  }
  type Mutation {
    _dummy: Boolean
  }
  type Subscription {
    _dummy: Boolean
  }
`;
const resolvers: Resolvers = {
  Date: GraphQLDateTime
};

// creating postgres pubsub event listener
const pubsub = new PostgresPubSub({
  host: "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: "testuser",
  password: "testpassword",
  database: "whatsapp"
});

export default new GraphQLModule({
  name: "common",
  typeDefs,
  resolvers,
  async context({ res, connection }) {
    let db;
    if (!connection) {
      db = await pool.connect();
    }
    return {
      pubsub,
      res,
      db
    };
  }
});
