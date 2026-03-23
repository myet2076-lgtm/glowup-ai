import OpenAI from 'openai';
import { QuizAnswers, MakeupAnalysis, Product, FaceAnalysisResult } from './types';

// Lazy init — avoid crashing the entire app if no API key is set yet
let _openai: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key || key === 'PLACEHOLDER_API_KEY') {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.');
    }
    _openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
  }
  return _openai;
}

// Helper: convert base64 string to File (browser-compatible, no Buffer)
function base64ToFile(base64: string, filename: string, mimeType = 'image/jpeg'): File {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return new File([ab], filename, { type: mimeType });
}

// ── JSON Schemas for OpenAI Structured Outputs ──

const TUTORIAL_STEP_SCHEMA = {
  type: 'object' as const,
  properties: {
    step: { type: 'number' as const },
    title: { type: 'string' as const },
    instruction: { type: 'string' as const },
    productToUse: { type: 'string' as const },
    amount: { type: 'string' as const },
    technique: { type: 'string' as const },
    proTip: { type: 'string' as const },
  },
  required: ['step', 'title', 'instruction', 'productToUse', 'amount', 'technique', 'proTip'],
  additionalProperties: false,
};

const PRODUCT_SCHEMA = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const },
    brand: { type: 'string' as const },
    category: { type: 'string' as const },
    description: { type: 'string' as const },
  },
  required: ['name', 'brand', 'category', 'description'],
  additionalProperties: false,
};

const TUTORIAL_LINK_SCHEMA = {
  type: 'object' as const,
  properties: {
    platform: { type: 'string' as const, enum: ['YouTube', 'Vogue', 'Allure', 'TikTok'] },
    title: { type: 'string' as const },
    url: { type: 'string' as const },
  },
  required: ['platform', 'title', 'url'],
  additionalProperties: false,
};

const MAKEUP_ANALYSIS_SCHEMA = {
  type: 'object' as const,
  properties: {
    styleName: { type: 'string' as const },
    description: { type: 'string' as const },
    celebrityMatch: { type: 'string' as const },
    celebrityImage: { type: 'string' as const },
    colorPalette: { type: 'array' as const, items: { type: 'string' as const } },
    tutorialSteps: { type: 'array' as const, items: TUTORIAL_STEP_SCHEMA },
    recommendedProducts: { type: 'array' as const, items: PRODUCT_SCHEMA },
    tutorialLinks: { type: 'array' as const, items: TUTORIAL_LINK_SCHEMA },
    tikTokSearchQuery: { type: 'string' as const },
  },
  required: [
    'styleName', 'description', 'celebrityMatch', 'celebrityImage',
    'colorPalette', 'tutorialSteps', 'recommendedProducts',
    'tutorialLinks', 'tikTokSearchQuery',
  ],
  additionalProperties: false,
};

const FACE_ANALYSIS_SCHEMA = {
  type: 'object' as const,
  properties: {
    faceShape: { type: 'string' as const },
    eyebrowShape: { type: 'string' as const },
    jewelryColor: { type: 'string' as const, enum: ['Gold', 'Silver', 'Rose Gold'] },
    jewelryReason: { type: 'string' as const },
    clothingSeason: { type: 'string' as const },
    bestClothingColors: { type: 'array' as const, items: { type: 'string' as const } },
    glassShapes: { type: 'array' as const, items: { type: 'string' as const } },
    bestHairColors: { type: 'array' as const, items: { type: 'string' as const } },
    bestHairstyles: { type: 'array' as const, items: { type: 'string' as const } },
    eyebrowTips: { type: 'string' as const },
    undertone: { type: 'string' as const },
  },
  required: [
    'faceShape', 'eyebrowShape', 'jewelryColor', 'jewelryReason',
    'clothingSeason', 'bestClothingColors', 'glassShapes',
    'bestHairColors', 'bestHairstyles', 'eyebrowTips', 'undertone',
  ],
  additionalProperties: false,
};

// ── Service Functions ──

export const validateFaceImage = async (base64Image: string): Promise<boolean> => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          { type: 'text', text: "Does this image contain a clear human face suitable for makeup analysis? Return JSON: { \"isFace\": boolean }." },
        ],
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'face_validation',
        strict: true,
        schema: {
          type: 'object',
          properties: { isFace: { type: 'boolean' } },
          required: ['isFace'],
          additionalProperties: false,
        },
      },
    },
  });
  const data = JSON.parse(response.choices[0].message.content || '{"isFace": false}');
  return data.isFace;
};

