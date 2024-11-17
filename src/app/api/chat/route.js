import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req) {
  const { messages, model } = await req.json();

  let modelInstance;
  if (model === "claude-3.5-sonnet") {
    modelInstance = anthropic("claude-3-5-sonnet-20241022");
  } else {
    modelInstance = openai("gpt-4o-mini");
  }

  const result = streamText({
    model: modelInstance,
    messages,
  });

  return (await result).toDataStreamResponse();
}
