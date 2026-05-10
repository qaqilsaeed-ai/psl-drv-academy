import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiInstance = new GoogleGenAI({ apiKey });
    }
  }
  return aiInstance;
};
