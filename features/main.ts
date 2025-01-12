import { ChatCompletionMessageParam } from "https://deno.land/x/openai@v4.67.1/resources/mod.ts";
import { inject } from "../src/libs/injector.ts";
import { AiService } from "../src/modules/ai/ai.service.ts";
import { queryDatabaseTool } from "../src/modules/ai/tools/db-query.tool.ts";
import { getGoogleSearchResultTool } from "../src/modules/ai/tools/google-search.tool.ts";
import { getImageSummaryTool } from "../src/modules/ai/tools/image-summary.tool.ts";
import { schema } from "./schema.ts";

const main = async (messages?: ChatCompletionMessageParam[]) => {
  const aiService = inject(AiService);
  const aiPrompt = prompt("何を分析したいですか？: ");

  if (!aiPrompt) {
    console.log("Goodbye!");
    return;
  }

  const messagesWithPrompt: ChatCompletionMessageParam[] = messages
    ? [...messages, { role: "user", content: aiPrompt }]
    : [
        {
          role: "system",
          content: `あなたはデータ分析のプロです。ユーザーが求めたクエリを書いて、実行してください。
エラーが発生した場合はエラー内容を修正してください。
以下のスキーマを参考にしてください。
${schema}

テーブル名やカラム名は snake_case です。`,
        },
        {
          role: "user",
          content: aiPrompt,
        },
      ];

  const response = await aiService.executePrompt(messagesWithPrompt, [
    getGoogleSearchResultTool,
    getImageSummaryTool,
    queryDatabaseTool,
  ]);

  console.log('---------------------------------');
  console.log(response.completion);
  console.log('---------------------------------');

  await main(response.messages);
};

main();
