import { groq } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("API: /api/generate hit");
  try {
    const body = await req.json();
    console.log("API: Request body received", body);
    
    const { 
      name, species, classes, background, pronouns, 
      subclasses, tone, characters, lifeEvents, language 
    } = body;

    const totalLevel = classes.reduce((sum: number, c: any) => sum + parseInt(c.level), 0);
    
    let powerTier = "beginner";
    if (totalLevel >= 17) powerTier = "epic (world-shaking deeds)";
    else if (totalLevel >= 11) powerTier = "heroic (realm-wide impact)";
    else if (totalLevel >= 5) powerTier = "established (notable local deeds)";
    else powerTier = "beginner (minor or personal deeds)";

    const systemPrompt = `You are a professional D&D narrative writer. Your task is to generate a character backstory, ideals, bonds, and flaws based on character details.
    
    CRITICAL RULES:
    1. NEVER mention character levels, specific class names (e.g., "Paladin", "Wizard"), or subclass names (e.g., "Oath of Vengeance") directly.
    2. DESCRIBE their abilities and powers through flavor text. For example, instead of "is a barbarian", say "is driven by a primal fury that manifests as unyielding strength in battle". Instead of "casts firebolt", say "manipulates the weave to conjure sparks and flame from thin air".
    3. The scale of the backstory MUST match the power tier: ${powerTier}. A level 1-4 character shouldn't have slain a dragon, but a level 17+ character might have saved planes of existence.
    4. Incorporate the subclass flavor effectively. For example, an Echo Knight should have mentions of temporal fragments or shadows of themselves.
    5. The tone should be: ${tone || "balanced"}.
    6. Language: ${language === "es" ? "Spanish" : "English"}.
    
    Output Format (JSON):
    {
      "backstory": "...",
      "ideals": "...",
      "bonds": "...",
      "flaws": "..."
    }`;

    const userPrompt = `
      Name: ${name}
      Species: ${species}
      Total Level: ${totalLevel}
      Classes/Levels: ${classes.map((c: any) => `${c.name} (${c.level})`).join(", ")}
      Subclasses: ${subclasses || "Not specified"}
      Background: ${background}
      Pronouns: ${pronouns}
      Important Characters & Relationships: ${characters || "Not specified"}
      Important Life Events: ${lifeEvents || "Not specified"}
    `;

    console.log("API: Starting Groq completion...");
    
    if (!process.env.GROQ_API_KEY) {
      console.error("API Error: GROQ_API_KEY is missing");
      return NextResponse.json({ error: "Server Configuration Error: API key missing. Please check Vercel environment variables." }, { status: 500 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile", // Updated to a non-decommissioned model
      response_format: { type: "json_object" }
    });

    console.log("API: Groq response received");
    const response = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API Error details:", error);
    // Return the specific error message from the SDK or network
    return NextResponse.json({ 
      error: `AI Generation Error: ${error.message || "Unknown error"}`,
      details: error.stack
    }, { status: 500 });
  }
}
