import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import WishlistView from './WishlistView';
import { trackSephoraClick } from '../sephoraAnalytics';

vi.mock('../sephoraAnalytics', () => ({ trackSephoraClick: vi.fn().mockResolvedValue(undefined) }));
afterEach(() => vi.clearAllMocks());
function findAnchor(node: React.ReactNode): React.ReactElement<any> | undefined {
  for (const child of React.Children.toArray(node)) {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) continue;
    if (child.type === 'a') return child;
    const found = findAnchor(child.props.children);
    if (found) return found;
  }
}
function anchor() {
  const product = { name: 'Example lipstick', brand: 'Example', category: 'lip' };
  return findAnchor(WishlistView({ wishlist: [product], onRemove: vi.fn(), onBack: vi.fn() }))!;
}
describe('Sephora native anchor activation', () => {
  it('preserves href, new-tab behavior and records primary, keyboard and modified clicks once', () => {
    const link = anchor();
    expect(link.props.href).toBe('https://www.sephora.com/search?keyword=Example%20Example%20lipstick');
    expect(link.props.target).toBe('_blank');
    expect(link.props.rel).toBe('noreferrer');
    for (const modifiers of [{ detail: 1 }, { detail: 0 }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }]) {
      const preventDefault = vi.fn();
      link.props.onClick({ button: 0, defaultPrevented: false, preventDefault, ...modifiers });
      expect(preventDefault).not.toHaveBeenCalled();
    }
    expect(trackSephoraClick).toHaveBeenCalledTimes(5);
  });
  it('counts middle click only through auxclick and ignores right/cancelled activations', () => {
    const link = anchor();
    link.props.onClick({ button: 1, defaultPrevented: false });
    link.props.onAuxClick({ button: 1, defaultPrevented: false });
    expect(trackSephoraClick).toHaveBeenCalledTimes(1);
    link.props.onAuxClick({ button: 2, defaultPrevented: false });
    link.props.onAuxClick({ button: 0, defaultPrevented: false });
    link.props.onClick({ button: 0, defaultPrevented: true });
    link.props.onAuxClick({ button: 1, defaultPrevented: true });
    expect(trackSephoraClick).toHaveBeenCalledTimes(1);
  });
});
