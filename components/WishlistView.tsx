import React from 'react';
import { Product } from '../types';

interface Props {
  wishlist: Product[];
  onRemove: (idx: number) => void;
  onBack: () => void;
}

const WishlistView: React.FC<Props> = ({ wishlist, onRemove, onBack }) => {
  return (
    <div className="space-y-8 py-8 pt-32 animate-in slide-in-from-bottom-8 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-neutral-900 hover:opacity-70 transition-opacity min-h-[44px] px-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined align-middle" style={{ fontSize: '20px' }}>arrow_back</span>
          <span className="ml-1 align-middle">Back</span>
        </button>
        <h2 className="text-3xl text-neutral-900 tracking-tight">Your Wishlist</h2>
        <div className="w-20" aria-hidden="true" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-3 bg-white editorial-shadow" style={{ borderRadius: '0.25rem' }}>
            <span className="material-symbols-outlined text-neutral-300" style={{ fontSize: '48px' }}>shopping_bag</span>
            <p className="text-lg text-neutral-400 italic">Your wishlist is empty</p>
            <p className="text-xs text-secondary">Add products from your AI results to compare and shop later.</p>
          </div>
        ) : (
          wishlist.map((item, i) => (
            <div key={i} className="bg-white editorial-shadow p-6 relative space-y-4" style={{ borderRadius: '0.25rem' }}>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                title="Delete item"
                aria-label={`Delete ${item.name}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="pr-10">
                <p className="text-[10px] text-secondary uppercase tracking-[0.2em]">{item.brand || 'Brand'}</p>
                <h4 className="text-neutral-900 text-lg mt-1 leading-tight">{item.name}</h4>
                <p className="text-xs text-secondary mt-1 line-clamp-2">{item.description || 'Saved from your Glow analysis.'}</p>
              </div>

              <a
                href={`https://www.sephora.com/search?keyword=${encodeURIComponent(`${item.brand || ''} ${item.name}`.trim())}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-3 bg-neutral-900 text-white rounded-none font-medium uppercase tracking-[0.2em] text-center text-[10px] min-h-[44px] hover:bg-black transition-all"
              >
                Search on Sephora
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistView;
