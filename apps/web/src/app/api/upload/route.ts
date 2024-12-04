/* eslint-disable no-console -- This directive is necessary to allow console logging for error handling */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        path: filePath,
      },
    });
  } catch (error) {
    console.log("🚀 ~ file: route.ts:35 ~ POST ~ error", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
