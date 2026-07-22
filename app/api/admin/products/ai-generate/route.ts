import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { title, category, metal, purity, diamond } = await request.json();

    // Initialize Gemini SDK with the API key from environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    
    // We are using 'gemini-1.5-flash' because it is highly capable, fast, 
    // and is completely free and widely available under the standard Google AI Studio tier limits.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert copywriter for a high-end luxury B2B jewelry brand.
      Write an SEO-optimized, luxurious product description in HTML format for the following product:
      - Title: ${title || 'Exclusive Jewel'}
      - Metal: ${purity || ''} ${metal || 'Precious Metal'}
      - Diamonds: ${diamond || 'VVS-FG'}
      - Category: ${category || 'Fine Jewellery'}

      Return ONLY the HTML code (no markdown code blocks, no head/body tags, just the raw HTML).
      Use elegant paragraphs <p>, bold tags <strong> for emphasis, and a styled unordered list <ul><li> for the specifications.
    `;

    const result = await model.generateContent(prompt);
    let htmlContent = result.response.text();
    
    // Clean up any markdown code blocks the model might accidentally return
    htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ description: htmlContent });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI description' }, { status: 500 });
  }
}
