/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable no-console -- This directive is necessary to allow console logging for error handling */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text") as string;

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
      streamUsage: false,
      temperature: 0.8,
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
        Extract the restaurant menu items and their details in JSON format with precision and completeness.

        Output JSON Structure:
        {
          "menu": [
            {
              "name": "string",         // Exact menu item name
              "description": "string"   // Detailed description based on ingredient information
            }
          ],
          "notes": ["string"]           // Additional notes from the text
        }

        Extraction Guidelines:
        - Preserve original item order from source text
        - Create descriptive menu item details using available ingredient information
        - Ensure name and description accurately reflect source text

        Parsing Instructions:
        1. Carefully review entire text for menu items
        2. Extract precise names matching source text
        3. Craft detailed descriptions using ingredient insights
        4. Capture any supplementary notes verbatim

        Menu Content:
        ${text}
      `,
    });

    // const translatePrompt = ChatPromptTemplate.fromMessages([
    //   [
    //     "system",
    //     "Translate the following json object non-english values to English.",
    //   ],
    //   ["human", "{json}"],
    // ]);

    // const translateChain = translatePrompt.pipe(model).pipe(parser);

    // const translatedMenu = await translateChain.invoke({
    //   json: menu,
    // });

    return NextResponse.json({
      success: true,
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
