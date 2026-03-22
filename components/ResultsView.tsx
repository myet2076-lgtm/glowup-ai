
import React from 'react';
import { MakeupAnalysis, Product } from '../types';

interface Props {
  analysis: MakeupAnalysis;
  inventory: Product[];
  userPhoto: string | null;
  inspoPhoto: string | null;
  onBack: () => void;
  onRestart: () => void;
  onTryOn: () => void;
  onAddToWishlist: (p: Product) => void;
  tryOnImage: string | null;
  isCelebrityTwin?: boolean;
}

const ResultsView: React.FC<Props> = ({ 
  analysis, 
  inventory, 
  userPhoto, 
  inspoPhoto, 
  onBack, 
  onRestart, 
  onTryOn, 
  onAddToWishlist, 
  tryOnImage,
  isCelebrityTwin 
}) => {
  const getInventoryMatch = (productName: string) => {
    return inventory.find(i => productName.toLowerCase().includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(productName.toLowerCase()));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `glowup-${analysis.styleName}.png`;
    link.href = tryOnImage || userPhoto || '';
    link.click();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube': return '📺';
      case 'Vogue': return '💎';
      case 'Allure': return '💄';
      case 'TikTok': return '📱';
      default: return '▶️';
    }
  };

  const getProductEmoji = (category?: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('lip')) return '💄';
    if (cat.includes('eye') || cat.includes('mascara')) return '👁️';
    if (cat.includes('foundation') || cat.includes('face')) return '🧴';
    if (cat.includes('blush') || cat.includes('palette')) return '🎨';
    return '✨';
  };

  return (
    <div className="space-y-12 py-8 animate-in fade-in">
      <div className="flex items-center justify-between sticky top-[80px] z-30 bg-[#fffafb]/80 backdrop-blur-md py-2 border-b border-pink-50">
        <button onClick={onBack} className="text-pink-600 font-bold flex items-center">← Back</button>
        <div className="text-center">
           <h1 className="serif text-4xl text-pink-900">{analysis.styleName}</h1>
           {isCelebrityTwin && analysis.celebrityMatch && (
             <p className="text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your Twin: {analysis.celebrityMatch}</p>
           )}
        </div>
        <button onClick={onRestart} className="text-gray-400 hover:text-pink-500 font-bold text-sm">Restart</button>
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-8">
           {isCelebrityTwin && analysis.celebrityMatch && (
             <div className="bg-white p-8 rounded-[40px] shadow-xl border border-pink-50 space-y-6 animate-in zoom-in duration-500">
               <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Twin Comparison</h3>
                 <span className="bg-pink-500 text-white text-[8px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Perfect Match</span>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm ring-1 ring-pink-50">
                   <img src={userPhoto || ''} className="w-full h-full object-cover" alt="You" />
                 </div>
                 <a 
                   href={`https://www.google.com/search?q=${encodeURIComponent(analysis.celebrityMatch! + ' portrait face')}&tbm=isch`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="aspect-[3/4] rounded-2xl overflow-hidden bg-pink-50 border-2 border-pink-100 shadow-sm flex flex-col items-center justify-center p-6 text-center group hover:bg-pink-100 transition-colors"
                 >
                   <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔍</span>
                   <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest leading-tight">Click to see {analysis.celebrityMatch}</p>
                   <p className="text-[8px] text-gray-400 mt-2 italic">Gallery opens in new tab</p>
                 </a>
               </div>

               <div className="text-center pt-2">
                 <p className="font-black text-gray-800 text-lg serif italic">{analysis.celebrityMatch}</p>
                 <div className="h-px bg-pink-100 w-12 mx-auto my-2"></div>
                 <p className="text-[9px] text-pink-400 uppercase font-bold tracking-[0.2em]">Celebrity Aesthetic Match</p>
               </div>
             </div>
           )}

           <div className="grid grid-cols-2 gap-1 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl h-[450px] bg-pink-50 relative group">
              <div className="relative overflow-hidden bg-gray-100">
                 {userPhoto ? <img src={userPhoto} className="w-full h-full object-cover" alt="User" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">Profile Pic</div>}
                 <div className="absolute top-4 left-4 text-[8px] bg-black/40 text-white px-2 py-1 rounded-full font-bold uppercase tracking-widest">Base</div>
              </div>
              <div className="relative overflow-hidden bg-pink-100">
                 {(tryOnImage || inspoPhoto) ? <img src={tryOnImage || inspoPhoto || ''} className="w-full h-full object-cover animate-in fade-in" alt="AI Goal" /> : <div className="w-full h-full flex items-center justify-center text-pink-300 italic text-xs p-8 text-center">Ready for magic?</div>}
                 <div className="absolute top-4 left-4 text-[8px] bg-pink-500 text-white px-2 py-1 rounded-full font-bold uppercase tracking-widest">{tryOnImage ? 'AI Try-On' : 'Inspiration'}</div>
              </div>
           </div>

           <div className="flex gap-4">
             {!tryOnImage && (
               <button onClick={onTryOn} className="flex-grow py-5 bg-pink-500 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-transform">
                 Apply AI Magic ✨
               </button>
             )}
             {(tryOnImage || userPhoto) && (
               <button onClick={handleDownload} className="bg-white border-2 border-pink-100 p-5 rounded-[24px] text-pink-500 shadow-md hover:bg-pink-50 transition-colors" title="Download Result">
                 💾
               </button>
             )}
           </div>

           <div className="bg-white p-8 rounded-[40px] shadow-xl border border-pink-50 space-y-6">
              <h3 className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Style Palette</h3>
              <div className="flex flex-wrap gap-4">
                {analysis.colorPalette.map((c, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110" style={{ backgroundColor: c }}></div>
                    <span className="text-[7px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">{c}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="md:col-span-7 space-y-12">
           <section className="space-y-8">
              <h3 className="serif text-3xl text-pink-900 border-l-4 border-pink-400 pl-4">Step-by-Step Tutorial</h3>
              <div className="space-y-10">
                {analysis.tutorialSteps.map((s, idx) => (
                  <div key={idx} className="flex space-x-6 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center font-bold text-lg shadow-sm border border-pink-100 group-hover:bg-pink-500 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div className="w-full space-y-3">
                       <h4 className="font-bold text-gray-800 uppercase tracking-tight text-sm flex items-center">
                          {s.title}
                          <span className="ml-2 h-[1px] bg-pink-100 flex-grow"></span>
                       </h4>
                       <p className="text-gray-500 text-xs leading-relaxed">{s.instruction}</p>
                       <div className="bg-[#fffafb] p-4 rounded-2xl border-l-4 border-pink-300 shadow-sm">
                         <p className="text-[9px] text-pink-400 font-black uppercase tracking-widest mb-1">Mirror Tip</p>
                         <p className="text-[11px] text-gray-400 italic leading-relaxed">{s.proTip}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </section>

           <section className="space-y-6">
              <h3 className="serif text-3xl text-pink-900">Tutorial Search</h3>
              <p className="text-gray-400 text-xs italic">YouTube video embedding is restricted. Click below to view the latest search results on YouTube directly.</p>
              <div className="grid gap-4">
                 {analysis.tutorialLinks.map((l, i) => (
                   <a 
                    key={i} 
                    href={l.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-6 bg-white rounded-3xl border border-pink-50 shadow-sm hover:translate-x-1 hover:shadow-md transition-all group"
                   >
                      <div className="flex items-center space-x-4">
                         <span className="text-3xl group-hover:scale-110 transition-transform">{getPlatformIcon(l.platform)}</span>
                         <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight">{l.title}</p>
                            <p className="text-[10px] text-pink-400 font-black uppercase tracking-wider mt-1">Search Tutorials on {l.platform}</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-2 text-pink-300 font-bold group-hover:text-pink-500 transition-colors">
                        <span className="text-xs font-black">SEARCH</span>
                        <span className="text-xl">↗</span>
                      </div>
                   </a>
                 ))}
                 {analysis.tikTokSearchQuery && (
                   <a 
                    href={`https://www.tiktok.com/search?q=${encodeURIComponent(analysis.tikTokSearchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-black rounded-3xl shadow-lg hover:translate-x-1 transition-all group"
                   >
                      <div className="flex items-center space-x-4">
                         <span className="text-3xl">📱</span>
                         <div>
                            <p className="font-bold text-white text-sm">Explore on TikTok</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mt-1">Search: {analysis.tikTokSearchQuery}</p>
                         </div>
                      </div>
                      <span className="text-white opacity-20 group-hover:opacity-100 transition-all text-xl">↗</span>
                   </a>
                 )}
              </div>
           </section>

           <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="serif text-3xl text-pink-900">Your Product Kit</h3>
                <span className="text-[9px] font-black text-pink-300 uppercase">Match Analytics</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {analysis.recommendedProducts.map((p, i) => {
                  const match = getInventoryMatch(p.name);
                  return (
                    <div key={i} className={`p-6 rounded-[32px] border ${match ? 'border-green-100 bg-green-50/20' : 'border-pink-50 bg-white'} shadow-sm flex flex-col justify-between group transition-all hover:-translate-y-1`}>
                       <div className="mb-6 flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-black text-pink-300 uppercase block mb-1 tracking-[0.2em]">{p.brand}</span>
                            <h5 className="font-bold text-gray-800 text-sm leading-tight">{p.name}</h5>
                          </div>
                          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-xl shadow-inner">
                            {getProductEmoji(p.category)}
                          </div>
                       </div>
                       {!match ? (
                         <button 
                          onClick={() => onAddToWishlist(p)} 
                          className="w-full py-3 bg-pink-500 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-black transition-colors"
                         >
                           Add to Wishlist
                         </button>
                       ) : (
                         <div className="text-[9px] bg-green-500 text-white py-2 rounded-xl text-center font-bold uppercase tracking-widest shadow-md">On Your Shelf</div>
                       )}
                    </div>
                  );
                })}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
