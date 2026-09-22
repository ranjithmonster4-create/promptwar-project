import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { inputData } = await req.json();

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 });
  }
}
