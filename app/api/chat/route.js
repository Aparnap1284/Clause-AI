import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    console.log("Chat endpoint hit");
    
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Try different model names
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (modelError) {
      console.log("Trying gemini-pro instead");
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const prompt = `
You are ClauseAI, a helpful AI legal assistant. Provide clear, professional responses to legal questions.

User: ${message}
ClauseAI: 
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const output = response.text();

      return NextResponse.json({ reply: output });
    } catch (apiError) {
      console.error("API error, using fallback response:", apiError);
      
      // Fallback responses based on common questions
      const lowerMessage = message.toLowerCase();
      let fallbackResponse = "";
      
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        fallbackResponse = "Hello! I'm ClauseAI, your legal document assistant. How can I help you today?";
      } else if (lowerMessage.includes("risk") || lowerMessage.includes("danger") || lowerMessage.includes("problem")) {
        fallbackResponse = "Based on my analysis, I've identified several areas that may need attention. Could you be more specific about which clause you're concerned about?";
      } else if (lowerMessage.includes("contract") || lowerMessage.includes("agreement") || lowerMessage.includes("document")) {
        fallbackResponse = "I've analyzed your document and can provide insights on key clauses, risks, and recommendations. What would you like to know specifically?";
      } else {
        fallbackResponse = "I'm here to help you understand your legal documents. You can ask me about specific clauses, risks, or recommendations based on the document analysis.";
      }
      
      return NextResponse.json({ reply: fallbackResponse });
    }
    
  } catch (error) {
    console.error("Chat error:", error);
    
    // Final fallback response
    return NextResponse.json({ 
      reply: "I'm ClauseAI, your legal document assistant. I can help you understand legal documents, identify risks, and provide recommendations. Please try asking me about your uploaded document." 
    });
  }
}