import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server-express";
import { server } from "../../server";
import { resetDb } from "../../db";
import { mockAuth } from "../mocks/auth.provider";

describe("Query.getUsers", () => {
  it("should fetch all users except for the logged in user", async () => {
    mockAuth(1);

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

    mockAuth(2);

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
