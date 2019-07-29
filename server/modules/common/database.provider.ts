import { Injectable, ProviderScope } from "@graphql-modules/di";
import { OnResponse } from "@graphql-modules/core";
import { Pool, PoolClient, QueryResult } from "pg";
import { SQLStatement } from "sql-template-strings";
// implementing dataloader to turn equivalent requests into a single execution
import Dataloader from "dataloader";

// setting session scope as it is only required when request is send
@Injectable({
  scope: ProviderScope.Session
})

// exporting Db
export class Database implements OnResponse {
  private instance: PoolClient;
  private loader: Dataloader<string | SQLStatement, QueryResult>;

  constructor(private pool: Pool) {
    this.loader = new Dataloader(
      queries =>
        Promise.all(
          queries.map(async query => {
            const db = await this.getClient();
            return db.query(query);
          })
        ),
      {
        // produces cache key for a given load key
        cacheKeyFn: (key: string | SQLStatement) => {
          let id: string;

          if (typeof key === "string") {
            id = key;
          } else {
            id = key.text + " - " + JSON.stringify(key.values);
          }

          return id;
        },
        // disables batching as SQL statements need to be executed sequentially
        batch: false
      }
    );
  }
  async onRequest() {
    this.instance = await this.pool.connect();
  }
  onResponse() {
    if (this.instance) {
      this.instance.release();
    }
  }
  private getClient() {
    return this.instance;
  }

  query(query: SQLStatement | string) {
    return this.loader.load(query);
  }
}
