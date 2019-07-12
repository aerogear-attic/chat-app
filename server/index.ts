import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import schema from "./schema";

const app = express();

//middleware - cors to allow cross origin requests(not local host only)
app.use(cors());

//middleware - adding parser to that parses incoming request to middleware
app.use(bodyParser.json());

//inject schema into new ApolloServer
const server = new ApolloServer({ schema });

server.applyMiddleware({
  app,
  path: "/graphql"
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
