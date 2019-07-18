import { PubSub } from "apollo-server-express";
import { User } from "./db";
import { Response } from "express";

// creating context that contains both pubsub & current user types that were applied to apollo server in index.ts

export type MyContext = {
  pubsub: PubSub;
  currentUser: User;
  res: Response;
};
