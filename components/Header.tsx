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
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300 border-b border-neutral-50">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
        <button type="button" onClick={onHome} className="cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-transparent border-none p-0" aria-label="Go to home">
          <span className="text-2xl font-serif italic text-neutral-900">GlowUp AI</span>
        </button>

        <div className="hidden md:flex gap-12 items-center">
          <button type="button" onClick={onHome} className="text-neutral-900 border-b border-primary pb-1 font-label text-xs uppercase tracking-[0.2em] min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer">The AI</button>
          <button type="button" onClick={onInventory} className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 font-label text-xs uppercase tracking-[0.2em] min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-transparent border-none cursor-pointer">Vanity</button>
          <button type="button" onClick={onWishlist} className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 font-label text-xs uppercase tracking-[0.2em] min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-transparent border-none cursor-pointer">Wishlist</button>
        </div>

        <div className="flex items-center gap-6">
          {/* Vanity Icon */}
          <button type="button" onClick={onInventory} className="relative hover:text-primary transition-colors duration-300 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl bg-transparent border-none cursor-pointer p-2" aria-label="Digital Vanity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="12 15 12 22"/>
              <line x1="9" y1="22" x2="15" y2="22"/>
            </svg>
            {inventoryCount > 0 && <span className="absolute top-0 right-0 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{inventoryCount}</span>}
          </button>

          {/* Wishlist Icon */}
          <button type="button" onClick={onWishlist} className="relative hover:text-primary transition-colors duration-300 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl bg-transparent border-none cursor-pointer p-2" aria-label="Wishlist">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {wishlistCount > 0 && <span className="absolute top-0 right-0 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{wishlistCount}</span>}
          </button>

          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setShowTooltip(false);
              }
            }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-10 h-10 min-h-[44px] rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-transparent p-0 ${masterPhoto ? 'border-neutral-900 scale-110' : 'border-neutral-200 hover:border-neutral-900'}`}
              style={masterPhoto ? { boxShadow: '0 20px 40px rgba(0,0,0,0.03)' } : undefined}
              aria-label={masterPhoto ? 'Change profile photo' : 'Upload profile photo'}
            >
              {masterPhoto ? <img src={masterPhoto} alt="Profile photo" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-lg">👤</div>}
            </button>

            {uploadError && <p role="alert" className="text-xs text-red-500 absolute top-full right-0 mt-1 whitespace-nowrap">{uploadError}</p>}

            {showTooltip && (
              <div className="absolute top-full right-0 mt-3 w-52 bg-white p-4 z-50 editorial-shadow" style={{ borderRadius: '0.25rem' }}>
                <p className="text-[10px] font-bold text-neutral-900 uppercase mb-2 tracking-[0.2em]">Master Profile</p>
                <ul className="text-xs text-secondary space-y-1 mb-3">
                  <li>• Natural lighting</li>
                  <li>• No makeup/filters</li>
                  <li>• Neutral background</li>
                </ul>
                {masterPhoto ? (
                  <div className="space-y-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full bg-surface-container-high text-neutral-900 py-2 text-xs font-bold uppercase min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-300 hover:bg-neutral-200" style={{ borderRadius: '0.25rem' }}>Upload New Photo</button>
                    <button type="button" onClick={() => onSetMasterPhoto(null)} className="w-full text-red-400 py-1 text-xs font-medium hover:text-red-600 transition-colors duration-300 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded" aria-label="Remove profile photo">Remove Photo</button>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-900 font-bold">Upload to unlock faster features.</p>
                )}
              </div>
            )}
          </div>
          <input id="profile-upload" name="profile-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/*" />
        </div>
      </div>
    </header>
  );
};

export default Header;
