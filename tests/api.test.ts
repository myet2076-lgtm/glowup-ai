import { afterEach, describe, expect, it, vi } from 'vitest';
import aiHandler from '../api/ai';
import healthHandler from '../api/health';

function responseMock() {
  const result = { statusCode: 0, body: undefined as unknown, headers: {} as Record<string, string> };
  const response = {
    status(code: number) {
      result.statusCode = code;
      return response;
    },
    json(body: unknown) {
      result.body = body;
    },
    setHeader(name: string, value: string) {
      result.headers[name] = value;
    },
  };
  return { response, result };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('AI API boundary', () => {
  it('allows POST only', async () => {
    const { response, result } = responseMock();
    await aiHandler({ method: 'GET', headers: {} }, response);
    expect(result.statusCode).toBe(405);
    expect(result.headers.Allow).toBe('POST');
  });

  it('rejects cross-origin requests', async () => {
    const { response, result } = responseMock();
    await aiHandler({
      method: 'POST',
      body: { action: 'validateFace', base64Image: 'a'.repeat(100) },
      headers: { origin: 'https://attacker.example', host: 'glowa.example' },
    }, response);
    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual(expect.objectContaining({ code: 'ORIGIN_NOT_ALLOWED' }));
  });

  it('fails safely when the server key is absent', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');
    const { response, result } = responseMock();
    await aiHandler({
      method: 'POST',
      body: { action: 'validateFace', base64Image: 'a'.repeat(100) },
      headers: { origin: 'https://glowa.example', host: 'glowa.example' },
    }, response);
    expect(result.statusCode).toBe(503);
    expect(result.body).toEqual(expect.objectContaining({ code: 'SERVICE_NOT_CONFIGURED' }));
  });
});

describe('health API', () => {
  it('reports configuration without exposing a key', () => {
    vi.stubEnv('OPENAI_API_KEY', 'secret-value');
    const { response, result } = responseMock();
    healthHandler({}, response);
    expect(result.statusCode).toBe(200);
    expect(JSON.stringify(result.body)).not.toContain('secret-value');
  });
});
