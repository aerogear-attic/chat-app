import { importSchema } from 'graphql-import';
//maps makeExecSchema to resolvers and typeDefs and allows for import in main app
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = importSchema('schema/typeDefs.graphql')

//return schema with assigned resolvers and type definitions
export default makeExecutableSchema({ resolvers, typeDefs })