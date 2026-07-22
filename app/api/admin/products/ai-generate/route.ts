import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { title, category, metal, purity, diamond, imageBase64 } = await request.json();

    // Initialize Gemini SDK with the API key from environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    
    // Revert to gemini-1.5-flash which is highly stable and fully multi-modal
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert luxury jewelry copywriter.
      Write an SEO-optimized, highly emotional, and luxurious product description in HTML format for the following product: "${title || 'Exclusive Jewel'}".
      
      ${imageBase64 ? 'CRITICAL INSTRUCTION: I have provided an image of the actual jewelry piece. You MUST deeply analyze the image to describe the sheer beauty of the design, the artistic curves, and the visual aesthetic.' : ''}

      CRITICAL RULES for this description:
      1. STRICT LENGTH LIMIT: The entire description MUST be UNDER 100 words. Keep it incredibly concise and impactful.
      2. FOCUS exclusively on the visual design detailing (based on the image) and the title of the ring.
      3. DO NOT mention specific data points like metal colors (yellow/white gold), gold purity (14k/18k), or diamond quality (VVS/FG). This description will be shared across all variants, so it must be universally applicable.
      4. Highlight human desires, romance, and gifting (e.g., a perfect gift for a fiancé, family member, or loved one).
      5. Return ONLY the HTML code (no markdown code blocks, no head/body tags, just the raw HTML).
      6. Use elegant paragraphs <p> and bold tags <strong> for emphasis. Do NOT use bullet points for specifications.
    `;

    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      });
    }

    const result = await model.generateContent(parts);
    let htmlContent = result.response.text();
    
    // Clean up any markdown code blocks the model might accidentally return
    htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ description: htmlContent });

  } catch (error: any) {
    console.error('AI Generation Error:', error.message || error);
    // Fallback if API key is invalid or rate limited
    const fallbackHtml = `
      <p>This magnificent <strong>${title || 'Jewelry Piece'}</strong> is a true masterpiece of elegant design.</p>
      <p>Crafted with meticulous attention to detail, its brilliant silhouette is perfect for celebrating life's most precious moments. Whether as a romantic gift for a fiancé, a timeless treasure for a family member, or a well-deserved indulgence for yourself, its radiant beauty captivates at first glance.</p>
      <p><em>Experience unparalleled luxury that speaks straight to the heart.</em></p>
    `;
    return NextResponse.json({ description: fallbackHtml.trim() });
  }
}
