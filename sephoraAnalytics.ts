import { trackEvent } from './analytics';
import type { Product } from './types';

// There is no catalog ID: group equivalent recommendations without sending AI text.
export async function trackSephoraClick(product: Product): Promise<void> {
  try {
    const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
    const identity = JSON.stringify([normalize(product.brand || ''), normalize(product.name)]);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(identity));
    const productId = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    trackEvent('sephora_link_clicked', {
      product_id: `sha256_v1_${productId}`,
      destination: 'sephora',
      source: 'wishlist',
      // Override SDK URL context: never attach the search query or current query string.
      $current_url: window.location.origin,
      $pathname: '/',
      $referrer: '',
      $title: 'Glowa',
    });
  } catch {
    // Analytics is best effort and must never interfere with native link navigation.
  }
}
