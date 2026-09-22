 import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { inputData } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert e-commerce dark pattern and hidden fee scanner.
      Analyze the following checkout text or URL for deceptive UI designs, sneaky pre-checked boxes, hidden recurring fees, and fake urgency.

      Input: "${inputData}"

      Respond STRICTLY in JSON format matching this schema:
      {
        "site_name": "Inferred or extracted site name",
        "threat_score": 85,
        "flagged_patterns": [
          {
            "type": "Pattern Name (e.g. Sneaky Pre-checked Box, Drip Pricing)",
            "severity": "High",
            "description": "Explanation of deceptive element"
          }
        ],
        "hidden_fee_summary": "Summary of hidden charges"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean markdown backticks if present
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 });
  }
}