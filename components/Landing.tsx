import React from 'react';

interface Props {
  onQuiz: () => void;
  onCelebrity: () => void;
  onInspiration: (hint?: 'upload' | 'selfie') => void;
  onInventory: () => void;
  onFaceAnalysis: () => void;
  onHairLab: () => void;
}

interface FeatureCard {
  title: string;
  label: string;
  onClick: () => void;
}

const Landing: React.FC<Props> = ({ onQuiz, onCelebrity, onInspiration, onFaceAnalysis, onHairLab }) => {
  const features: FeatureCard[] = [
    { title: 'Inspiration Lab', label: 'Upload & Recreate', onClick: () => onInspiration('upload') },
    { title: 'Face Analysis', label: 'Know Your Features', onClick: onFaceAnalysis },
    { title: 'Celebrity Twin', label: 'Find Your Match', onClick: onCelebrity },
    { title: 'Hair Lab', label: 'Try New Styles', onClick: onHairLab },
    { title: 'Style Quiz', label: 'Discover Your Look', onClick: onQuiz },
  ];

  return (
    <div className="motion-safe:animate-fade-in-up pt-24">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center px-8 max-w-screen-2xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center w-full">
          <div className="md:col-span-5 z-10 space-y-10">
            <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] text-neutral-900 tracking-tight">
              Your skin, your style, your AI&#8209;perfected look.
            </h1>
            <p className="text-lg text-secondary max-w-md font-sans leading-relaxed">
              Experience the next generation of beauty. GlowUp AI analyzes your features to curate a personalized aesthetic that feels like you, only more luminous.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onInspiration('upload')}
                className="bg-primary text-white px-10 py-5 rounded-none font-label uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/10 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Upload a look to start
              </button>
            </div>
          </div>
          <div className="md:col-span-7 relative">
            <div className="aspect-square bg-surface-container-low overflow-hidden editorial-shadow">
              <div className="w-full h-full bg-gradient-to-br from-neutral-100 via-rose-50 to-neutral-200 flex items-center justify-center">
                <span className="text-neutral-300 text-6xl">✦</span>
              </div>
            </div>
            {/* Asymmetric Floating Element */}
            <div className="absolute -bottom-10 -left-10 hidden md:block bg-white/90 backdrop-blur-md p-10 rounded-none editorial-shadow max-w-xs border-l-2 border-primary">
              <span className="font-serif italic text-2xl block mb-2 text-neutral-900">The Glow Filter</span>
              <p className="text-[10px] text-secondary font-sans leading-relaxed uppercase tracking-[0.2em]">AI-Optimized Luminosity Profile #042</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Process ── */}
      <section className="bg-surface-container-low py-40 px-8 mb-32">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-24 text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">The Process</h2>
            <div className="w-12 h-px bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="space-y-6">
              <div className="aspect-[4/5] bg-white overflow-hidden editorial-shadow mb-8 group">
                <div className="w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-200 flex items-center justify-center">
                  <span className="text-neutral-300 text-5xl">📸</span>
                </div>
              </div>
              <h3 className="font-serif text-2xl">Capture</h3>
              <p className="text-secondary font-sans leading-relaxed text-sm">Simply upload a photo. Our AI maps 40,000 unique points on your face with clinical precision.</p>
            </div>
            <div className="space-y-6 md:mt-20">
              <div className="aspect-[4/5] bg-white overflow-hidden editorial-shadow mb-8 group">
                <div className="w-full h-full bg-gradient-to-br from-rose-50 to-neutral-100 flex items-center justify-center">
                  <span className="text-neutral-300 text-5xl">🧬</span>
                </div>
              </div>
              <h3 className="font-serif text-2xl">Synthesize</h3>
              <p className="text-secondary font-sans leading-relaxed text-sm">Our neural network cross-references your skin tone and texture against curated professional looks.</p>
            </div>
            <div className="space-y-6">
              <div className="aspect-[4/5] bg-white overflow-hidden editorial-shadow mb-8 group">
                <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                  <span className="text-neutral-300 text-5xl">✨</span>
                </div>
              </div>
              <h3 className="font-serif text-2xl">Refine</h3>
              <p className="text-secondary font-sans leading-relaxed text-sm">Receive a complete beauty blueprint tailored specifically for your unique bone structure and lifestyle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards (Curated for you) ── */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl mb-20 text-center">Curated for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
            {features.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={card.onClick}
                className="space-y-6 text-left group cursor-pointer bg-transparent border-none p-0 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                <div className="aspect-[3/4] bg-neutral-50 overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-50 via-rose-50/30 to-neutral-100 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-neutral-900">{card.title}</h4>
                  <p className="text-secondary font-sans text-[10px] uppercase tracking-widest mt-1">{card.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA Section ── */}
      <section className="mb-40 px-8">
        <div className="max-w-screen-2xl mx-auto bg-neutral-900 overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            <div className="p-16 md:p-24 flex flex-col justify-center space-y-10">
              <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight">Advanced intelligence meets artisanal beauty.</h2>
              <p className="text-neutral-400 text-lg leading-relaxed">Our algorithms are trained on the expertise of world-class artists to ensure your profile is as accurate as it is beautiful.</p>
              <div>
                <button
                  type="button"
                  onClick={() => onInspiration()}
                  className="bg-primary text-white px-12 py-5 rounded-none font-label uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all shadow-xl shadow-black/40 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Start Your Profile
                </button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-700 opacity-60" />
              <div className="absolute inset-0 bg-neutral-900/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
