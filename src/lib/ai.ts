import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'undefined') {
      aiInstance = new GoogleGenAI({ apiKey });
    } else {
      console.warn("GEMINI_API_KEY is missing or undefined");
    }
  }
  return aiInstance;
};
