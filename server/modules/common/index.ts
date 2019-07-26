import { gql } from "apollo-server-express";
import { GraphQLDateTime } from "graphql-iso-date";
import { Resolvers } from "../../types/graphql";
import { GraphQLModule } from "@graphql-modules/core";
import { pool } from "../../db";
import { Pool } from "pg";
import { Database } from "./database.provider";
import { ProviderScope } from "@graphql-modules/di";
import { PubSub } from "./pubsub.provider";

// Implementation of postgres notify/listen for PubSub mechanism, as apollo pubsub is not for production usage
// require instead of import from as graphql-postgres-subscription does not support typeScript
const { PostgresPubSub } = require("graphql-postgres-subscriptions");

const typeDefs = gql`
  scalar DateTime
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
  DateTime: GraphQLDateTime
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
  providers: () => [
    {
      provide: Pool,
      useValue: pool
    },
    {
      provide: PubSub,
      scope: ProviderScope.Application,
      useValue: pubsub
    },
    Database
  ]
});
