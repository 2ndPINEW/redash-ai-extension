import { inject } from "../../../libs/injector.ts";
import { AiService } from "../ai.service.ts";
import { AiTool } from "./tool.ts";

const client = inject(AiService).client;

export const getImageSummaryTool: AiTool = {
  type: "function",
  function: {
    name: "getImageSummary",
    description: "写真の情報を取得する",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "写真のURL",
        },
      },
      required: ["url"],
    },
  },
  exec: async ({ url }: { url: string }) => {
    const result = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "この写真がどのような写真か詳しく説明してください",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: url,
                detail: "high",
              },
            },
          ],
        },
      ],
    });

    if (!result.choices[0].message.content) {
      throw new Error("Unexpected completion");
    }

    return result.choices[0].message.content;
  },
};
