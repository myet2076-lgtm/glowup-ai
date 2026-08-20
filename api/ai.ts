import OpenAI from 'openai';

type RequestLike = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type JsonObject = Record<string, unknown>;
type RateEntry = { count: number; resetAt: number };

const MAX_BODY_CHARS = 4_000_000;
const MAX_IMAGE_CHARS = 2_800_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 20;
const rateStore = new Map<string, RateEntry>();

const TUTORIAL_STEP_SCHEMA = {
  type: 'object',
  properties: {
    step: { type: 'number' },
    title: { type: 'string' },
    instruction: { type: 'string' },
    productToUse: { type: 'string' },
    amount: { type: 'string' },
    technique: { type: 'string' },
    proTip: { type: 'string' },
  },
  required: ['step', 'title', 'instruction', 'productToUse', 'amount', 'technique', 'proTip'],
  additionalProperties: false,
} as const;

const PRODUCT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    brand: { type: 'string' },
    category: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['name', 'brand', 'category', 'description'],
  additionalProperties: false,
} as const;

const TUTORIAL_LINK_SCHEMA = {
  type: 'object',
  properties: {
    platform: { type: 'string', enum: ['YouTube', 'Vogue', 'Allure', 'TikTok'] },
    title: { type: 'string' },
    url: { type: 'string' },
  },
  required: ['platform', 'title', 'url'],
  additionalProperties: false,
} as const;

const MAKEUP_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    styleName: { type: 'string' },
    description: { type: 'string' },
    celebrityMatch: { type: 'string' },
    celebrityImage: { type: 'string' },
    colorPalette: { type: 'array', items: { type: 'string' } },
    tutorialSteps: { type: 'array', items: TUTORIAL_STEP_SCHEMA },
    recommendedProducts: { type: 'array', items: PRODUCT_SCHEMA },
    tutorialLinks: { type: 'array', items: TUTORIAL_LINK_SCHEMA },
    tikTokSearchQuery: { type: 'string' },
  },
  required: [
    'styleName',
    'description',
    'celebrityMatch',
    'celebrityImage',
    'colorPalette',
    'tutorialSteps',
    'recommendedProducts',
    'tutorialLinks',
    'tikTokSearchQuery',
  ],
  additionalProperties: false,
} as const;

const FACE_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    faceShape: { type: 'string' },
    eyebrowShape: { type: 'string' },
    jewelryColor: { type: 'string', enum: ['Gold', 'Silver', 'Rose Gold'] },
    jewelryReason: { type: 'string' },
    clothingSeason: { type: 'string' },
    bestClothingColors: { type: 'array', items: { type: 'string' } },
    glassShapes: { type: 'array', items: { type: 'string' } },
    bestHairColors: { type: 'array', items: { type: 'string' } },
    bestHairstyles: { type: 'array', items: { type: 'string' } },
    eyebrowTips: { type: 'string' },
    undertone: { type: 'string' },
  },
  required: [
    'faceShape',
    'eyebrowShape',
    'jewelryColor',
    'jewelryReason',
    'clothingSeason',
    'bestClothingColors',
    'glassShapes',
    'bestHairColors',
    'bestHairstyles',
    'eyebrowTips',
    'undertone',
  ],
  additionalProperties: false,
} as const;

