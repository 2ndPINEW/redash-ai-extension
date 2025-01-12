import { Client } from 'postgres';
import { env } from "../../utils/env.ts";

export class DatabaseService {
  private client: Client;

  constructor() {
    this.client = new Client({
      hostname: env.db.host,
      port: parseInt(env.db.port!),
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
    });
  }

  async connect() {
    await this.client.connect();
  }

  async queryArray(query: string) {
    try {
      return await this.client.queryArray(query)
    } catch (e) {
      console.error(e)
      return { rows: JSON.stringify(e) }
    }
  }

  async queryObject(query: string) {
    return await this.client.queryObject(query)
  }

  async end() {
    await this.client.end();
  }
}
