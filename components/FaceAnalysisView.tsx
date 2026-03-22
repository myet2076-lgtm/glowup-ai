
import React from 'react';
import { FaceAnalysisResult } from '../types';

interface Props {
  result: FaceAnalysisResult;
  userPhoto: string | null;
  onBack: () => void;
}

const FaceAnalysisView: React.FC<Props> = ({ result, userPhoto, onBack }) => {
  return (
    <div className="space-y-12 py-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-pink-600 font-bold">← Back</button>
        <h2 className="serif text-4xl text-pink-900">Face Blueprint</h2>
        <div className="w-10"></div>
      </div>

      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white h-[450px]">
            <img src={userPhoto || ''} className="w-full h-full object-cover" />
          </div>
          <div className="bg-pink-50 p-6 rounded-[32px] border border-pink-100 text-center">
            <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Undertone</h4>
            <p className="font-bold text-gray-800">{result.undertone}</p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-8">
          {/* Group 1: Face Shape & Eyebrows */}
          <section className="bg-white p-8 rounded-[40px] shadow-xl border border-pink-50 space-y-6">
             <div className="flex items-center space-x-4 mb-2">
                <span className="text-2xl">📐</span>
                <h3 className="serif text-2xl text-pink-900">Geometry</h3>
             </div>
             <div className="grid grid-cols-2 gap-8">
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Face Shape</label>
                   <p className="text-gray-800 font-bold text-lg">{result.faceShape}</p>
                </div>
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Eyebrow Shape</label>
                   <p className="text-gray-800 font-bold text-lg">{result.eyebrowShape}</p>
                   <p className="text-[10px] text-gray-400 mt-2 italic">{result.eyebrowTips}</p>
                </div>
             </div>
          </section>

          {/* Group 2: Undertone, Color (Season), Jewelry */}
          <section className="bg-white p-8 rounded-[40px] shadow-xl border border-pink-50 space-y-6">
             <div className="flex items-center space-x-4 mb-2">
                <span className="text-2xl">🎨</span>
                <h3 className="serif text-2xl text-pink-900">Colors & Jewelry</h3>
             </div>
             <div className="grid grid-cols-3 gap-6">
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Season</label>
                   <p className="text-gray-800 font-bold">{result.clothingSeason}</p>
                </div>
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Jewelry Tone</label>
                   <p className={`font-black text-lg ${result.jewelryColor === 'Gold' ? 'text-yellow-500' : result.jewelryColor === 'Silver' ? 'text-gray-400' : 'text-rose-400'}`}>
                      {result.jewelryColor}
                   </p>
                </div>
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Reasoning</label>
                   <p className="text-[10px] text-gray-400 leading-tight">{result.jewelryReason}</p>
                </div>
             </div>
             <div className="pt-4 border-t border-pink-50">
                <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Best Clothing Palette</label>
                <div className="flex flex-wrap gap-2">
                   {result.bestClothingColors.map((c, i) => (
                     <span key={i} className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-bold">{c}</span>
                   ))}
                </div>
             </div>
          </section>

          {/* Group 3: Hair Color, Style, Glasses */}
          <section className="bg-white p-8 rounded-[40px] shadow-xl border border-pink-50 space-y-6">
             <div className="flex items-center space-x-4 mb-2">
                <span className="text-2xl">💇‍♀️</span>
                <h3 className="serif text-2xl text-pink-900">Hair & Style</h3>
             </div>
             <div className="grid grid-cols-3 gap-6">
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Hair Colors</label>
                   <ul className="text-xs text-gray-600 space-y-1">
                      {result.bestHairColors.map((h, i) => <li key={i}>• {h}</li>)}
                   </ul>
                </div>
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Hair Styles</label>
                   <ul className="text-xs text-gray-600 space-y-1">
                      {result.bestHairstyles.map((h, i) => <li key={i}>• {h}</li>)}
                   </ul>
                </div>
                <div>
                   <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest block mb-2">Best Glasses</label>
                   <p className="text-xs text-gray-700">{result.glassShapes.join(", ")}</p>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FaceAnalysisView;