function header(req: RequestLike, name: string): string {
  const value = req.headers[name] ?? req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function isAllowedOrigin(req: RequestLike): boolean {
  const origin = header(req, 'origin');
  if (!origin) return true;

  const configuredOrigin = process.env.APP_ORIGIN?.replace(/\/$/, '');
  if (configuredOrigin) return origin === configuredOrigin;

  const host = header(req, 'x-forwarded-host') || header(req, 'host');
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

function clientId(req: RequestLike): string {
  return (header(req, 'x-forwarded-for').split(',')[0] || header(req, 'x-real-ip') || 'unknown').trim();
}

function consumeRateLimit(id: string, cost: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const current = rateStore.get(id);
  if (!current || current.resetAt <= now) {
    rateStore.set(id, { count: cost, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count + cost > RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += cost;
  return { allowed: true, retryAfter: 0 };
}

function objectBody(value: unknown): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ClientError('Invalid JSON request body.', 400, 'INVALID_BODY');
  }
  return value as JsonObject;
}

function text(value: unknown, field: string, maxLength = 500): string {
  if (typeof value !== 'string' || !value.trim() || value.length > maxLength) {
    throw new ClientError(`Invalid ${field}.`, 400, 'INVALID_INPUT');
  }
  return value.trim();
}

function optionalText(value: unknown, field: string, maxLength = 500): string {
  if (value == null || value === '') return '';
  return text(value, field, maxLength);
}

function image(value: unknown, field: string): string {
  const raw = text(value, field, MAX_IMAGE_CHARS);
  const base64 = raw.includes(',') ? raw.slice(raw.indexOf(',') + 1) : raw;
  if (base64.length < 64 || !/^[A-Za-z0-9+/=\r\n]+$/.test(base64)) {
    throw new ClientError(`Invalid ${field}.`, 400, 'INVALID_IMAGE');
  }
  return base64.replace(/[\r\n]/g, '');
}

function imageUrl(base64: string): string {
  return `data:image/jpeg;base64,${base64}`;
}

function imageFile(base64: string): File {
  return new File([Buffer.from(base64, 'base64')], 'upload.jpg', { type: 'image/jpeg' });
}

function jsonContent(response: OpenAI.Chat.Completions.ChatCompletion): JsonObject {
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('The model returned an empty response.');
  return JSON.parse(content) as JsonObject;
}

class ClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string
  ) {
    super(message);
  }
}

async function handleAction(client: OpenAI, body: JsonObject): Promise<unknown> {
  const action = text(body.action, 'action', 40);
  const textModel = process.env.OPENAI_TEXT_MODEL || 'gpt-4o';
  const imageModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

  if (action === 'validateFace') {
    const base64Image = image(body.base64Image, 'base64Image');
    const response = await client.chat.completions.create({
      model: textModel,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl(base64Image) } },
          { type: 'text', text: 'Does this image contain one clear human face suitable for beauty analysis? Return only the requested JSON.' },
        ],
      }],
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
    return Boolean(jsonContent(response).isFace);
  }

  if (action === 'normalizeProduct') {
    const brand = text(body.brand, 'brand', 100);
    const name = text(body.name, 'name', 160);
    const response = await client.chat.completions.create({
      model: textModel,
      messages: [{ role: 'user', content: `Normalize this cosmetics product without inventing a shade or variant. Brand: ${brand}. Product: ${name}.` }],
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
              description: { type: 'string' },
            },
            required: ['name', 'brand', 'category', 'description'],
            additionalProperties: false,
          },
        },
      },
    });
    return jsonContent(response);
  }

  if (action === 'makeupFromQuiz') {
    const answers = objectBody(body.answers);
    const allowed = ['skinTone', 'eyeShape', 'faceShape', 'vibe', 'occasion'];
    const cleanAnswers = Object.fromEntries(allowed.map((key) => [key, text(answers[key], key, 80)]));
    const response = await client.chat.completions.create({
      model: textModel,
      messages: [{
        role: 'user',
        content: `Create a practical custom makeup look for ${JSON.stringify(cleanAnswers)}. Use only YouTube search-result URLs for tutorials. Use empty strings when there is no celebrity match. Do not make medical claims.`,
      }],
      response_format: { type: 'json_schema', json_schema: { name: 'makeup_analysis', strict: true, schema: MAKEUP_ANALYSIS_SCHEMA } },
    });
    return jsonContent(response);
  }

  if (action === 'analyzeFace' || action === 'celebrityLookAlike') {
    const base64Image = image(body.base64Image, 'base64Image');
    const isCelebrity = action === 'celebrityLookAlike';
    const response = await client.chat.completions.create({
      model: textModel,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl(base64Image) } },
          {
            type: 'text',
            text: isCelebrity
              ? 'Suggest a celebrity-inspired beauty style based on visible, non-sensitive appearance. Do not assert identity or biometric matching. Use YouTube search-result URLs only.'
              : 'Provide cosmetic styling suggestions based only on visible features. Avoid health, ethnicity, personality, or other sensitive-trait inferences.',
          },
        ],
      }],
      response_format: isCelebrity
        ? { type: 'json_schema', json_schema: { name: 'celebrity_analysis', strict: true, schema: MAKEUP_ANALYSIS_SCHEMA } }
        : { type: 'json_schema', json_schema: { name: 'face_analysis', strict: true, schema: FACE_ANALYSIS_SCHEMA } },
    });
    return jsonContent(response);
  }

  if (action === 'inspirationLook') {
    const userFaceImage = image(body.userFaceImage, 'userFaceImage');
    const inspoImage = body.inspoImage ? image(body.inspoImage, 'inspoImage') : '';
    const textDesc = optionalText(body.textDesc, 'textDesc', 500);
    const content: Array<OpenAI.Chat.Completions.ChatCompletionContentPart> = [];
    if (inspoImage) content.push({ type: 'image_url', image_url: { url: imageUrl(inspoImage) } });
    content.push({ type: 'image_url', image_url: { url: imageUrl(userFaceImage) } });
    content.push({
      type: 'text',
      text: `Adapt the inspiration style to the user as a cosmetic tutorial. User description: ${textDesc || 'none'}. Use YouTube search-result URLs only and make no medical or sensitive-trait claims.`,
    });
    const response = await client.chat.completions.create({
      model: textModel,
      messages: [{ role: 'user', content }],
      response_format: { type: 'json_schema', json_schema: { name: 'inspiration_analysis', strict: true, schema: MAKEUP_ANALYSIS_SCHEMA } },
    });
    return jsonContent(response);
  }

  if (action === 'analyzeInventory') {
    if (!Array.isArray(body.base64Images) || body.base64Images.length < 1 || body.base64Images.length > 3) {
      throw new ClientError('Upload between 1 and 3 product images.', 400, 'INVALID_INPUT');
    }
    const images = body.base64Images.map((value, index) => image(value, `base64Images[${index}]`));
    const content: Array<OpenAI.Chat.Completions.ChatCompletionContentPart> = images.map((value) => ({
      type: 'image_url',
      image_url: { url: imageUrl(value) },
    }));
    content.push({ type: 'text', text: 'Identify visible cosmetics products conservatively. Never invent a shade or variant that is not readable.' });
    const response = await client.chat.completions.create({
      model: textModel,
      messages: [{ role: 'user', content }],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'inventory_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: { products: { type: 'array', items: PRODUCT_SCHEMA } },
            required: ['products'],
            additionalProperties: false,
          },
        },
      },
    });
    const result = jsonContent(response).products;
    return Array.isArray(result) ? result : [];
  }

  if (action === 'generateTryOn' || action === 'generateHairTryOn') {
    const faceImage = image(body.faceImage, 'faceImage');
    let prompt: string;
    if (action === 'generateTryOn') {
      const lookDescription = text(body.lookDescription, 'lookDescription', 1200);
      prompt = `Edit the original photo by adding only a realistic cosmetic layer: ${lookDescription}. Preserve the same person, facial geometry, skin tone and texture, expression, hair, lighting, background, clothing, and camera framing. Do not change age, gender presentation, ethnicity, body, or identity.`;
    } else {
      const style = text(body.style, 'style', 100);
      const color = text(body.color, 'color', 100);
      const mode = text(body.mode, 'mode', 20);
      if (!['both', 'keep-style', 'keep-color'].includes(mode)) {
        throw new ClientError('Invalid hair mode.', 400, 'INVALID_INPUT');
      }
      const instruction = mode === 'keep-style'
        ? `Keep the hairstyle and change only the hair color to ${color}.`
        : mode === 'keep-color'
          ? `Keep the hair color and change only the hairstyle to ${style}.`
          : `Change the hair to ${color} ${style}.`;
      prompt = `${instruction} Preserve the same person, face, skin, expression, background, lighting, clothing, and framing. Modify only hair.`;
    }

    const response = await client.images.edit({
      model: imageModel,
      image: imageFile(faceImage),
      prompt,
      size: '1024x1024',
      quality: 'medium',
    });
    const output = response.data?.[0];
    if (output?.b64_json) return `data:image/png;base64,${output.b64_json}`;
    if (output?.url) return output.url;
    throw new Error('The image model returned no image.');
  }

  throw new ClientError('Unknown AI action.', 400, 'UNKNOWN_ACTION');
}

