/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable no-console -- This directive is necessary to allow console logging for error handling */
import "pdf-parse";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const text = formData.get("text") as string;

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      streamUsage: false,
      temperature: 0.5,
      verbose: false,
    });

    const parser = new JsonOutputParser<Record<string, unknown>>();

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "Answer the user query. Wrap the output in a JSON object."],
      ["human", "{query}"],
    ]);

    const chain = prompt.pipe(model).pipe(parser);

    const menu = await chain.invoke({
      query: `
      Extract the restaurant menu items and their details in JSON format.

      The output should be a JSON object with the following structure:
      {
        "menu": [
          {
            "name": "string",
            "description": "string",
          }
        ],
        notes: ["string"]
      }

      !Notes:
      - The menu items should be in the same order as they appear in the text.
      - The notes should be in the same order as they appear in the text.
      - The notes should be in the same language as the text.

      Menu Content:
      
      ${text}
      `,
    });

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        path: filePath,
      },
      formatted: menu,
    });
  } catch (error) {
    console.log("🚀 ~ file: route.ts:35 ~ POST ~ error", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
