// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";

const openai = new OpenAI({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatResponse = OpenAI.Chat.Completions.ChatCompletion;

export async function imageToMarkdown(imageName: string): Promise<string> {
  const systemPrompt = `
  You are a helpful assistant that converts restaurant menu images to markdown text.
  Your task is to analyze the provided image of a restaurant menu and convert its contents into a well-structured markdown format.
  Ensure that the markdown text is clear, organized, and accurately represents the items and their descriptions from the menu image.
  `;

  const result = (await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `http://localhost:3000/uploads/${imageName}`,
            },
          },
        ],
      },
    ],
  })) as ChatResponse;

  return result.choices[0].message.content || "";
}
