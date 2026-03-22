
import { GoogleGenAI, Type } from "@google/genai";
import { QuizAnswers, MakeupAnalysis, Product, FaceAnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MAKEUP_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    styleName: { type: Type.STRING },
    description: { type: Type.STRING },
    celebrityMatch: { type: Type.STRING, description: "Name of the celebrity twin." },
    celebrityImage: { type: Type.STRING, description: "Not used for display, but can be a reference link." },
    colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
    tutorialSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.NUMBER },
          title: { type: Type.STRING },
          instruction: { type: Type.STRING },
          productToUse: { type: Type.STRING },
          amount: { type: Type.STRING },
          technique: { type: Type.STRING },
          proTip: { type: Type.STRING }
        },
        required: ["step", "title", "instruction", "productToUse", "proTip"]
      }
    },
    recommendedProducts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          brand: { type: Type.STRING },
          category: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    tutorialLinks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, enum: ["YouTube", "Vogue", "Allure", "TikTok"] },
          title: { type: Type.STRING },
          url: { type: Type.STRING, description: "A robust search-based URL (e.g., https://www.youtube.com/results?search_query=...) to ensure the content is always accessible." }
        }
      }
    },
    tikTokSearchQuery: { type: Type.STRING }
  },
  required: ["styleName", "description", "tutorialSteps", "recommendedProducts", "tikTokSearchQuery", "tutorialLinks", "colorPalette"]
};

const FACE_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    faceShape: { type: Type.STRING },
    eyebrowShape: { type: Type.STRING },
    jewelryColor: { type: Type.STRING, enum: ["Gold", "Silver", "Rose Gold"] },
    jewelryReason: { type: Type.STRING },
    clothingSeason: { type: Type.STRING },
    bestClothingColors: { type: Type.ARRAY, items: { type: Type.STRING } },
    glassShapes: { type: Type.ARRAY, items: { type: Type.STRING } },
    bestHairColors: { type: Type.ARRAY, items: { type: Type.STRING } },
    bestHairstyles: { type: Type.ARRAY, items: { type: Type.STRING } },
    eyebrowTips: { type: Type.STRING },
    undertone: { type: Type.STRING }
  },
  required: ["faceShape", "eyebrowShape", "jewelryColor", "jewelryReason", "clothingSeason", "bestClothingColors", "glassShapes", "bestHairColors", "bestHairstyles", "eyebrowTips", "undertone"]
};

export const validateFaceImage = async (base64Image: string): Promise<boolean> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Does this image contain a clear human face suitable for makeup analysis? Return JSON: { 'isFace': boolean }." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { isFace: { type: Type.BOOLEAN } },
        required: ["isFace"]
      }
    }
  });
  const data = JSON.parse(response.text || '{"isFace": false}');
  return data.isFace;
};

export const normalizeProduct = async (brand: string, name: string): Promise<Product> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Identify the exact official product Brand: ${brand}, Name: ${name}. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          brand: { type: Type.STRING },
          category: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getMakeupFromQuiz = async (answers: QuizAnswers): Promise<MakeupAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a custom makeup look for: ${JSON.stringify(answers)}. For tutorialLinks, strictly use YouTube search result URLs like 'https://www.youtube.com/results?search_query=...' based on the style name.`,
    config: { responseMimeType: "application/json", responseSchema: MAKEUP_ANALYSIS_SCHEMA },
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeFaceFeatures = async (base64Image: string): Promise<FaceAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Detailed face feature analysis." }
      ]
    },
    config: { responseMimeType: "application/json", responseSchema: FACE_ANALYSIS_SCHEMA },
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeCelebrityLookAlike = async (base64Image: string): Promise<MakeupAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Identify this person's celebrity twin. For tutorialLinks, strictly use YouTube search result URLs like 'https://www.youtube.com/results?search_query=...' for the celebrity's makeup secrets. Do not provide direct video links." }
      ]
    },
    config: { 
      responseMimeType: "application/json", 
      responseSchema: MAKEUP_ANALYSIS_SCHEMA,
      tools: [{ googleSearch: {} }]
    },
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeInspirationLook = async (inspoImage: string | null, userFaceImage: string, textDesc: string): Promise<MakeupAnalysis> => {
  const parts: any[] = [];
  if (inspoImage) parts.push({ inlineData: { data: inspoImage.split(',')[1], mimeType: 'image/jpeg' } });
  parts.push({ inlineData: { data: userFaceImage.split(',')[1], mimeType: 'image/jpeg' } });
  parts.push({ text: `Analyze the inspo look: ${textDesc}. Adapt it to the user. For tutorials, strictly use YouTube search result URLs.` });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: { responseMimeType: "application/json", responseSchema: MAKEUP_ANALYSIS_SCHEMA },
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeInventory = async (base64Images: string[]): Promise<Product[]> => {
  const parts: any[] = base64Images.map(img => ({ inlineData: { data: img, mimeType: 'image/jpeg' } }));
  parts.push({ text: "Identify makeup products." });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING }
          }
        }
      },
    },
  });
  return JSON.parse(response.text || '[]');
};

export const generateTryOn = async (faceImage: string, lookDescription: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: faceImage, mimeType: 'image/jpeg' } },
        { text: `Apply this makeup style: ${lookDescription}.` }
      ]
    }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part ? `data:image/png;base64,${part.inlineData.data}` : "";
};

export const generateHairTryOn = async (faceImage: string, style: string, color: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: faceImage, mimeType: 'image/jpeg' } },
        { text: `Give this person ${color} ${style} hair.` }
      ]
    }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part ? `data:image/png;base64,${part.inlineData.data}` : "";
};
