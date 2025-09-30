import { GoogleGenAI } from "@google/genai";

// IMPORTANT: This application uses process.env.API_KEY for the Gemini API key.
// It is expected to be set in the deployment environment (e.g., Vercel settings).
const API_KEY = process.env.API_KEY;

// We initialize the client once. If the key is missing, functions will return an error.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const MISSING_KEY_ERROR = "Configuration Error: The Gemini API key is not set. Please add the `API_KEY` as an environment variable in your Vercel project settings and then redeploy the application.";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const runChat = async (prompt: string, imageFile?: File): Promise<string> => {
  if (!ai) {
    console.error(MISSING_KEY_ERROR);
    return MISSING_KEY_ERROR;
  }
  
  try {
    const model = 'gemini-2.5-flash';
    const textPart = { text: prompt };
    const parts: any[] = [];

    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      parts.push(imagePart);
    }
    
    parts.push(textPart);

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
    });

    return response.text;
  } catch (error) {
    console.error("Error in runChat:", error);
    return `Sorry, I encountered an error. Please check the console for details. (Is the API key configured correctly?)`;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!ai) {
    console.error(MISSING_KEY_ERROR);
    return MISSING_KEY_ERROR;
  }
    
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64Image = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64Image}`;
    } else {
      return "I couldn't generate an image for that prompt. Please try something else.";
    }
  } catch (error) {
    console.error("Error in generateImage:", error);
    return `Sorry, I couldn't generate an image. Please check the console for details.`;
  }
};