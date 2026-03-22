import React, { useRef, useState } from 'react';

interface Props {
  title: string;
  description: string;
  onUpload: (photo: string | null) => void;
  onBack?: () => void;
  compact?: boolean;
  useProfileOption?: boolean;
  onUseProfile?: () => void;
  onSetAsMaster?: (photo: string) => void; // New prop to set global PFP
  isMasterSet?: boolean;
}

const PhotoUpload: React.FC<Props> = ({ 
  title, 
  description, 
  onUpload, 
  onBack, 
  compact, 
  useProfileOption, 
  onUseProfile,
  onSetAsMaster,
  isMasterSet
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showPfpPrompt, setShowPfpPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        if (!isMasterSet && onSetAsMaster) {
          setShowPfpPrompt(true);
        }
        if (compact) onUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setShowPfpPrompt(false);
    onUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSetPfp = () => {
    if (preview && onSetAsMaster) {
      onSetAsMaster(preview);
      setShowPfpPrompt(false);
    }
  };

  const handleUploadAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`${compact ? '' : 'max-w-xl mx-auto py-12'} space-y-4 animate-in fade-in`}>
      {onBack && <button type="button" onClick={onBack} className="text-gray-600 hover:text-pink-500 flex items-center text-sm transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded">← Back</button>}

      <div className={`relative p-8 rounded-[40px] border-2 border-dashed ${preview ? 'border-pink-400 bg-pink-50/30' : 'border-pink-100 bg-white'} transition-all text-center`}>
        {preview ? (
          <div className="space-y-6">
            <div className="relative group max-w-sm mx-auto">
              <img src={preview} alt="Uploaded photo preview" className="w-full rounded-3xl shadow-2xl object-cover h-[350px] border-4 border-white transition-transform hover:scale-[1.01]" />
              <button 
                type="button"
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-red-500 text-white w-10 h-10 min-h-[44px] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
                aria-label="Remove uploaded photo"
              >
                ✕
              </button>

              {showPfpPrompt && !isMasterSet && (
                <div className="absolute inset-x-4 bottom-4 animate-in slide-in-from-bottom-4">
                  <div className="bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl border border-pink-100 space-y-2">
                    <p className="text-xs font-black text-pink-600 uppercase tracking-widest">Set as your profile photo?</p>
                    <p className="text-xs text-gray-600 leading-tight">Save time! We'll use this for analysis, hair lab, and twin scan automatically.</p>
                    <div className="flex gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={handleSetPfp}
                        className="flex-grow bg-pink-500 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-pink-600 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
                      >
                        Yes, Set as PFP
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowPfpPrompt(false)}
                        className="bg-white border border-pink-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-gray-50 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!compact && (
              <button 
                type="button"
                onClick={() => onUpload(preview)}
                className="bg-pink-500 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-pink-600 hover:-translate-y-1 transition-all active:scale-95 text-sm uppercase tracking-widest min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
              >
                Analyze Now
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6 py-12">
            <div 
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={handleUploadAreaKeyDown}
              className="cursor-pointer space-y-4 group focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded-3xl outline-none"
            >
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl mx-auto text-pink-500 group-hover:scale-110 transition-transform">📷</div>
              <div>
                <h3 className="serif text-2xl text-pink-900 font-bold">{title}</h3>
                <p className="text-gray-600 text-xs mt-2 max-w-xs mx-auto leading-relaxed">{description}</p>
                <p className="text-xs text-pink-600 mt-1 uppercase font-bold tracking-widest">Accepts: JPEG, PNG</p>
              </div>
            </div>

            {useProfileOption && onUseProfile && (
              <div className="pt-6 border-t border-pink-50">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Or use existing profile</p>
                <button 
                  type="button"
                  onClick={onUseProfile}
                  className="bg-white border-2 border-pink-200 text-pink-500 px-8 py-3 rounded-full font-bold text-xs hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm active:scale-95 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
                >
                  Use Profile Photo
                </button>
              </div>
            )}
          </div>
        )}
        <input type="file" accept="image/jpeg,image/png" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default PhotoUpload;
