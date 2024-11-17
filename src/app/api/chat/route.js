import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req) {
  const { messages, model } = await req.json();

  const result = streamText({
    model: openai(model),
    messages,
  });

  return (await result).toDataStreamResponse();
}
