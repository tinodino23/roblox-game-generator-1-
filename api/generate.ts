
import { GoogleGenAI, Type } from "@google/genai";
import type { RobloxGame, GameScript, SetupStep, MapBuilder } from '../types';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// SCHEMA DEFINITIONS for the two-step generation process

const coreGameSchema = {
  type: Type.OBJECT,
  properties: {
    gameTitle: { type: Type.STRING, description: "A creative and catchy title for the Roblox game." },
    gameDescription: { type: Type.STRING, description: "A brief, one-paragraph description of the game's concept and core loop." },
    setupGuide: {
      type: Type.ARRAY,
      description: "A step-by-step guide for the user to set up the game in Roblox Studio. Crucially, include a final step telling the user to build a simple map manually using Studio's built-in tools, as the map script will be generated separately.",
      items: {
        type: Type.OBJECT,
        properties: {
          stepTitle: { type: Type.STRING },
          stepContent: { type: Type.STRING },
        },
        required: ["stepTitle", "stepContent"]
      }
    },
    gameScripts: {
      type: Type.ARRAY,
      description: "An array of Luau script files required for the game logic.",
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: { type: Type.STRING },
          description: { type: Type.STRING },
          code: { type: Type.STRING },
        },
        required: ["fileName", "description", "code"]
      }
    },
  },
  required: ["gameTitle", "gameDescription", "setupGuide", "gameScripts"]
};

const mapBuilderSchema = {
    type: Type.OBJECT,
    properties: {
        mapBuilderScript: {
            type: Type.OBJECT,
            description: "A single Luau script that generates the game map when run.",
            properties: {
                description: { type: Type.STRING, description: "A short explanation of what this script does and how to use it (e.g., 'Run in Command Bar')."},
                code: { type: Type.STRING, description: "The full Luau source code for the map generation script."}
            },
            required: ["description", "code"]
        }
    },
    required: ["mapBuilderScript"]
};


// Helper function to clean potential markdown from AI response
const cleanJsonFromAi = (rawText: string): string => {
    return rawText.trim().replace(/^```json\s*/, '').replace(/```$/, '');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
  }

  const idea = req.body.idea?.trim();
  if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Game idea is required.' });
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // --- STEP 1: Generate the Core Game Package (without map) ---
    const coreGameSystemInstruction = `You are an expert Roblox game developer. Your goal is to generate the core components of a functional Roblox game: a title, description, a setup guide, and the necessary game logic scripts. You must adhere to the provided JSON schema. DO NOT generate a map or map builder script in this step; that will be handled separately. The setup guide should be clear for beginners.`;

    const coreGameResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User's Game Idea: "${idea}"`,
      config: {
        systemInstruction: coreGameSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: coreGameSchema,
      }
    });

    const coreGameJsonText = cleanJsonFromAi(coreGameResponse.text);
    const coreGameResult = JSON.parse(coreGameJsonText) as Omit<RobloxGame, 'mapBuilderScript'>;

    // --- STEP 2: Generate the Map Builder Script, using context from Step 1 ---
    const mapBuilderSystemInstruction = `You are an expert Roblox scripter. Based on the provided game concept, generate a single, runnable Luau script that will build a basic but functional map in Roblox Studio. The script should be well-commented. Adhere strictly to the JSON schema.`;
    
    const mapBuilderContext = `
      Game Title: ${coreGameResult.gameTitle}
      Game Description: ${coreGameResult.gameDescription}
      Original Idea: "${idea}"
      
      Generate the map builder script for this game.
    `;
    
    const mapBuilderResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: mapBuilderContext,
        config: {
            systemInstruction: mapBuilderSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: mapBuilderSchema,
        }
    });

    const mapBuilderJsonText = cleanJsonFromAi(mapBuilderResponse.text);
    const mapBuilderResult = JSON.parse(mapBuilderJsonText) as { mapBuilderScript: MapBuilder };

    // --- STEP 3: Combine results and send to client ---
    const finalResult: RobloxGame = {
      ...coreGameResult,
      mapBuilderScript: mapBuilderResult.mapBuilderScript
    };

    return res.status(200).json(finalResult);

  } catch (error) {
    console.error("Error during sequential generation:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI generation.";
    // Try to provide a more specific error if it's a parsing issue
    if (error instanceof SyntaxError) {
        return res.status(500).json({ error: 'The AI returned a malformed response that could not be parsed. Please try again.' });
    }
    return res.status(500).json({ error: `An unexpected error occurred: ${errorMessage}` });
  }
}
