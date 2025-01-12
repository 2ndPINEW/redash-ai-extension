import { inject } from "../../../libs/injector.ts";
import { DatabaseService } from "../../infrastructure/database.service.ts";
import { AiTool } from "./tool.ts";

export const queryDatabaseTool: AiTool = {
  type: "function",
  function: {
    name: "queryDatabase",
    description: "PostgreSQLデータベースに対してクエリを実行する",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "実行するSQLクエリ",
        },
      },
      required: ["query"],
    },
  },
  exec: async ({ query }: { query: string }) => {
    if (query === "") {
      throw new Error("クエリは必須です。");
    }

    const db = inject(DatabaseService);
    await db.connect();
    const result = await db.queryArray(query);
    await db.end();
    return JSON.stringify(result.rows, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
  },
};
