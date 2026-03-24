
import React, { useState } from 'react';
import PhotoUpload from './PhotoUpload';

interface Props {
  userPhoto: string | null;
  resultImage: string | null;
  onSetProfile: (img: string | null) => void;
  onTryStyle: (style: string, color: string) => void;
  onBack: () => void;
  onRestart: () => void;
}

const HairLabView: React.FC<Props> = ({ userPhoto, resultImage, onSetProfile, onTryStyle, onBack, onRestart }) => {
  const [selectedStyle, setSelectedStyle] = useState('Short Bob');
  const [selectedColor, setSelectedColor] = useState('Platinum Blonde');

  const styles = ['Short Bob', 'Long Waves', 'Curtain Bangs', 'High Ponytail', 'Pixie Cut', 'Braids'];
  const colors = ['Platinum Blonde', 'Copper Red', 'Jet Black', 'Pastel Pink', 'Chocolate Brown', 'Honey Balayage'];

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `glowup-hair-${selectedStyle}.png`;
    link.click();
  };

  return (
    <div className="space-y-12 py-8 pt-32 animate-in slide-in-from-bottom-8 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-pink-600 font-bold">← Back</button>
        <h2 className="serif text-4xl text-pink-900">The Hair Lab</h2>
        <button onClick={onRestart} className="text-gray-400 font-bold text-sm">Restart</button>
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
            <div className="relative rounded-[50px] overflow-hidden shadow-2xl border-8 border-white h-[550px] bg-pink-50 group">
              <img src={resultImage || userPhoto} className="w-full h-full object-cover transition-all duration-700" alt="Result" />
              {resultImage && (
                <button 
                  onClick={handleDownload}
                  className="absolute bottom-6 right-6 bg-white/90 p-4 rounded-full shadow-2xl text-pink-500 hover:scale-110 transition-transform"
                  title="Download Result"
                >
                  💾
                </button>
              )}
              <div className="absolute top-6 left-6 text-[8px] bg-black/40 text-white px-3 py-1.5 rounded-full uppercase tracking-widest font-bold">
                 {resultImage ? 'AI Stylist' : 'Base Look'}
              </div>
            </div>
            <button 
              onClick={() => onSetProfile(null)}
              className="w-full text-xs font-bold text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors"
            >
              Change Photo
            </button>
          </div>

          <div className="md:col-span-7 space-y-10">
            <section className="space-y-6">
              <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.3em] pl-2 border-l-2 border-pink-200">1. Pick Style</h3>
              <div className="grid grid-cols-3 gap-4">
                {styles.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedStyle(s)}
                    className={`p-5 rounded-[24px] border-2 transition-all text-xs font-bold ${selectedStyle === s ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-lg scale-105' : 'border-pink-50 bg-white text-gray-400 hover:border-pink-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.3em] pl-2 border-l-2 border-pink-200">2. Pick Color</h3>
              <div className="grid grid-cols-3 gap-4">
                {colors.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedColor(c)}
                    className={`p-5 rounded-[24px] border-2 transition-all text-xs font-bold ${selectedColor === c ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-lg scale-105' : 'border-pink-50 bg-white text-gray-400 hover:border-pink-200'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            <button 
              onClick={() => onTryStyle(selectedStyle, selectedColor)}
              className="w-full py-6 bg-pink-500 text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl hover:bg-pink-600 transition-all active:scale-95"
            >
              Revamp My Hair AI ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HairLabView;
