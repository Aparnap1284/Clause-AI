import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import pdf from "pdf-parse";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    // Read uploaded file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from PDF
    const data = await pdf(buffer);
    const textContent = data.text;

    if (!textContent.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    // Initialize Google GenAI client
    const client = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY
    });

    // Prepare prompt for AI
    const prompt = `
You are ClauseAI, a professional legal AI assistant.
Analyze the following legal document text. Extract key clauses, risks, and summarize clearly:

"${textContent}"
    `;

    // Generate content using the correct method for the latest SDK
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash", // Use a valid Gemini model
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    // Extract the generated text
    const output = response?.results?.[0]?.content?.[0]?.text || "No output generated";

    return NextResponse.json({ result: output });

  } catch (error) {
    console.error("PDF Analyze Error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF", details: error.message },
      { status: 500 }
    );
  }
}
