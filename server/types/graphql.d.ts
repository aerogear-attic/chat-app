import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";
import { User, Message, Chat } from "../db";
import { MyContext } from "../context";
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
  name?: Maybe<Scalars["String"]>;
  picture?: Maybe<Scalars["String"]>;
  lastMessage?: Maybe<Message>;
  messages: Array<Message>;
  participants: Array<User>;
};

export type Message = {
  __typename?: "Message";
  id: Scalars["ID"];
  content: Scalars["String"];
  createdAt: Scalars["Date"];
  sender?: Maybe<User>;
  recipient?: Maybe<User>;
  isMine: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  signIn?: Maybe<User>;
  signUp?: Maybe<User>;
  addMessage?: Maybe<Message>;
  addChat?: Maybe<Chat>;
  removeChat?: Maybe<Scalars["ID"]>;
};

export type MutationSignInArgs = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type MutationSignUpArgs = {
  name: Scalars["String"];
  username: Scalars["String"];
  password: Scalars["String"];
  passwordConfirm: Scalars["String"];
};

export type MutationAddMessageArgs = {
  chatId: Scalars["ID"];
  content: Scalars["String"];
};

export type MutationAddChatArgs = {
  recipientId: Scalars["ID"];
};

export type MutationRemoveChatArgs = {
  chatId: Scalars["ID"];
};

export type Query = {
  __typename?: "Query";
  chats: Array<Chat>;
  chat?: Maybe<Chat>;
  users: Array<User>;
  me?: Maybe<User>;
};

export type QueryChatArgs = {
  chatId: Scalars["ID"];
};

export type Subscription = {
  __typename?: "Subscription";
  messageAdded: Message;
  chatAdded: Chat;
  chatRemoved: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name: Scalars["String"];
  picture?: Maybe<Scalars["String"]>;
};

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
  User: ResolverTypeWrapper<User>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  Chat: Chat;
  ID: Scalars["ID"];
  String: Scalars["String"];
  Message: Message;
  Date: Scalars["Date"];
  User: User;
  Boolean: Scalars["Boolean"];
  Mutation: {};
  Subscription: {};
};

export type ChatResolvers<
  ContextType = MyContext,
  ParentType = ResolversParentTypes["Chat"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
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
  participants?: Resolver<
    Array<ResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type MessageResolvers<
  ContextType = MyContext,
  ParentType = ResolversParentTypes["Message"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  recipient?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  isMine?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = MyContext,
  ParentType = ResolversParentTypes["Mutation"]
> = {
  signIn?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    MutationSignInArgs
  >;
  signUp?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    MutationSignUpArgs
  >;
  addMessage?: Resolver<
    Maybe<ResolversTypes["Message"]>,
    ParentType,
    ContextType,
    MutationAddMessageArgs
  >;
  addChat?: Resolver<
    Maybe<ResolversTypes["Chat"]>,
    ParentType,
    ContextType,
    MutationAddChatArgs
  >;
  removeChat?: Resolver<
    Maybe<ResolversTypes["ID"]>,
    ParentType,
    ContextType,
    MutationRemoveChatArgs
  >;
};

export type QueryResolvers<
  ContextType = MyContext,
  ParentType = ResolversParentTypes["Query"]
> = {
  chats?: Resolver<Array<ResolversTypes["Chat"]>, ParentType, ContextType>;
  chat?: Resolver<
    Maybe<ResolversTypes["Chat"]>,
    ParentType,
    ContextType,
    QueryChatArgs
  >;
  users?: Resolver<Array<ResolversTypes["User"]>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = MyContext,
  ParentType = ResolversParentTypes["Subscription"]
> = {
  messageAdded?: SubscriptionResolver<
    ResolversTypes["Message"],
    ParentType,
    ContextType
  >;
  chatAdded?: SubscriptionResolver<
    ResolversTypes["Chat"],
    ParentType,
    ContextType
  >;
  chatRemoved?: SubscriptionResolver<
    ResolversTypes["ID"],
    ParentType,
    ContextType
  >;
};

export type UserResolvers<
  ContextType = MyContext,
  ParentType = ResolversParentTypes["User"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type Resolvers<ContextType = MyContext> = {
  Chat?: ChatResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MyContext> = Resolvers<ContextType>;
