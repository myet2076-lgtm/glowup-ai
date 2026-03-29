import React from 'react';

interface Props {
  onQuiz: () => void;
  onCelebrity: () => void;
  onInspiration: (hint?: 'upload' | 'selfie') => void;
  onInventory: () => void;
  onFaceAnalysis: () => void;
  onHairLab: () => void;
}

import cardInspiration from '../assets/card-inspiration.jpg';
import cardFaceAnalysis from '../assets/card-face-analysis.jpg';
import cardCelebrityTwin from '../assets/card-celebrity-twin.jpg';
import cardHairLab from '../assets/card-hair-lab.jpg';
import cardStyleQuiz from '../assets/card-style-quiz.jpg';

const INSPO_IMAGE = cardInspiration;
const FACE_IMAGE = cardFaceAnalysis;
const CELEB_IMAGE = cardCelebrityTwin;
const HAIR_IMAGE = cardHairLab;
const QUIZ_IMAGE = cardStyleQuiz;

const CompactCard = ({ title, label, image, onClick }: { title: string; label: string; image: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="relative aspect-square overflow-hidden editorial-shadow group text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-neutral-900"
    style={{ borderRadius: '0.25rem' }}
  >
    <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
    <div className="absolute inset-0 bg-pink-300/25 backdrop-blur-[2px]" />
    <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-pink-900/50 to-transparent w-full">
      <p className="text-[10px] text-white/60 uppercase tracking-[0.2em]">{label}</p>
      <h4 className="text-sm text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>{title}</h4>
    </div>
  </button>
);

const Landing: React.FC<Props> = ({ onQuiz, onCelebrity, onInspiration, onFaceAnalysis, onHairLab }) => {
  return (
    <div className="motion-safe:animate-fade-in-up">
      {/* ── Split Hero with Feature Showcase ── */}
      <section className="px-4 md:px-8 max-w-screen-2xl mx-auto pt-20 md:pt-28 pb-6 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Left: Hero Text */}
          <div className="md:col-span-5 space-y-5 md:space-y-8">
            <h1 className="text-3xl md:text-6xl leading-[1.05] text-neutral-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
              Your skin, your style, your AI&#8209;perfected look.
            </h1>
            <p className="text-sm md:text-base text-secondary max-w-md font-sans leading-relaxed">
              Experience the next generation of beauty. Glowa analyzes your features to curate a personalized aesthetic.
            </p>
            <button
              type="button"
              onClick={() => onInspiration('upload')}
              className="bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-none font-label uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/10 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full sm:w-auto"
            >
              Upload a look to start
            </button>
          </div>

          {/* Right: Feature Showcase */}
          <div className="md:col-span-7 space-y-3">
            {/* Primary: Inspiration Lab — large card */}
            <button
              type="button"
              onClick={() => onInspiration('upload')}
              className="relative w-full aspect-[2/1] overflow-hidden editorial-shadow group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ borderRadius: '0.25rem' }}
            >
              <img src={INSPO_IMAGE} alt="Recreate any look" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-pink-300/25 backdrop-blur-[2px]" />
              <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-pink-900/50 to-transparent w-full">
                <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] mb-1">Primary Feature</p>
                <h3 className="text-xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>Inspiration Lab</h3>
                <p className="text-xs text-white/80 mt-1">Upload any look — AI adapts it to your face</p>
              </div>
            </button>

            {/* Secondary: compact cards */}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
              <CompactCard title="Face Analysis" label="Know Your Features" image={FACE_IMAGE} onClick={onFaceAnalysis} />
              <CompactCard title="Celebrity Twin" label="Find Your Match" image={CELEB_IMAGE} onClick={onCelebrity} />
              <CompactCard title="Hair Lab" label="Try New Styles" image={HAIR_IMAGE} onClick={onHairLab} />
              <CompactCard title="Style Quiz" label="Discover Your Look" image={QUIZ_IMAGE} onClick={onQuiz} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