export default async function handler(req: RequestLike, res: ResponseLike): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  if (!isAllowedOrigin(req)) {
    res.status(403).json({ error: 'Request origin is not allowed.', code: 'ORIGIN_NOT_ALLOWED' });
    return;
  }

  const contentLength = Number(header(req, 'content-length') || 0);
  if (contentLength > MAX_BODY_CHARS) {
    res.status(413).json({ error: 'Upload is too large.', code: 'PAYLOAD_TOO_LARGE' });
    return;
  }

  try {
    const body = objectBody(req.body);
    if (JSON.stringify(body).length > MAX_BODY_CHARS) {
      throw new ClientError('Upload is too large.', 413, 'PAYLOAD_TOO_LARGE');
    }

    const action = typeof body.action === 'string' ? body.action : '';
    const cost = action.startsWith('generate') ? 5 : 1;
    const rate = consumeRateLimit(clientId(req), cost);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfter));
      throw new ClientError('Too many AI requests. Please try again later.', 429, 'RATE_LIMITED');
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ClientError('The AI service is not configured.', 503, 'SERVICE_NOT_CONFIGURED');
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const data = await handleAction(client, body);
    res.status(200).json({ data });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.status).json({ error: error.message, code: error.code });
      return;
    }

    const requestId = error && typeof error === 'object' && '_request_id' in error
      ? String((error as { _request_id?: unknown })._request_id || '')
      : '';
    console.error('AI request failed', { requestId, name: error instanceof Error ? error.name : 'UnknownError' });
    res.status(502).json({
      error: 'The AI provider could not complete this request. Please try again.',
      code: 'AI_PROVIDER_ERROR',
    });
  }
}
