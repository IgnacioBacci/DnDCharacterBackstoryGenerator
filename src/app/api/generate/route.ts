import { groq } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("API: /api/generate hit");
  try {
    const body = await req.json();
    const { action, language } = body;
    const isSpanish = language === "es";

    if (!process.env.GROQ_API_KEY) {
      console.error("API Error: GROQ_API_KEY is missing");
      return NextResponse.json({ error: "Server Configuration Error: API key missing." }, { status: 500 });
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate-all") {
      const { name, species, classes, background, pronouns, subclasses, tone, characters, lifeEvents } = body;
      const totalLevel = classes.reduce((sum: number, c: any) => sum + parseInt(c.level), 0);
      
      let powerTier = totalLevel >= 17 ? "epic" : totalLevel >= 11 ? "heroic" : totalLevel >= 5 ? "established" : "beginner";

      systemPrompt = `You are a professional D&D narrative writer. Generate a character backstory and traits.
      - Backstory: Personal, interesting, explicit events, ends with a clear motive for adventuring.
      - NEVER mention levels/classes directly; use flavor.
      - Power tier: ${powerTier}.
      - Language: ${isSpanish ? "Spanish" : "English"}.
      - Traits: At least 3 each for Ideals, Bonds, Flaws. 
      - Format: Each trait has a short 'name' and a 'description' paragraph.
      
      Output JSON:
      {
        "backstory": "...",
        "ideals": [{"name": "...", "description": "..."}, ...],
        "bonds": [{"name": "...", "description": "..."}, ...],
        "flaws": [{"name": "...", "description": "..."}, ...]
      }`;

      userPrompt = `Name: ${name}, Species: ${species}, Classes: ${JSON.stringify(classes)}, Subclasses: ${subclasses}, Background: ${background}, Tone: ${tone}, PRONOUNDS: ${pronouns}, Characters: ${characters}, Events: ${lifeEvents}`;

    } else if (action === "reroll-trait") {
      const { backstory, traitType, isRelated, currentTraits } = body;
      
      systemPrompt = `You are a D&D writer. Reroll a single ${traitType} for this character.
      - Backstory for context: ${backstory}
      - Related to backstory? ${isRelated ? "YES" : "NO (can be something plausible but random like 'Fear of Frogs' or 'Obsessed with shiny spoons')"}.
      - Current traits to avoid duplicates: ${JSON.stringify(currentTraits)}
      - Language: ${isSpanish ? "Spanish" : "English"}.
      
      Output JSON:
      {
        "trait": {"name": "...", "description": "..."}
      }`;
      
      userPrompt = `Generate one new ${traitType}.`;

    } else if (action === "expand-backstory") {
      const { currentBackstory, extraInfo, selectedText } = body;
      
      systemPrompt = `You are a D&D writer. Expand the following backstory.
      - Original: ${currentBackstory}
      ${selectedText ? `- FOCUS on expanding this specific part: "${selectedText}"` : ""}
      ${extraInfo ? `- INCORPORATE these new details: "${extraInfo}"` : ""}
      - Do not change the existing facts, just add more detail, dialogue, or atmosphere.
      - Maintain the same tone and style.
      - Language: ${isSpanish ? "Spanish" : "English"}.
      
      Output JSON:
      {
        "backstory": "..."
      }`;
      
      userPrompt = "Expand the backstory.";
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(response);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Action failed" }, { status: 500 });
  }
}
