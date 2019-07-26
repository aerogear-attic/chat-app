import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";
import { pool } from "../../db";
import sql from "sql-template-strings";
import { MyContext } from "../../context";
import usersModule from "../../modules/users";
import chatsModule from "../../modules/chats/index";
import { GraphQLModule } from "@graphql-modules/core";

export const rootModule = new GraphQLModule({
  name: "root",
  imports: [usersModule, chatsModule]
});

describe("Query.getUsers", () => {
  it("should fetch all users except for the logged in user", async () => {
    const firstUserQuery = await pool.query(sql`
    SELECT * FROM users WHERE id = 1
    `);
    let currentUser = firstUserQuery.rows[0];
    const db = await pool.connect();
    const server = new ApolloServer({
      schema: rootModule.schema,
      context: async () => ({
        currentUser,
        db: await pool.connect()
      }),
      formatResponse: (res: any, { context }: { context: MyContext }) => {
        context.db.release();
        return res;
      }
    });

    const { query } = createTestClient(server);

    let res = await query({
      query: gql`
        query GetUsers {
          users {
            id
            name
            picture
          }
        }
      `
    });

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot();

    const secondUserQuery = await pool.query(sql`
    SELECT * FROM users WHERE id = '2'
    `);
    currentUser = secondUserQuery.rows[0];

    res = await query({
      query: gql`
        query GetUsers {
          users {
            id
            name
            picture
          }
        }
      `
    });

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot();
  });
});
