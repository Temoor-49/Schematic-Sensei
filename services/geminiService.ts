
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types.ts";

const MODEL_NAME = 'gemini-3-flash-preview';

export class SchematicService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeSchematic(base64Image: string): Promise<AnalysisResult> {
    const prompt = `You are SchematicSensei, an expert electrical engineer. 
    Analyze the provided schematic image in detail. 
    Provide a comprehensive analysis including summary, components, theory of operation, potential issues, suggestions, and firmware logic.`;

    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: base64Image.split(',')[1] || base64Image,
      },
    };

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            components: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  value: { type: Type.STRING },
                  description: { type: Type.STRING },
                  roleInCircuit: { type: Type.STRING },
                },
                required: ["name", "type", "description"]
              }
            },
            theoryOfOperation: { type: Type.STRING },
            potentialIssues: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedFirmware: { type: Type.STRING }
          },
          required: ["summary", "components", "theoryOfOperation", "potentialIssues", "suggestions"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as AnalysisResult;
  }

  async getChatResponse(history: any[], userMessage: string, base64Image: string | null): Promise<string> {
    const parts: any[] = [{ text: userMessage }];
    
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Image.split(',')[1] || base64Image,
        }
      });
    }

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { role: 'user', parts: parts }
      ],
      config: {
        systemInstruction: "You are SchematicSensei. Answer the user's questions about the schematic they uploaded. Be technical, precise, and helpful. Use markdown for formatting code or lists.",
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  }
}

export const schematicService = new SchematicService();
