import type { FaceAnalysisResult, MakeupAnalysis, Product, QuizAnswers } from './types';

type AiAction =
  | 'validateFace'
  | 'normalizeProduct'
  | 'makeupFromQuiz'
  | 'analyzeFace'
  | 'celebrityLookAlike'
  | 'inspirationLook'
  | 'analyzeInventory'
  | 'generateTryOn'
  | 'generateHairTryOn';

interface ApiErrorBody {
  error?: string;
  code?: string;
}

export class AiServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code = 'AI_REQUEST_FAILED'
  ) {
    super(message);
    this.name = 'AiServiceError';
  }
}

export function getAiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof AiServiceError ? error.message : fallback;
}

async function callAi<T>(action: AiAction, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });

  let body: (ApiErrorBody & { data?: T }) | null = null;
  try {
    body = (await response.json()) as ApiErrorBody & { data?: T };
  } catch {
    // The hosting layer may return a non-JSON error page.
  }

  if (!response.ok || body?.data === undefined) {
    throw new AiServiceError(
      body?.error || 'The AI service is temporarily unavailable. Please try again.',
      response.status,
      body?.code
    );
  }

  return body.data;
}

export const validateFaceImage = (base64Image: string): Promise<boolean> =>
  callAi<boolean>('validateFace', { base64Image });

export const normalizeProduct = (brand: string, name: string): Promise<Product> =>
  callAi<Product>('normalizeProduct', { brand, name });

export const getMakeupFromQuiz = (answers: QuizAnswers): Promise<MakeupAnalysis> =>
  callAi<MakeupAnalysis>('makeupFromQuiz', { answers });

export const analyzeFaceFeatures = (base64Image: string): Promise<FaceAnalysisResult> =>
  callAi<FaceAnalysisResult>('analyzeFace', { base64Image });

export const analyzeCelebrityLookAlike = (base64Image: string): Promise<MakeupAnalysis> =>
  callAi<MakeupAnalysis>('celebrityLookAlike', { base64Image });

export const analyzeInspirationLook = (
  inspoImage: string | null,
  userFaceImage: string,
  textDesc: string
): Promise<MakeupAnalysis> =>
  callAi<MakeupAnalysis>('inspirationLook', { inspoImage, userFaceImage, textDesc });

export const analyzeInventory = (base64Images: string[]): Promise<Product[]> =>
  callAi<Product[]>('analyzeInventory', { base64Images });

export const generateTryOn = (faceImage: string, lookDescription: string): Promise<string> =>
  callAi<string>('generateTryOn', { faceImage, lookDescription });

export const generateHairTryOn = (
  faceImage: string,
  style: string,
  color: string,
  mode: 'both' | 'keep-style' | 'keep-color' = 'both'
): Promise<string> => callAi<string>('generateHairTryOn', { faceImage, style, color, mode });
