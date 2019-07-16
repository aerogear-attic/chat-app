import { importSchema } from "graphql-import";
// importing IResolvers to make sure resolvers handlers have right signatures - (obj, args, context, info)
import { makeExecutableSchema, IResolvers } from "graphql-tools";
import resolvers from "./resolvers";

const typeDefs = importSchema("schema/typeDefs.graphql");

export default makeExecutableSchema({
  resolvers: resolvers as IResolvers,
  typeDefs
});
