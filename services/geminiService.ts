
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getTravelAssistantResponse = async (query: string) => {
  if (!API_KEY) return "AI Assistant is unavailable without API Key.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful Yogyakarta travel assistant named 'JogjaHub Guide'. 
      Answer the user's question about DIY (Daerah Istimewa Yogyakarta) using a friendly local tone. 
      Mention that the app integrates MSMEs, tourism, transportation, and culture from various government departments (Dinas).
      
      User Question: ${query}`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Maaf, saya tidak dapat menjawab saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi JogjaHub Guide.";
  }
};
