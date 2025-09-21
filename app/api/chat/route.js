import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Try different model names
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const prompt = `
IMPORTANT: You are ClauseAI, a legal document assistant. The user has uploaded a document but you CANNOT access its content. 
You MUST provide general legal advice without referencing specific document content.

USER QUESTION: ${message}

RESPONSE REQUIREMENTS:
1. Provide helpful legal information based on standard legal practices
2. Do NOT ask for document content - you don't have access to it
3. Focus on general legal principles and common scenarios
4. Be specific and provide actionable advice
5. Mention when professional legal counsel should be consulted

If the question is about a specific clause type, explain:
- What that clause typically contains
- Why it's important
- Common issues to watch for
- Negotiation points

Provide practical, useful legal guidance.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    return NextResponse.json({ reply: output });
    
  } catch (error) {
    console.error("Chat error:", error);
    
    // Context-aware fallback responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('danger')) {
      return NextResponse.json({ 
        reply: "Common risky clauses in legal documents include: 1) Vague termination terms, 2) One-sided liability provisions, 3) Unclear payment terms, 4) Overly broad confidentiality clauses, and 5) Unfair dispute resolution clauses. I can explain any of these in detail if helpful." 
      });
    } 
    else if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
      return NextResponse.json({ 
        reply: "When reviewing legal documents, focus on: identifying all parties and their obligations, understanding payment terms, noting termination conditions, checking liability limitations, and reviewing dispute resolution methods. Would you like me to elaborate on any specific area?" 
      });
    }
    else {
      return NextResponse.json({ 
        reply: "I'm ClauseAI, your legal document assistant. I can help explain legal terms, identify common risk areas, and provide guidance on document review. What specific aspect of legal documents would you like to discuss?" 
      });
    }
  }
}