
import React, { useRef, useState } from 'react';

interface Props {
  onHome: () => void;
  onInventory: () => void;
  onWishlist: () => void;
  onRestart: () => void;
  inventoryCount: number;
  wishlistCount: number;
  masterPhoto: string | null;
  onSetMasterPhoto: (img: string | null) => void;
}

const Header: React.FC<Props> = ({ onHome, onInventory, onWishlist, onRestart, inventoryCount, wishlistCount, masterPhoto, onSetMasterPhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onSetMasterPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-50 px-6 py-4 flex justify-between items-center shadow-sm">
      <div onClick={onHome} className="cursor-pointer group flex items-center space-x-2">
        <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-bold rotate-6 group-hover:rotate-0 transition-transform">G</div>
        <span className="serif text-2xl font-bold text-pink-700">GlowUp</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Vanity Icon (Now first) - Changed to Mirror Icon */}
        <button onClick={onInventory} className="relative p-2 text-gray-400 hover:text-pink-500 transition-colors" title="Digital Vanity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="12 15 12 22"/>
            <line x1="9" y1="22" x2="15" y2="22"/>
          </svg>
          {inventoryCount > 0 && <span className="absolute top-0 right-0 bg-pink-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{inventoryCount}</span>}
        </button>

        {/* Cart Icon (Now second) */}
        <button onClick={onWishlist} className="relative p-2 text-gray-400 hover:text-pink-500 transition-colors" title="Cart">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          {wishlistCount > 0 && <span className="absolute top-0 right-0 bg-pink-400 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{wishlistCount}</span>}
        </button>

        <div className="h-6 w-[1px] bg-pink-100 mx-2"></div>

        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div 
            onClick={() => masterPhoto ? onSetMasterPhoto(null) : fileInputRef.current?.click()}
            className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${masterPhoto ? 'border-pink-500 scale-110 shadow-lg' : 'border-gray-200 hover:border-pink-300'}`}
          >
            {masterPhoto ? <img src={masterPhoto} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-pink-50 flex items-center justify-center text-lg">👤</div>}
          </div>
          
          {showTooltip && (
            <div className="absolute top-full right-0 mt-3 w-52 bg-white p-4 rounded-2xl shadow-2xl border border-pink-50 z-50 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-bold text-pink-600 uppercase mb-2 tracking-widest">Master Profile</p>
              <ul className="text-[10px] text-gray-500 space-y-1 mb-3">
                <li>• Natural lighting</li>
                <li>• No makeup/filters</li>
                <li>• Neutral background</li>
              </ul>
              {masterPhoto ? (
                <button onClick={() => onSetMasterPhoto(null)} className="w-full bg-red-50 text-red-500 py-2 rounded-xl text-[9px] font-bold uppercase">Change Profile</button>
              ) : (
                <p className="text-[9px] text-pink-300 font-bold">Upload to unlock faster features.</p>
              )}
            </div>
          )}
        </div>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/*" />
      </div>
    </header>
  );
};

export default Header;
