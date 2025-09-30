import { GoogleGenAI } from "@google/genai";

// IMPORTANT: This application uses process.env.API_KEY for the Gemini API key.
// It is expected to be set in the deployment environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MISSING_KEY_ERROR = "Configuration Error: The Gemini API key named 'API_KEY' was not found in the environment. Please ensure it is set correctly in your project settings and redeploy the application.";

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

const getErrorMessage = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (/API key not valid/.test(errorMessage)) {
      return "Authentication Error: The provided Gemini API key is not valid. Please check your key and environment configuration.";
  }
  if (/API key is missing/.test(errorMessage)) {
      return MISSING_KEY_ERROR;
  }
  return `Sorry, an unexpected error occurred. Please check the console for details.`;
}

export const runChat = async (prompt: string, imageFile?: File): Promise<string> => {
  if (!process.env.API_KEY) {
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
    return getErrorMessage(error);
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
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
    return getErrorMessage(error);
  }
};
