import { GoogleGenAI } from "@google/genai";

// Support both process.env (Node) and import.meta.env (Vite/Vercel)
const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_GOOGLE_API_KEY || '';
  }
  return process.env.API_KEY || '';
};

const apiKey = getApiKey();

// Initialize the client once. 
// Note: Only initialize if key is present to avoid errors on load
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateText = async (prompt: string): Promise<string> => {
  if (!ai) return "AI Configuration Missing (API Key)";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    throw error;
  }
};

export const generateVisionContent = async (prompt: string, base64Image: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  if (!ai) return "AI Configuration Missing (API Key)";

  try {
    // Ensure base64 string doesn't have the header prefix for the API call if the SDK expects raw base64
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
        ],
      },
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!ai) throw new Error("AI Configuration Missing (API Key)");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });
    
    // Iterate to find the image part
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("No image generated in response.");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};