import { webcrypto } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent } from './analytics';
import { trackSephoraClick } from './sephoraAnalytics';

vi.mock('./analytics', () => ({ trackEvent: vi.fn() }));
afterEach(() => { vi.clearAllMocks(); vi.unstubAllGlobals(); });

describe('Sephora click privacy and failure isolation', () => {
  it('groups equivalent products with a stable opaque ID and sends no free text or query', async () => {
    vi.stubGlobal('crypto', webcrypto);
    vi.stubGlobal('window', { location: { origin: 'https://www.glowa.beauty', search: '?private=do-not-send' } });
    const product = { name: '  Example  Lipstick ', brand: 'BRAND', category: 'private category', description: 'private analysis', image: 'private photo', sephoraUrl: 'https://example.test/?private=query' };
    await trackSephoraClick(product);
    await trackSephoraClick({ ...product, brand: 'brand', name: 'example lipstick' });
    const calls = vi.mocked(trackEvent).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[0][0]).toBe('sephora_link_clicked');
    expect(calls[0][1]).toEqual({ product_id: expect.stringMatching(/^sha256_v1_[a-f0-9]{64}$/), destination: 'sephora', source: 'wishlist', $current_url: 'https://www.glowa.beauty', $pathname: '/', $referrer: '', $title: 'Glowa' });
    expect(calls[0][1]!.product_id).toBe(calls[1][1]!.product_id);
    expect(JSON.stringify(calls)).not.toMatch(/lipstick|BRAND|private|photo|analysis/);
  });

  it('swallows unavailable crypto and capture failures', async () => {
    vi.stubGlobal('crypto', undefined);
    await expect(trackSephoraClick({ name: 'Example', category: 'makeup' })).resolves.toBeUndefined();
    expect(trackEvent).not.toHaveBeenCalled();
    vi.stubGlobal('crypto', webcrypto);
    vi.stubGlobal('window', { location: { origin: 'https://www.glowa.beauty' } });
    vi.mocked(trackEvent).mockImplementationOnce(() => { throw new Error('capture failed'); });
    await expect(trackSephoraClick({ name: 'Example', category: 'makeup' })).resolves.toBeUndefined();
  });
});
