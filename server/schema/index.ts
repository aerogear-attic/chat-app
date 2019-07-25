// importing IResolvers to make sure resolvers handlers have right signatures - (obj, args, context, info)
import { makeExecutableSchema, IResolvers } from "graphql-tools";

import { merge } from "lodash";
import * as commonModule from "../modules/common";
import * as usersModule from "../modules/users";
import * as chatsModule from "../modules/chats";

export default makeExecutableSchema({
  resolvers: merge(
    {},
    commonModule.resolvers,
    usersModule.resolvers,
    chatsModule.resolvers
  ) as IResolvers,
  typeDefs: [commonModule.typeDefs, usersModule.typeDefs, chatsModule.typeDefs]
});
