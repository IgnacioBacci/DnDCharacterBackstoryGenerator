import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post('/api/generate-backstory', async (req, res) => {
    try {
        const { name, species, background, theme, traits, events, classes, npcs, language } = req.body;
        
        // Format classes without mentioning levels to the AI to enforce organic writing
        let classStr = classes.map(c => {
            let str = c.name;
            if (c.subclass) str += ` (Subclass: ${c.subclass})`;
            return str;
        }).join(', ');
        
        let npcStr = npcs && npcs.length > 0 ? npcs.map(n => `${n.name} [${n.role}]`).join(', ') : 'None specified';
        
        const targetLanguage = language === 'es' ? 'SPANISH' : 'ENGLISH';

        const prompt = `You are an expert creative writer and Dungeons & Dragons lore master. Write a compelling, immersive backstory.

CHARACTER SECRETS & DETAILS:
- Name: ${name}
- Species: ${species}
- Background: ${background}
- Classes: ${classStr}
- Theme/Tone: ${theme || 'Epic Fantasy'}
- Personality Traits: ${traits || 'None specified'}
- Important Events: ${events || 'None specified'}
- NPCs Involved: ${npcStr}

CRITICAL WRITING RULES:
1. NEVER mention "Levels", "Stats", or any gameplay mechanics directly. NEVER.
2. Make it feel purely organic to the world. Avoid literal class declarations like "He was a Barbarian". Instead, use descriptors like "He was an herculean warrior". You can use class names in a natural context (e.g. "He sought out a hermetic Wizard"), but never as a mechanical label for the player.
3. Incorporate the Theme, Personality Traits, Important Events, and NPCs naturally into the narrative.
4. The backstory should be exactly 3-4 paragraphs.
5. AT THE VERY END, append a formatted list summarizing the character's Flaws, Bonds, and Ideals based on the narrative. Format exactly like this:
\n\n**Character Details**\n- **Flaws:** ...\n- **Bonds:** ...\n- **Ideals:** ...
6. CRITICAL: ALL GENERATED TEXT (INCLUDING THE STORY AND THE FLAWS/BONDS/IDEALS SECTION) MUST BE IN **${targetLanguage}**. DO NOT output any text in a different language.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
        });

        const backstory = chatCompletion.choices[0]?.message?.content || 'Failed to generate a backstory.';
        res.json({ backstory });
    } catch (error) {
        console.error('Error generating backstory:', error);
        res.status(500).json({ error: 'An error occurred while generating the backstory.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
