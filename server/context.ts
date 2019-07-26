// ModuleContext allows for DI
import { ModuleContext } from "@graphql-modules/core";

// creating context that contains both pubsub & current user types that were applied to apollo server in index.ts

export type MyContext = ModuleContext;
