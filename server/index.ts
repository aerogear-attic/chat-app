import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import schema from "./schema";

const app = express();

app.use(cors());

app.use(bodyParser.json());

const server = new ApolloServer({ schema });

server.applyMiddleware({
  app,
  path: "/graphql"
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
