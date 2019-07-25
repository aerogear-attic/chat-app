import { ApolloServer } from "apollo-server-express";
import { app } from "./app";
import { GraphQLModule } from "@graphql-modules/core";
import usersModule from "./modules/users";
import chatsModule from "./modules/chats";
import { origin, port, secret } from "./env";
import http from "http";
import { MyContext } from "./context";
import { UnsplashApi } from "./schema/unsplash.api";

export const rootModule = new GraphQLModule({
  name: "root",
  imports: [usersModule, chatsModule]
});

const server = new ApolloServer({
  schema: rootModule.schema,
  context: rootModule.context,
  subscriptions: rootModule.subscriptions,
  // terminating db connection
  formatResponse: (res: any, { context }: { context: MyContext }) => {
    context.db.release();
    return res;
  },
  // insterting data source into the context as dataSources so its accessible for resolvers
  dataSources: () => ({
    unsplashApi: new UnsplashApi()
  })
});
// enabling server to receive and set cookies and use of credentials sent in http get header
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { credentials: true, origin }
});

// once middleware was applied to the apollo server ( app and graphql ) applying http server for express app
const httpServer = http.createServer(app);

// installing subscription handlers on httpServer
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
