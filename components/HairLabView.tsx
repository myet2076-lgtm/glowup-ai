import React, { useState } from 'react';
import PhotoUpload from './PhotoUpload';

interface Props {
  userPhoto: string | null;
  resultImage: string | null;
  onSetProfile: (img: string | null) => void;
  onTryStyle: (style: string, color: string, mode: 'both' | 'keep-style' | 'keep-color') => void;
  onBack: () => void;
  onRestart: () => void;
}

const HairLabView: React.FC<Props> = ({ userPhoto, resultImage, onSetProfile, onTryStyle, onBack, onRestart }) => {
  const [selectedStyle, setSelectedStyle] = useState('Short Bob');
  const [selectedColor, setSelectedColor] = useState('Platinum Blonde');
  const [mode, setMode] = useState<'both' | 'keep-style' | 'keep-color'>('both');

  const styles = ['Short Bob', 'Long Waves', 'Curtain Bangs', 'High Ponytail', 'Pixie Cut', 'Braids'];
  const colors = ['Platinum Blonde', 'Copper Red', 'Jet Black', 'Pastel Pink', 'Chocolate Brown', 'Honey Balayage'];

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `glowa-hair-${selectedStyle}.png`;
    link.click();
  };

  return (
    <div className="space-y-12 py-8 pt-32 animate-in slide-in-from-bottom-8 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm text-neutral-900 hover:opacity-70 transition-opacity min-h-[44px] px-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded" aria-label="Go back">
          <span className="material-symbols-outlined align-middle" style={{ fontSize: '20px' }}>arrow_back</span>
          <span className="ml-1 align-middle">Back</span>
        </button>
        <h2 className="font-serif text-3xl text-neutral-900 tracking-tight">The Hair Lab</h2>
        <button type="button" onClick={onRestart} className="text-xs text-secondary hover:text-neutral-900 transition-colors min-h-[44px] px-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">Restart</button>
      </div>

      {!userPhoto ? (
        <PhotoUpload
          title="Face Required"
          description="Upload a photo to see how styles look on you. JPEG/PNG only."
          onUpload={onSetProfile}
        />
      ) : (
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-6">
            <div className="relative overflow-hidden editorial-shadow h-[550px] bg-surface-container-high" style={{ borderRadius: '0.25rem' }}>
              <img src={resultImage || userPhoto} className="w-full h-full object-cover transition-all duration-700" alt="Result" />
              {resultImage && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="absolute bottom-6 right-6 bg-white/90 p-3 shadow-xl text-neutral-900 hover:scale-105 transition-transform min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={{ borderRadius: '0.25rem' }}
                  title="Download Result"
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              )}
              <div className="absolute top-6 left-6 text-[10px] bg-black/60 text-white px-3 py-1 uppercase tracking-[0.2em] font-medium" style={{ borderRadius: '0.25rem' }}>
                {resultImage ? 'AI Stylist' : 'Base Look'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSetProfile(null)}
              className="w-full text-xs font-medium text-secondary uppercase tracking-[0.2em] hover:text-neutral-900 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            >
              Change Photo
            </button>
          </div>

          <div className="md:col-span-7 space-y-8">
            <section className="space-y-4">
              <h3 className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em]">Transformation Mode</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <button type="button" onClick={() => setMode('both')} className={`p-3 text-xs min-h-[44px] border transition-colors ${mode === 'both' ? 'border-primary text-neutral-900 bg-surface-container-high' : 'border-outline-variant text-secondary hover:text-neutral-900'}`} style={{ borderRadius: '0.25rem' }}>Change Style + Color</button>
                <button type="button" onClick={() => setMode('keep-style')} className={`p-3 text-xs min-h-[44px] border transition-colors ${mode === 'keep-style' ? 'border-primary text-neutral-900 bg-surface-container-high' : 'border-outline-variant text-secondary hover:text-neutral-900'}`} style={{ borderRadius: '0.25rem' }}>Keep my hairstyle</button>
                <button type="button" onClick={() => setMode('keep-color')} className={`p-3 text-xs min-h-[44px] border transition-colors ${mode === 'keep-color' ? 'border-primary text-neutral-900 bg-surface-container-high' : 'border-outline-variant text-secondary hover:text-neutral-900'}`} style={{ borderRadius: '0.25rem' }}>Keep my hair color</button>
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em]">1. Pick Style</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {styles.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedStyle(s)}
                    disabled={mode === 'keep-style'}
                    className={`p-3 border text-xs min-h-[44px] transition-colors ${selectedStyle === s ? 'border-primary bg-surface-container-high text-neutral-900' : 'border-outline-variant text-secondary hover:text-neutral-900'} disabled:opacity-45 disabled:cursor-not-allowed`}
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em]">2. Pick Color</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colors.map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    disabled={mode === 'keep-color'}
                    className={`p-3 border text-xs min-h-[44px] transition-colors ${selectedColor === c ? 'border-primary bg-surface-container-high text-neutral-900' : 'border-outline-variant text-secondary hover:text-neutral-900'} disabled:opacity-45 disabled:cursor-not-allowed`}
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={() => onTryStyle(selectedStyle, selectedColor, mode)}
              className="w-full py-4 bg-neutral-900 text-white rounded-none font-medium uppercase tracking-[0.2em] text-xs min-h-[44px] hover:bg-black transition-all"
            >
              {mode === 'keep-style' ? 'Change Hair Color' : mode === 'keep-color' ? 'Change Hair Style' : 'Revamp Hair'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HairLabView;
