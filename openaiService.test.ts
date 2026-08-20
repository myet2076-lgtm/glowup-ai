import { afterEach, describe, expect, it, vi } from 'vitest';
import { AiServiceError, getMakeupFromQuiz, validateFaceImage } from './openaiService';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AI service client', () => {
  it('posts an action to the server-side endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(validateFaceImage('base64-image')).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith('/api/ai', expect.objectContaining({
      method: 'POST',
      credentials: 'same-origin',
    }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      action: 'validateFace',
      base64Image: 'base64-image',
    });
  });

  it('surfaces safe server errors to the UI', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Too many AI requests.', code: 'RATE_LIMITED' }),
    }));

    await expect(getMakeupFromQuiz({
      skinTone: 'medium',
      eyeShape: 'almond',
      faceShape: 'oval',
      vibe: 'natural',
      occasion: 'daily',
    })).rejects.toEqual(expect.objectContaining<Partial<AiServiceError>>({
      status: 429,
      code: 'RATE_LIMITED',
    }));
  });
});
