import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
}

export const getGeminiResponse = async (prompt: string) => {
  if (!model) {
    throw new Error("Gemini API key is not configured");
  }
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const createChatSession = () => {
    if (!model) {
        throw new Error("Gemini API key is not configured");
    }
    return model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "You are a helpful Safety Assistant. Help with personal safety, travel safety, emergency procedures, and first aid. Keep responses concise and helpful." }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to assist with safety advice." }],
            }
        ],
    });
};
