import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Initialize Gemini SDK with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    
    // We use gemini-2.0-flash for multimodal vision tasks as it has a fresh quota bucket
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    // Convert the file to generative part
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type
      }
    };

    const prompt = `
      You are a Master Gemologist and API Automation Architect, tasked with a critical role in ensuring the accuracy and efficiency of our luxury Indian D2C brand's jewelry catalog. Your expertise lies in meticulously analyzing high-definition jewelry images to precisely identify the primary base metal color and the camera view angle. You are not just an analyst; you are an automation architect, meaning your output must be perfectly structured for backend systems.

      Your primary objective is to classify the metal color into one of three categories: Yellow Gold, White Gold, or Rose Gold. This classification must be based solely on the inherent hues of the metal itself, and you must be vigilant in ignoring any visual distractions. Specifically, you will strictly ignore the colors of any gemstones, any studio lighting glares that create bright white spots, and any deep shadows that obscure the true metal tone.
      
      You must also detect the View Angle of the image to assist our automated sorting systems.

      ---
      ## Analysis Parameters
      
      **Focus Areas:**
      *   Analyze the metal band (shank), prongs, and settings.
      *   Evaluate the base metal tone under the studio lighting.
      
      **Strict Exclusions:**
      *   IGNORE ALL GEMSTONE COLORS (e.g., white diamonds, green emeralds, red rubies).
      *   IGNORE STUDIO LIGHTING GLARES or pure white reflections on the metal.
      *   IGNORE PURE BLACK SHADOWS caused by rendering or photography.

      **Color Profiles for Reference:**
      *   Yellow Gold: Primary hues will be rich, warm, golden, yellow, or slightly brassy.
      *   White Gold: Primary hues will be cool, silvery, icy, chrome-like, or greyish. (Note: Platinum and Silver also fall into this visual category).
      *   Rose Gold: Primary hues will be warm pinkish, coppery, blush, or slightly reddish-gold.
      *   Description Image: ONLY if the image is purely text, logo, or packaging with ABSOLUTELY NO jewelry metal visible. If the image is an infographic but contains a rendering of a ring, you MUST output the actual metal color of that ring (Yellow, White, or Rose).

      **CRITICAL RENDER RULES:**
      1. These are professional 3D renderings/photos. White Gold is highly reflective and WILL reflect warm (yellow/brown) light sources from the studio environment or HDRI. Do NOT classify a ring as Yellow Gold just because it has warm reflections! You must look at the BASE metal color. If the primary base is icy/silver/grey, it is strictly "White".
      2. Rose Gold can sometimes look like Yellow Gold in bright light. Look for the distinct copper/pink/blush undertone. If it has a pinkish hue, it is "Rose".
      3. Yellow Gold is unambiguously yellow/brass.

      **View Angle Profiles:**
      *   Front: Straight on, or a perspective/top-down primary view on a pure white background.
      *   Photoshoot: A creative product shot on a textured background (e.g., leaves, stones, velvet) but NO human body parts.
      *   Lifestyle: A photo showing the jewelry being worn by a person (e.g., on a hand, neck, ear).
      *   Right Side: Angled showing the right side of the shank.
      *   Side: A flat side profile view.
      *   Infographic: Contains charts, dimensions, text, or diagrams.

      **Output Requirements:**
      *   Format: application/json
      *   Schema:
          {
            "color": "String (Must be exactly 'Yellow', 'White', 'Rose', or 'Description Image')",
            "view": "String (Must be exactly 'Front', 'Photoshoot', 'Lifestyle', 'Right Side', 'Side', or 'Infographic')",
            "confidence_score": "Float (between 0.00 and 1.00 indicating certainty)",
            "reasoning": "String (A brief, 1-sentence technical explanation of why this color and view was chosen based on pixel hues)"
          }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    let responseText = result.response.text().trim();
    
    let parsedData = { color: 'Yellow', view: 'Front' };
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', responseText);
    }
    
    let detectedColor = parsedData.color || 'Yellow';
    let detectedView = parsedData.view || 'Front';
    
    // Validate output with loose substring matching
    const colorLower = String(detectedColor).toLowerCase();
    let matchedColor = 'Yellow';
    if (colorLower.includes('rose')) matchedColor = 'Rose';
    else if (colorLower.includes('white')) matchedColor = 'White';
    else if (colorLower.includes('desc') || colorLower.includes('misc')) matchedColor = 'Description Image';
    else matchedColor = 'Yellow';

    const viewLower = String(detectedView).toLowerCase();
    let matchedView = 'Front';
    if (viewLower.includes('lifestyle') || viewLower.includes('model') || viewLower.includes('wear')) matchedView = 'Lifestyle';
    else if (viewLower.includes('photo') || viewLower.includes('shoot') || viewLower.includes('creative')) matchedView = 'Photoshoot';
    else if (viewLower.includes('right')) matchedView = 'Right Side';
    else if (viewLower.includes('side')) matchedView = 'Side';
    else if (viewLower.includes('info') || viewLower.includes('chart') || viewLower.includes('desc')) matchedView = 'Infographic';
    else matchedView = 'Front';

    return NextResponse.json({ color: matchedColor, view: matchedView });

  } catch (error: any) {
    console.error('AI Vision Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to detect color' }, { status: 500 });
  }
}
