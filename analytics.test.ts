import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const sdk = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn(), has_opted_out_capturing: vi.fn(() => false) }));
vi.mock('posthog-js', () => ({ default: sdk }));
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); sdk.has_opted_out_capturing.mockReturnValue(false); vi.stubEnv('VITE_SUPABASE_URL', ''); vi.stubEnv('VITE_POSTHOG_KEY', 'test-only-not-a-real-key'); vi.stubGlobal('navigator', { doNotTrack: '0' }); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('event tracking fallback', () => {
  it('does not initialize or capture without configuration', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', '');
    const { trackEvent } = await import('./analytics');
    trackEvent('sephora_link_clicked'); await settle();
    expect(sdk.init).not.toHaveBeenCalled(); expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('respects Do Not Track and never enables autocapture', async () => {
    vi.stubGlobal('navigator', { doNotTrack: '1' });
    const { trackEvent } = await import('./analytics');
    trackEvent('sephora_link_clicked'); await settle();
    expect(sdk.init).not.toHaveBeenCalled(); expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('honors an existing SDK opt-out', async () => {
    sdk.has_opted_out_capturing.mockReturnValue(true);
    const { trackEvent } = await import('./analytics');
    trackEvent('sephora_link_clicked');
    await vi.waitFor(() => expect(sdk.has_opted_out_capturing).toHaveBeenCalledOnce());
    expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('isolates a capture failure', async () => {
    sdk.capture.mockImplementationOnce(() => { throw new Error('test capture failure'); });
    const { trackEvent } = await import('./analytics');
    expect(() => trackEvent('sephora_link_clicked', { product_id: 'test' })).not.toThrow();
    await settle(); await settle();
    expect(sdk.init).toHaveBeenCalledWith('test-only-not-a-real-key', expect.objectContaining({ autocapture: false }));
    expect(sdk.capture).toHaveBeenCalledOnce();
  });
});
