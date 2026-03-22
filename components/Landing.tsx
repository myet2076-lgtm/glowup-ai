import React, { useRef, useState } from 'react';

interface Props {
  onQuiz: () => void;
  onCelebrity: () => void;
  onInspiration: (hint?: 'upload' | 'selfie') => void;
  onInventory: () => void;
  onFaceAnalysis: () => void;
  onHairLab: () => void;
}

const ExploreItem = ({ label, onClick, tabIndex }: { label: string; onClick: () => void; tabIndex: number }) => (
  <button
    onClick={onClick}
    tabIndex={tabIndex}
    className="group flex items-center justify-center gap-2 py-5 px-4 min-h-[44px] bg-white/60 backdrop-blur-sm border border-pink-100 rounded-2xl hover:bg-white/80 hover:border-pink-200 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.97] transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
  >
    <span className="text-xs font-medium text-gray-600 group-hover:text-pink-600 tracking-wide">
      {label}
    </span>
    <span className="text-xs text-pink-400 group-hover:text-pink-600 transition-colors">&rarr;</span>
  </button>
);

const Landing: React.FC<Props> = ({ onQuiz, onCelebrity, onInspiration, onFaceAnalysis, onHairLab }) => {
  const [exploreOpen, setExploreOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (exploreOpen) {
      if (panelRef.current && panelRef.current.contains(document.activeElement)) {
        toggleRef.current?.focus();
      }
      setExploreOpen(false);
    } else {
      setExploreOpen(true);
    }
  };

  return (
    <div className="motion-safe:animate-fade-in-up py-12 sm:py-20">
      {/* Hero */}
      <div className="relative max-w-xl mx-auto text-center px-6 sm:px-0">
        <div
          className="pointer-events-none absolute inset-0 -top-24 -bottom-24"
          style={{ background: 'radial-gradient(ellipse at center, rgba(244,114,182,0.06) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <p className="relative text-pink-600 uppercase tracking-[0.3em] text-xs font-medium mb-8">GlowUp AI</p>

        <h1 className="relative serif text-5xl sm:text-6xl md:text-7xl text-pink-900 leading-[1.08] tracking-[-0.02em]">
          Upload a look you love.<br />
          <span className="italic text-rose-600">We&rsquo;ll make it yours.</span>
        </h1>

        <div className="mx-auto mt-10 mb-8 h-px w-12 bg-pink-200" />

        <p className="relative font-light text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
          Snap or upload any inspiration photo and get a personalised beauty breakdown in seconds.
        </p>

        <div className="relative mt-12 flex flex-col items-center gap-4">
          <button
            onClick={() => onInspiration('upload')}
            className="bg-pink-600 hover:bg-pink-700 active:scale-[0.97] text-white px-12 py-4 min-h-[44px] rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-pink-300/50 transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
          >
            Upload Inspiration
          </button>
          <button
            onClick={() => onInspiration('selfie')}
            className="text-sm text-pink-600 hover:text-pink-700 underline underline-offset-4 decoration-pink-300 hover:decoration-pink-500 transition-all py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
          >
            or start with your selfie &rarr;
          </button>
        </div>
      </div>

      {/* Quiz fallback */}
      <div className="text-center mt-20">
        <button
          onClick={onQuiz}
          className="group inline-flex items-center gap-1.5 py-3 px-4 min-h-[44px] text-pink-600 hover:text-pink-700 transition-colors text-sm font-medium focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
        >
          <span className="text-gray-600">Not sure what you want?</span>
          <span className="underline underline-offset-4 decoration-pink-300 group-hover:decoration-pink-500 transition-colors">Take a style quiz</span>
        </button>
      </div>

      {/* Explore section */}
      <div className="text-center mt-20">
        <button
          ref={toggleRef}
          onClick={handleToggle}
          aria-expanded={exploreOpen}
          aria-controls="explore-panel"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-gray-600 hover:text-pink-600 transition-colors py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
        >
          <span>Explore more</span>
          <span
            className="transition-transform duration-300"
            style={{ transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </span>
        </button>

        <div
          ref={panelRef}
          id="explore-panel"
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: exploreOpen ? '500px' : '0px',
            opacity: exploreOpen ? 1 : 0,
            pointerEvents: exploreOpen ? 'auto' : 'none',
          }}
          aria-hidden={!exploreOpen}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto px-4 sm:px-0 pt-8">
            <ExploreItem label="Face Analysis" onClick={onFaceAnalysis} tabIndex={exploreOpen ? 0 : -1} />
            <ExploreItem label="Hair Lab" onClick={onHairLab} tabIndex={exploreOpen ? 0 : -1} />
            <ExploreItem label="Celebrity Twin" onClick={onCelebrity} tabIndex={exploreOpen ? 0 : -1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
