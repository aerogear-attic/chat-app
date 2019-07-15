import { ApolloServer, PubSub } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import http from "http";
import schema from "./schema";

const app = express();

app.use(cors());

app.use(bodyParser.json());

const pubsub = new PubSub();
const server = new ApolloServer({
  schema,
  context: () => ({ pubsub })
});

server.applyMiddleware({
  app,
  path: "/graphql"
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
