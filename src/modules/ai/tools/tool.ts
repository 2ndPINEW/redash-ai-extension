import { ChatCompletionTool } from "https://deno.land/x/openai@v4.67.1/resources/mod.ts";

export type AiTool = ChatCompletionTool & {
  // deno-lint-ignore no-explicit-any
  exec: (args: any) => Promise<string>;
};
