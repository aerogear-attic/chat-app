import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";
import { Message, Chat } from "../db";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

export type Chat = {
  __typename?: "Chat";
  id: Scalars["ID"];
  name: Scalars["String"];
  picture?: Maybe<Scalars["String"]>;
  lastMessage?: Maybe<Message>;
  messages: Array<Message>;
};

export type Message = {
  __typename?: "Message";
  id: Scalars["ID"];
  content: Scalars["String"];
  createdAt: Scalars["Date"];
};

export type Mutation = {
  __typename?: "Mutation";
  addMessage?: Maybe<Message>;
};

export type MutationAddMessageArgs = {
  chatId: Scalars["ID"];
  content: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  chats: Array<Chat>;
  chat?: Maybe<Chat>;
};

export type QueryChatArgs = {
  chatId: Scalars["ID"];
};

<<<<<<< HEAD
=======
export type Subscription = {
  __typename?: "Subscription";
  messageAdded: Message;
};

>>>>>>> fix: .gitignore, removing time zone from jest
export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  Chat: ResolverTypeWrapper<Chat>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Message: ResolverTypeWrapper<Message>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  Mutation: ResolverTypeWrapper<{}>;
<<<<<<< HEAD
=======
  Subscription: ResolverTypeWrapper<{}>;
>>>>>>> fix: .gitignore, removing time zone from jest
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  Chat: Chat;
  ID: Scalars["ID"];
  String: Scalars["String"];
  Message: Message;
  Date: Scalars["Date"];
  Mutation: {};
<<<<<<< HEAD
=======
  Subscription: {};
>>>>>>> fix: .gitignore, removing time zone from jest
  Boolean: Scalars["Boolean"];
};

export type ChatResolvers<
<<<<<<< HEAD
  ContextType = any,
=======
  ContextType = MyContext,
>>>>>>> fix: .gitignore, removing time zone from jest
  ParentType = ResolversParentTypes["Chat"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  lastMessage?: Resolver<
    Maybe<ResolversTypes["Message"]>,
    ParentType,
    ContextType
  >;
  messages?: Resolver<
    Array<ResolversTypes["Message"]>,
    ParentType,
    ContextType
  >;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type MessageResolvers<
<<<<<<< HEAD
  ContextType = any,
=======
  ContextType = MyContext,
>>>>>>> fix: .gitignore, removing time zone from jest
  ParentType = ResolversParentTypes["Message"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
};

export type MutationResolvers<
<<<<<<< HEAD
  ContextType = any,
=======
  ContextType = MyContext,
>>>>>>> fix: .gitignore, removing time zone from jest
  ParentType = ResolversParentTypes["Mutation"]
> = {
  addMessage?: Resolver<
    Maybe<ResolversTypes["Message"]>,
    ParentType,
    ContextType,
    MutationAddMessageArgs
  >;
};

export type QueryResolvers<
<<<<<<< HEAD
  ContextType = any,
=======
  ContextType = MyContext,
>>>>>>> fix: .gitignore, removing time zone from jest
  ParentType = ResolversParentTypes["Query"]
> = {
  chats?: Resolver<Array<ResolversTypes["Chat"]>, ParentType, ContextType>;
  chat?: Resolver<
    Maybe<ResolversTypes["Chat"]>,
    ParentType,
    ContextType,
    QueryChatArgs
  >;
};

<<<<<<< HEAD
export type Resolvers<ContextType = any> = {
=======
export type SubscriptionResolvers<
  ContextType = MyContext,
  ParentType = ResolversParentTypes["Subscription"]
> = {
  messageAdded?: SubscriptionResolver<
    ResolversTypes["Message"],
    ParentType,
    ContextType
  >;
};

export type Resolvers<ContextType = MyContext> = {
>>>>>>> fix: .gitignore, removing time zone from jest
  Chat?: ChatResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
<<<<<<< HEAD
=======
  Subscription?: SubscriptionResolvers<ContextType>;
>>>>>>> fix: .gitignore, removing time zone from jest
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
<<<<<<< HEAD
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
=======
export type IResolvers<ContextType = MyContext> = Resolvers<ContextType>;
>>>>>>> fix: .gitignore, removing time zone from jest
