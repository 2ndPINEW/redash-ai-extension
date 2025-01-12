import { env } from "../../../utils/env.ts";
import { AiTool } from "./tool.ts";
import { google } from "googleapis";

export const getGoogleSearchResultTool: AiTool = {
  type: "function",
  function: {
    name: "getGoogleSearchResult",
    description: "Google検索結果を取得する",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "検索キーワード",
        },
      },
      required: ["keyword"],
    },
  },
  exec: async ({ keyword }: { keyword: string }) => {
    if (keyword === "") {
      throw new Error("キーワードは必須です。");
    }
  
    const customSearch = google.customsearch("v1");
    const result = await customSearch.cse.list({
      auth: env.google.customSearch.apiKey,
      cx: env.google.customSearch.id,
      q: keyword,
    });
  
    if (result.data.items == null) {
      throw new Error("何も見つかりませんでした。");
    }
  
    // 上位3件のタイトル、URL、概要を取得する
    const res = result.data.items.slice(0, 3).map((item: any) => ({
      title: item.title ?? "",
      url: item.link ?? "",
      overview: item.snippet ?? "",
    }));
    return JSON.stringify(res);
  },
};