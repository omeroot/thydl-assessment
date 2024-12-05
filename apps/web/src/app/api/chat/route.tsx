/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages, text } = await req.json();

  const systemPrompt = `
  You are a helpful assistant for helping customers with the restaurant menu.
  Your task is to provide accurate and detailed information about the menu items based on the provided image of the restaurant menu.
  Ensure that the information is clear, organized, and accurately represents the items and their descriptions from the menu image.
  Follow these rules:
  - Use appropriate language to describe the menu items, including names and descriptions.
  - Group items under relevant categories if they exist.
  - Ensure the output is easy to read and understand.
  - Do not include any irrelevant information or artifacts from the image.

  !! Answer in the same language as the user's message.
  !! Don't use markdown.

  Menu:
  ${text}
  `;

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
