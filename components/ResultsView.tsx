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
  onFaceAnalysis?: () => void;
  onCelebrity?: () => void;
  onHairLab?: () => void;
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
  isCelebrityTwin,
  onFaceAnalysis,
  onCelebrity,
  onHairLab,
}) => {
  const getInventoryMatch = (productName: string) =>
    inventory.find(
      (i) =>
        productName.toLowerCase().includes(i.name.toLowerCase()) ||
        i.name.toLowerCase().includes(productName.toLowerCase())
    );

  const handleDownload = () => {
    if (!tryOnImage) return;
    const link = document.createElement('a');
    link.download = `glowup-${analysis.styleName}.png`;
    link.href = tryOnImage;
    link.click();
  };

  const showExplore = onFaceAnalysis && onCelebrity && onHairLab;

  return (
    <div className="motion-safe:animate-fade-in-up max-w-2xl mx-auto px-4 py-8 space-y-12 pt-32">
      {/* ── Header (sticky, editorial) ── */}
      <header className="sticky top-[96px] z-30 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-neutral-50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-3 text-xs font-label uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-800 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            &larr; Back
          </button>

          <div className="text-center flex-1 min-w-0">
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 tracking-tight truncate">
              {analysis.styleName}
            </h1>
            {isCelebrityTwin && analysis.celebrityMatch && (
              <p className="text-[10px] text-secondary uppercase tracking-[0.2em] mt-1">
                Your twin: {analysis.celebrityMatch}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="min-h-[44px] px-3 text-xs font-label uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-800 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            Restart
          </button>
        </div>
      </header>

      {/* ── Style Overview ── */}
      <section className="space-y-6">
        <h2 className="sr-only">Style Overview</h2>
        <p className="text-secondary text-lg leading-relaxed font-sans">
          {analysis.description}
        </p>
        {analysis.colorPalette.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {analysis.colorPalette.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full editorial-shadow"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] text-secondary uppercase tracking-widest">{color}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Celebrity Twin Comparison ── */}
      {isCelebrityTwin && analysis.celebrityMatch && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-neutral-900 tracking-[-0.02em]">Your Celebrity Twin</h2>
            <span className="text-[10px] text-secondary uppercase tracking-[0.2em]">AI Match</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* User photo */}
            <div className="relative aspect-[3/4] bg-surface-container-high overflow-hidden" style={{ borderRadius: '0.25rem' }}>
              {userPhoto && <img src={userPhoto} className="w-full h-full object-cover" alt="You" />}
              <span className="absolute top-3 left-3 text-[10px] text-neutral-900 uppercase tracking-[0.2em] bg-white/80 backdrop-blur-sm px-2 py-1" style={{ borderRadius: '0.125rem' }}>You</span>
            </div>
            {/* Celebrity search link */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(analysis.celebrityMatch + ' portrait face')}&tbm=isch`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[3/4] bg-surface-container-low overflow-hidden flex flex-col items-center justify-center p-8 text-center group hover:bg-surface-container-high transition-all duration-300"
              style={{ borderRadius: '0.25rem' }}
            >
              <p className="font-serif italic text-2xl text-neutral-900 mb-3">{analysis.celebrityMatch}</p>
              <p className="text-[10px] text-secondary uppercase tracking-[0.2em] group-hover:text-primary transition-colors duration-300">Click to see photos →</p>
            </a>
          </div>
        </section>
      )}

      {/* ── Photo Comparison (not shown for Celebrity Twin — has its own section above) ── */}
      {!isCelebrityTwin && (
      <section className="space-y-3">
        <h2 className="sr-only">Photo Comparison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden" style={{ borderRadius: '0.25rem' }}>
          <div className="relative aspect-[3/4] bg-surface-container-high">
            {userPhoto ? (
              <img src={userPhoto} className="w-full h-full object-cover" alt="Your photo" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">Your Photo</div>
            )}
            <span className="absolute top-3 left-3 text-[10px] text-neutral-900 uppercase tracking-[0.2em] bg-white/80 backdrop-blur-sm px-2 py-1" style={{ borderRadius: '0.125rem' }}>You</span>
          </div>
          <div className="relative aspect-[3/4] bg-surface-container-low">
            {tryOnImage || inspoPhoto ? (
              <img src={tryOnImage || inspoPhoto || ''} className="w-full h-full object-cover" alt={tryOnImage ? 'AI try-on result' : 'Inspiration'} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm px-4 text-center">Try on to preview</div>
            )}
            <span className="absolute top-3 left-3 text-[10px] text-neutral-900 uppercase tracking-[0.2em] bg-white/80 backdrop-blur-sm px-2 py-1" style={{ borderRadius: '0.125rem' }}>{tryOnImage ? 'Try-On' : 'Inspiration'}</span>
          </div>
        </div>
      </section>
      )}

      {/* ── Try-On / Download Button (not for Celebrity Twin) ── */}
      {!isCelebrityTwin && (
      <div className="flex gap-3">
        {!tryOnImage && (
          <button
            type="button"
            onClick={onTryOn}
            className="flex-1 bg-primary hover:opacity-90 active:scale-[0.97] text-white px-8 py-5 min-h-[44px] rounded-none font-label uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/10 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Try This Look
          </button>
        )}
        {tryOnImage && (
          <button
            type="button"
            onClick={handleDownload}
            className="min-h-[44px] px-6 py-3 bg-surface-container-high hover:bg-neutral-200 text-neutral-900 text-xs font-label uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ borderRadius: '0.25rem' }}
          >
            Download
          </button>
        )}
      </div>
      )}

      {/* ── Tutorial Steps ── */}
      {analysis.tutorialSteps.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-neutral-900 tracking-tight">Step-by-Step Tutorial</h2>
          <div className="space-y-8">
            {analysis.tutorialSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="font-serif text-2xl text-neutral-200 font-light flex-shrink-0 w-8 text-right">
                  {idx + 1}
                </span>
                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-bold text-neutral-900">{step.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{step.instruction}</p>
                  {step.proTip && <p className="text-sm italic text-secondary">{step.proTip}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Product Recommendations ── */}
      {analysis.recommendedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-neutral-900 tracking-tight">Recommended Products</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.recommendedProducts.map((product, i) => {
              const match = getInventoryMatch(product.name);
              return (
                <div key={i} className="bg-white editorial-shadow p-6 flex flex-col justify-between" style={{ borderRadius: '0.25rem' }}>
                  <div className="mb-4">
                    {product.brand && (
                      <p className="text-[10px] text-secondary uppercase tracking-[0.2em] mb-1">{product.brand}</p>
                    )}
                    <h3 className="text-sm font-bold text-neutral-900">{product.name}</h3>
                    {product.category && <p className="text-xs text-secondary mt-1">{product.category}</p>}
                  </div>
                  {match ? (
                    <p className="text-sm font-medium text-green-600">In Your Collection ✓</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddToWishlist(product)}
                      className="w-full min-h-[44px] py-3 bg-surface-container-low hover:bg-surface-container-high text-neutral-900 text-xs font-label uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{ borderRadius: '0.25rem' }}
                    >
                      Add to Wishlist
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Tutorial Links ── */}
      {(analysis.tutorialLinks.length > 0 || analysis.tikTokSearchQuery) && (
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-neutral-900 tracking-tight">Learn More</h2>
          <div className="grid gap-3">
            {analysis.tutorialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white editorial-shadow p-5 hover:-translate-y-0.5 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{ borderRadius: '0.25rem' }}
              >
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-[0.2em]">{link.platform}</p>
                  <p className="text-sm font-medium text-neutral-900 mt-0.5">{link.title}</p>
                </div>
                <span className="text-neutral-300 group-hover:text-primary transition-colors duration-300 text-lg">&rarr;</span>
              </a>
            ))}
            {analysis.tikTokSearchQuery && (
              <a
                href={`https://www.tiktok.com/search?q=${encodeURIComponent(analysis.tikTokSearchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white editorial-shadow p-5 hover:-translate-y-0.5 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{ borderRadius: '0.25rem' }}
              >
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-[0.2em]">TikTok</p>
                  <p className="text-sm font-medium text-neutral-900 mt-0.5">{analysis.tikTokSearchQuery}</p>
                </div>
                <span className="text-neutral-300 group-hover:text-primary transition-colors duration-300 text-lg">&rarr;</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── Branch Explore ── */}
      {showExplore && (
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px bg-neutral-100 flex-1" />
            <span className="text-[10px] text-secondary uppercase tracking-[0.2em] font-medium">Discover More</span>
            <div className="h-px bg-neutral-100 flex-1" />
          </div>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={onFaceAnalysis}
              className="group flex items-center justify-center gap-2 py-5 px-4 min-h-[44px] bg-surface-container-low hover:bg-surface-container-high hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ borderRadius: '0.25rem' }}
            >
              <span className="text-sm font-medium text-secondary group-hover:text-neutral-900 tracking-wide transition-colors duration-300">Analyse your features</span>
              <span className="text-sm text-neutral-300 group-hover:text-primary transition-colors duration-300">&rarr;</span>
            </button>
            <button
              type="button"
              onClick={onCelebrity}
              className="group flex items-center justify-center gap-2 py-5 px-4 min-h-[44px] bg-surface-container-low hover:bg-surface-container-high hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ borderRadius: '0.25rem' }}
            >
              <span className="text-sm font-medium text-secondary group-hover:text-neutral-900 tracking-wide transition-colors duration-300">Find your celebrity twin</span>
              <span className="text-sm text-neutral-300 group-hover:text-primary transition-colors duration-300">&rarr;</span>
            </button>
            <button
              type="button"
              onClick={onHairLab}
              className="group flex items-center justify-center gap-2 py-5 px-4 min-h-[44px] bg-surface-container-low hover:bg-surface-container-high hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ borderRadius: '0.25rem' }}
            >
              <span className="text-sm font-medium text-secondary group-hover:text-neutral-900 tracking-wide transition-colors duration-300">Try a new hairstyle</span>
              <span className="text-sm text-neutral-300 group-hover:text-primary transition-colors duration-300">&rarr;</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsView;
