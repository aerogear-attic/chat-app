import { Injectable, ProviderScope } from "@graphql-modules/di";
import { OnResponse } from "@graphql-modules/core";
import { Pool, PoolClient } from "pg";

// setting session scope as it is only required when request is send
@Injectable({
  scope: ProviderScope.Session
})

// exporting Db
export class Database implements OnResponse {
  private instance: PoolClient;
  constructor(private pool: Pool) {}
  async onRequest() {
    this.instance = await this.pool.connect();
  }
  onResponse() {
    if (this.instance) {
      this.instance.release();
    }
  }
  async getClient() {
    return this.instance;
  }
}
