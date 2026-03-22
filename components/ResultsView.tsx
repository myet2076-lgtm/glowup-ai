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
    <div className="motion-safe:animate-fade-in-up max-w-2xl mx-auto px-4 py-8 space-y-12">
      {/* ── Header (sticky, editorial) ── */}
      <header className="sticky top-[80px] z-30 bg-[#fffafb]/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-pink-50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-3 text-sm font-medium text-pink-600 hover:text-pink-700 active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
          >
            &larr; Back
          </button>

          <div className="text-center flex-1 min-w-0">
            <h1 className="serif text-3xl sm:text-4xl text-pink-900 tracking-[-0.02em] truncate">
              {analysis.styleName}
            </h1>
            {isCelebrityTwin && analysis.celebrityMatch && (
              <p className="text-xs text-gray-500 mt-1">
                Your twin: {analysis.celebrityMatch}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="min-h-[44px] px-3 text-sm font-medium text-gray-500 hover:text-pink-600 active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
          >
            Restart
          </button>
        </div>
      </header>

      {/* ── Style Overview ── */}
      <section className="space-y-6">
        <h2 className="sr-only">Style Overview</h2>
        <p className="font-light text-gray-600 text-base leading-relaxed">
          {analysis.description}
        </p>
        {analysis.colorPalette.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {analysis.colorPalette.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-500">{color}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Photo Comparison ── */}
      <section className="space-y-3">
        <h2 className="sr-only">Photo Comparison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
          <div className="relative aspect-[3/4] bg-gray-100">
            {userPhoto ? (
              <img
                src={userPhoto}
                className="w-full h-full object-cover"
                alt="Your photo"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Your Photo
              </div>
            )}
            <span className="absolute top-3 left-3 text-xs text-gray-600 uppercase bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
              You
            </span>
          </div>
          <div className="relative aspect-[3/4] bg-pink-50">
            {tryOnImage || inspoPhoto ? (
              <img
                src={tryOnImage || inspoPhoto || ''}
                className="w-full h-full object-cover"
                alt={tryOnImage ? 'AI try-on result' : 'Inspiration'}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm px-4 text-center">
                Try on to preview
              </div>
            )}
            <span className="absolute top-3 left-3 text-xs text-gray-600 uppercase bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
              {tryOnImage ? 'Try-On' : 'Inspiration'}
            </span>
          </div>
        </div>
      </section>

      {/* ── Try-On / Download Button ── */}
      <div className="flex gap-3">
        {!tryOnImage && (
          <button
            type="button"
            onClick={onTryOn}
            className="flex-1 bg-pink-600 hover:bg-pink-700 active:scale-[0.97] text-white px-8 py-4 min-h-[44px] rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-pink-300/50 transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
          >
            Try This Look
          </button>
        )}
        {tryOnImage && (
          <button
            type="button"
            onClick={handleDownload}
            className="min-h-[44px] px-6 py-3 bg-white border border-pink-100 rounded-full text-sm font-medium text-pink-600 hover:bg-pink-50 active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
          >
            Download
          </button>
        )}
      </div>

      {/* ── Tutorial Steps ── */}
      {analysis.tutorialSteps.length > 0 && (
        <section className="space-y-6">
          <h2 className="serif text-2xl text-pink-900 tracking-[-0.02em]">
            Step-by-Step Tutorial
          </h2>
          <div className="space-y-8">
            {analysis.tutorialSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="serif text-2xl text-pink-300 font-light flex-shrink-0 w-8 text-right">
                  {idx + 1}
                </span>
                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-bold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.proTip && (
                    <p className="text-sm italic text-gray-500">{step.proTip}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Product Recommendations ── */}
      {analysis.recommendedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="serif text-2xl text-pink-900 tracking-[-0.02em]">
            Recommended Products
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.recommendedProducts.map((product, i) => {
              const match = getInventoryMatch(product.name);
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-pink-50 p-6 flex flex-col justify-between"
                >
                  <div className="mb-4">
                    {product.brand && (
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                        {product.brand}
                      </p>
                    )}
                    <h3 className="text-sm font-bold text-gray-800">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category}
                      </p>
                    )}
                  </div>
                  {match ? (
                    <p className="text-sm font-medium text-green-600">
                      In Your Collection ✓
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddToWishlist(product)}
                      className="w-full min-h-[44px] py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl text-sm font-medium active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
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
          <h2 className="serif text-2xl text-pink-900 tracking-[-0.02em]">
            Learn More
          </h2>
          <div className="grid gap-3">
            {analysis.tutorialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white rounded-2xl border border-pink-50 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all group focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded-2xl"
              >
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {link.platform}
                  </p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">
                    {link.title}
                  </p>
                </div>
                <span className="text-pink-400 group-hover:text-pink-600 transition-colors text-lg">
                  &rarr;
                </span>
              </a>
            ))}
            {analysis.tikTokSearchQuery && (
              <a
                href={`https://www.tiktok.com/search?q=${encodeURIComponent(analysis.tikTokSearchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white rounded-2xl border border-pink-50 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all group focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded-2xl"
              >
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    TikTok
                  </p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">
                    {analysis.tikTokSearchQuery}
                  </p>
                </div>
                <span className="text-pink-400 group-hover:text-pink-600 transition-colors text-lg">
                  &rarr;
                </span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── Branch Explore ── */}
      {showExplore && (
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px bg-pink-200 flex-1" />
            <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
              Discover More
            </span>
            <div className="h-px bg-pink-200 flex-1" />
          </div>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={onFaceAnalysis}
              className="group flex items-center justify-center gap-2 py-5 px-4 min-h-[44px] bg-white/60 backdrop-blur-sm border border-pink-100 rounded-2xl hover:bg-white/80 hover:border-pink-200 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
            >
              <span className="text-sm font-medium text-gray-600 group-hover:text-pink-600 tracking-wide">
                Analyse your features
              </span>
              <span className="text-sm text-pink-400 group-hover:text-pink-600 transition-colors">
                &rarr;
              </span>
            </button>
            <button
              type="button"
              onClick={onCelebrity}
              className="group flex items-center justify-center gap-2 py-5 px-4 min-h-[44px] bg-white/60 backdrop-blur-sm border border-pink-100 rounded-2xl hover:bg-white/80 hover:border-pink-200 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
            >
              <span className="text-sm font-medium text-gray-600 group-hover:text-pink-600 tracking-wide">
                Find your celebrity twin
              </span>
              <span className="text-sm text-pink-400 group-hover:text-pink-600 transition-colors">
                &rarr;
              </span>
            </button>
            <button
              type="button"
              onClick={onHairLab}
              className="group flex items-center justify-center gap-2 py-5 px-4 min-h-[44px] bg-white/60 backdrop-blur-sm border border-pink-100 rounded-2xl hover:bg-white/80 hover:border-pink-200 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
            >
              <span className="text-sm font-medium text-gray-600 group-hover:text-pink-600 tracking-wide">
                Try a new hairstyle
              </span>
              <span className="text-sm text-pink-400 group-hover:text-pink-600 transition-colors">
                &rarr;
              </span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsView;
