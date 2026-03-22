
import React from 'react';
import { Product } from '../types';

interface Props {
  wishlist: Product[];
  onRemove: (idx: number) => void;
  onBack: () => void;
  onRestart: () => void;
}

const WishlistView: React.FC<Props> = ({ wishlist, onRemove, onBack, onRestart }) => {
  return (
    <div className="space-y-8 py-8 animate-in slide-in-from-bottom-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-pink-600 font-bold">← Back</button>
        <h2 className="serif text-4xl text-pink-900">Your Cart</h2>
        <button onClick={onRestart} className="text-gray-400 font-bold text-sm">Restart</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.length === 0 ? (
          <div className="col-span-full py-32 text-center space-y-6 bg-white rounded-[50px] border-2 border-dashed border-pink-100">
            <div className="text-7xl opacity-20">🛒</div>
            <p className="text-gray-400 font-bold italic tracking-widest uppercase text-xs">Your shopping bag is empty.</p>
          </div>
        ) : (
          wishlist.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-pink-50 space-y-6 relative group hover:-translate-y-2 transition-all">
              <button 
                onClick={() => onRemove(i)}
                className="absolute top-6 right-6 text-gray-200 hover:text-red-500 transition-colors w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full"
                title="Delete item"
              >
                ✕
              </button>
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-pink-100">🛍️</div>
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">{item.brand}</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800 text-lg leading-tight uppercase tracking-tight">{item.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 italic leading-relaxed">{item.description}</p>
              </div>
              <a 
                href={`https://www.sephora.com/search?keyword=${encodeURIComponent(item.brand + ' ' + item.name)}`}
                target="_blank"
                className="block w-full py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-center text-[10px] shadow-xl hover:bg-black transition-all"
              >
                Buy Now
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistView;
