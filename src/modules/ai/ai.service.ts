import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
} from "https://deno.land/x/openai@v4.67.1/resources/mod.ts";
import { env } from "../../utils/env.ts";
import { AiTool } from "./tools/tool.ts";

export class AiService {
  client = new OpenAI({
    apiKey: env.openAI.apiKey,
  });
  
  executePrompt = async (
    messages: ChatCompletionMessageParam[] = [],
    tools: Array<AiTool>,
    model: string = "gpt-4o"
  ): Promise<{
    completion: string;
    messages: ChatCompletionMessageParam[];
  }> => {
    console.log("executePrompt", messages);
    const completion = await this.client.chat.completions.create({
      model,
      messages,
      tools: tools,
    });

    if (completion.choices[0]!.finish_reason !== "tool_calls") {
      return {
        completion: completion.choices[0].message.content ?? "",
        messages: [...messages, completion.choices[0].message],
      }
    }
  
    const message = completion.choices[0].message;
    if (message.tool_calls) {
      const name = message.tool_calls[0].function.name;
      const tool = tools.find((tool) => tool.function.name === name);
      if (tool) {
        console.log("Calling tool", name);
        const result = await tool.exec(
          JSON.parse(message.tool_calls[0].function.arguments)
        );
        return this.executePrompt([
          ...messages,
          {
            role: "assistant",
            content: `I'm calling the ${name} function with the following arguments: ${message.tool_calls[0].function.arguments}`,
          },
          {
            role: "function",
            content: result,
            name: name,
          },
        ], tools);
      } else {
        throw new Error("Unexpected tool call");
      }
    } else {
      throw new Error("Unexpected completion");
    }
  };
  
}