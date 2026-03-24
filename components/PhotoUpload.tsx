import React, { useRef, useState } from 'react';

interface Props {
  title: string;
  description: string;
  onUpload: (photo: string | null) => void;
  onBack?: () => void;
  compact?: boolean;
  useProfileOption?: boolean;
  onUseProfile?: () => void;
  onSetAsMaster?: (photo: string) => void;
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
    <div className={`${compact ? '' : 'max-w-xl mx-auto py-12 pt-32'} space-y-4 animate-in fade-in`}>
      {onBack && (
        <button type="button" onClick={onBack} className="text-neutral-500 hover:text-neutral-800 flex items-center text-sm transition-colors duration-300 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
          ← Back
        </button>
      )}

      <div className={`relative p-8 border-2 border-dashed ${preview ? 'border-primary bg-secondary-container' : 'border-neutral-200 bg-white'} transition-all duration-300 text-center editorial-shadow`} style={{ borderRadius: '0.25rem' }}>
        {preview ? (
          <div className="space-y-6">
            <div className="relative group max-w-sm mx-auto">
              <img src={preview} alt="Uploaded photo preview" className="w-full object-cover h-[350px] editorial-shadow" style={{ borderRadius: '0.25rem' }} />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-red-500 text-white w-10 h-10 min-h-[44px] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Remove uploaded photo"
              >
                ✕
              </button>

              {showPfpPrompt && !isMasterSet && (
                <div className="absolute inset-x-4 bottom-4 animate-in slide-in-from-bottom-4">
                  <div className="bg-white/95 backdrop-blur p-4 editorial-shadow space-y-2" style={{ borderRadius: '0.25rem' }}>
                    <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-[0.2em]">Set as your profile photo?</p>
                    <p className="text-xs text-secondary leading-tight">Save time! We'll use this for analysis, hair lab, and twin scan automatically.</p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSetPfp}
                        className="flex-grow bg-primary text-white py-2 text-xs font-label uppercase tracking-[0.2em] hover:opacity-90 transition-all duration-300 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        style={{ borderRadius: '0.25rem' }}
                      >
                        Yes, Set as PFP
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPfpPrompt(false)}
                        className="bg-surface-container-high text-neutral-900 px-4 py-2 text-xs font-label uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all duration-300 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        style={{ borderRadius: '0.25rem' }}
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
                className="bg-primary text-white px-10 py-5 rounded-none font-label uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/10 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
              className="cursor-pointer space-y-4 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded outline-none"
            >
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-4xl mx-auto text-neutral-400 group-hover:scale-110 transition-transform duration-300">📷</div>
              <div>
                <h3 className="font-serif text-2xl text-neutral-900">{title}</h3>
                <p className="text-secondary text-xs mt-2 max-w-xs mx-auto leading-relaxed">{description}</p>
                <p className="text-[10px] text-secondary mt-1 uppercase font-label tracking-[0.2em]">Accepts: JPEG, PNG</p>
              </div>
            </div>

            {useProfileOption && onUseProfile && (
              <div className="pt-6 border-t border-neutral-100">
                <p className="text-[10px] text-secondary uppercase tracking-[0.2em] mb-3">Or use existing profile</p>
                <button
                  type="button"
                  onClick={onUseProfile}
                  className="bg-surface-container-high text-neutral-900 px-8 py-3 font-label text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all duration-300 editorial-shadow active:scale-95 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={{ borderRadius: '0.25rem' }}
                >
                  Use Profile Photo
                </button>
              </div>
            )}
          </div>
        )}
        <input id="photo-upload" name="photo-upload" type="file" accept="image/jpeg,image/png" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default PhotoUpload;
