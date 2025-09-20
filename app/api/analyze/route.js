import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    // Get uploaded file from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    // Convert uploaded file to ArrayBuffer and then Buffer
    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const data = await pdf(dataBuffer);

    // Example: just returning text for now; you can call your AI functions here
    const text = data.text;

    // Return parsed text as JSON
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