export const normalizeProduct = async (brand: string, name: string): Promise<Product> => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: `Identify the exact official product Brand: ${brand}, Name: ${name}. Return JSON.` },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'product_normalization',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            brand: { type: 'string' },
            category: { type: 'string' },
          },
          required: ['name', 'brand', 'category'],
          additionalProperties: false,
        },
      },
    },
  });
  return JSON.parse(response.choices[0].message.content || '{}');
};

export const getMakeupFromQuiz = async (answers: QuizAnswers): Promise<MakeupAnalysis> => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: `Create a custom makeup look for: ${JSON.stringify(answers)}. For tutorialLinks, strictly use YouTube search result URLs like 'https://www.youtube.com/results?search_query=...' based on the style name. If there is no celebrity match, use an empty string for celebrityMatch and celebrityImage.`,
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'makeup_analysis',
        strict: true,
        schema: MAKEUP_ANALYSIS_SCHEMA,
      },
    },
  });
  return JSON.parse(response.choices[0].message.content || '{}');
};

export const analyzeFaceFeatures = async (base64Image: string): Promise<FaceAnalysisResult> => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          { type: 'text', text: 'Detailed face feature analysis.' },
        ],
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'face_analysis',
        strict: true,
        schema: FACE_ANALYSIS_SCHEMA,
      },
    },
  });
  return JSON.parse(response.choices[0].message.content || '{}');
};

export const analyzeCelebrityLookAlike = async (base64Image: string): Promise<MakeupAnalysis> => {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          {
            type: 'text',
            text: "Identify this person's celebrity twin. For tutorialLinks, strictly use YouTube search result URLs like 'https://www.youtube.com/results?search_query=...' for the celebrity's makeup secrets. Do not provide direct video links.",
          },
        ],
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'celebrity_analysis',
        strict: true,
        schema: MAKEUP_ANALYSIS_SCHEMA,
      },
    },
  });
  return JSON.parse(response.choices[0].message.content || '{}');
};

export const analyzeInspirationLook = async (
  inspoImage: string | null,
  userFaceImage: string,
  textDesc: string
): Promise<MakeupAnalysis> => {
  const content: Array<{ type: 'image_url'; image_url: { url: string } } | { type: 'text'; text: string }> = [];

  if (inspoImage) {
    const inspoBase64 = inspoImage.includes(',') ? inspoImage.split(',')[1] : inspoImage;
    content.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${inspoBase64}` } });
  }

  const faceBase64 = userFaceImage.includes(',') ? userFaceImage.split(',')[1] : userFaceImage;
  content.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${faceBase64}` } });
  content.push({
    type: 'text',
    text: `Analyze the inspo look: ${textDesc}. Adapt it to the user. For tutorials, strictly use YouTube search result URLs. If there is no celebrity match, use an empty string for celebrityMatch and celebrityImage.`,
  });

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'inspiration_analysis',
        strict: true,
        schema: MAKEUP_ANALYSIS_SCHEMA,
      },
    },
  });
  return JSON.parse(response.choices[0].message.content || '{}');
};

export const analyzeInventory = async (base64Images: string[]): Promise<Product[]> => {
  const content: Array<{ type: 'image_url'; image_url: { url: string } } | { type: 'text'; text: string }> = [];

  for (const img of base64Images) {
    content.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${img}` } });
  }
  content.push({ type: 'text', text: 'Identify makeup products in these images.' });

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'inventory_analysis',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: PRODUCT_SCHEMA,
            },
          },
          required: ['products'],
          additionalProperties: false,
        },
      },
    },
  });
  const data = JSON.parse(response.choices[0].message.content || '{"products": []}');
  return data.products;
};

export const generateTryOn = async (faceImage: string, lookDescription: string): Promise<string> => {
  const file = base64ToFile(faceImage, 'face.png', 'image/png');
  const response = await getClient().images.edit({
    model: 'gpt-image-1',
    image: file,
    prompt: `Apply this makeup style: ${lookDescription}. Keep the person's face exactly the same, just add the makeup. Photorealistic result.`,
  });
  const output = response.data?.[0];
  if (output?.b64_json) return `data:image/png;base64,${output.b64_json}`;
  if (output?.url) return output.url;
  return '';
};

export const generateHairTryOn = async (faceImage: string, style: string, color: string): Promise<string> => {
  const file = base64ToFile(faceImage, 'face.png', 'image/png');
  const response = await getClient().images.edit({
    model: 'gpt-image-1',
    image: file,
    prompt: `Give this person ${color} ${style} hair. Keep the person's face exactly the same, only change the hair. Photorealistic result.`,
  });
  const output = response.data?.[0];
  if (output?.b64_json) return `data:image/png;base64,${output.b64_json}`;
  if (output?.url) return output.url;
  return '';
};
