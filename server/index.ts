import { ApolloServer, PubSub } from "apollo-server-express";
import schema from "./schema";
import { app } from "./app";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { origin, port, secret } from "./env";

// importing http protocol that will be used in order to install subscription handlers
import http from "http";

// importing users from mock db to mock a logged in user with id 1 # line 19 & adding user with user ID 1 to context so it can be read by resolvers
import { users } from "./db";

// creating pubsub event listener
const pubsub = new PubSub();

// applying event listener and current "logged in" user to the context of apollo server
const server = new ApolloServer({
  schema,
  context: (session: any) => {
    // Access the request object
    let req = session.connection
      ? session.connection.context.request
      : session.req;

    // It's subscription
    if (session.connection) {
      req.cookies = cookie.parse(req.headers.cookie || "");
    }

    let currentUser;
    if (req.cookies.authToken) {
      const username = jwt.verify(req.cookies.authToken, secret) as string;
      currentUser = username && users.find(u => u.username === username);
    }

    return {
      currentUser,
      pubsub,
      res: session.res
    };
  },
  subscriptions: {
    onConnect(params, ws, ctx) {
      // pass the request object to context
      return {
        request: ctx.request
      };
    }
  }
});

server.applyMiddleware({
  app,
  path: "/graphql"
});

// once middleware was applied to the apollo server ( app and graphql ) applying http server for express app
const httpServer = http.createServer(app);

// installing subscription handlers on httpServer
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
