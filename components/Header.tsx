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
  validateFace?: (photo: string) => Promise<boolean>;
}

const Header: React.FC<Props> = ({ onHome, onInventory, onWishlist, onRestart, inventoryCount, wishlistCount, masterPhoto, onSetMasterPhoto, validateFace }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataURL = reader.result as string;
      if (validateFace) {
        const ok = await validateFace(dataURL);
        if (!ok) {
          setUploadError('Please use a clear face selfie.');
          return;
        }
      }
      onSetMasterPhoto(dataURL);
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-50 px-6 py-4 flex justify-between items-center shadow-sm">
      <button type="button" onClick={onHome} className="cursor-pointer group flex items-center space-x-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded-2xl bg-transparent border-none p-0" aria-label="Go to home">
        <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-bold rotate-6 group-hover:rotate-0 transition-transform">G</div>
        <span className="serif text-2xl font-bold text-pink-700">GlowUp</span>
      </button>
      
      <div className="flex items-center space-x-2">
        {/* Vanity Icon (Now first) - Changed to Mirror Icon */}
        <button type="button" onClick={onInventory} className="relative p-2 text-gray-600 hover:text-pink-500 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded-xl" title="Digital Vanity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="12 15 12 22"/>
            <line x1="9" y1="22" x2="15" y2="22"/>
          </svg>
          {inventoryCount > 0 && <span className="absolute top-0 right-0 bg-pink-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{inventoryCount}</span>}
        </button>

        {/* Cart Icon (Now second) */}
        <button type="button" onClick={onWishlist} className="relative p-2 text-gray-600 hover:text-pink-500 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded-xl" title="Cart">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          {wishlistCount > 0 && <span className="absolute top-0 right-0 bg-pink-400 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{wishlistCount}</span>}
        </button>

        <div className="h-6 w-[1px] bg-pink-100 mx-2"></div>

        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            className={`w-10 h-10 min-h-[44px] rounded-full overflow-hidden border-2 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 bg-transparent p-0 ${masterPhoto ? 'border-pink-500 scale-110 shadow-lg' : 'border-gray-200 hover:border-pink-300'}`}
            aria-label={masterPhoto ? 'Change profile photo' : 'Upload profile photo'}
          >
            {masterPhoto ? <img src={masterPhoto} alt="Profile photo" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-pink-50 flex items-center justify-center text-lg">👤</div>}
          </button>
          
          {uploadError && <p role="alert" className="text-xs text-red-500 absolute top-full right-0 mt-1 whitespace-nowrap">{uploadError}</p>}
          
          {showTooltip && (
            <div className="absolute top-full right-0 mt-3 w-52 bg-white p-4 rounded-2xl shadow-2xl border border-pink-50 z-50 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-bold text-pink-600 uppercase mb-2 tracking-widest">Master Profile</p>
              <ul className="text-xs text-gray-600 space-y-1 mb-3">
                <li>• Natural lighting</li>
                <li>• No makeup/filters</li>
                <li>• Neutral background</li>
              </ul>
              {masterPhoto ? (
                <div className="space-y-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full bg-pink-50 text-pink-600 py-2 rounded-xl text-xs font-bold uppercase min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2">Change Profile</button>
                  <button type="button" onClick={() => onSetMasterPhoto(null)} className="w-full text-red-400 py-1 text-xs font-medium hover:text-red-600 transition-colors focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded">Remove Photo</button>
                </div>
              ) : (
                <p className="text-xs text-pink-600 font-bold">Upload to unlock faster features.</p>
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
