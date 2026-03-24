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
  icon: string;
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
  primary?: boolean;
}

const Landing: React.FC<Props> = ({ onQuiz, onCelebrity, onInspiration, onFaceAnalysis, onHairLab }) => {
  const cards: FeatureCard[] = [
    {
      icon: '📸',
      title: 'Recreate Any Look',
      desc: 'Upload a photo of any makeup style or describe the look you want. We\u2019ll analyze it, adapt it to your features, and give you a step-by-step tutorial.',
      cta: 'Upload Inspiration',
      onClick: () => onInspiration('upload'),
      primary: true,
    },
    {
      icon: '\u{1F441}\uFE0F',
      title: 'Know Your Features',
      desc: 'Get a detailed analysis of your face shape, skin undertone, and best colors for makeup, clothing, and accessories.',
      cta: 'Analyze My Face',
      onClick: onFaceAnalysis,
    },
    {
      icon: '⭐',
      title: 'Find Your Celebrity Twin',
      desc: 'Upload a selfie and discover which celebrity you resemble most \u2014 plus get their signature makeup secrets adapted for you.',
      cta: 'Find My Twin',
      onClick: onCelebrity,
    },
    {
      icon: '💇',
      title: 'Try New Hairstyles',
      desc: 'Preview how you\u2019d look with different hair colors and styles before committing. Zero risk, instant results.',
      cta: 'Open Hair Lab',
      onClick: onHairLab,
    },
    {
      icon: '✨',
      title: 'Discover Your Style',
      desc: 'Not sure what look suits you? Take a quick quiz about your preferences and we\u2019ll create a personalized beauty blueprint.',
      cta: 'Take the Quiz',
      onClick: onQuiz,
    },
  ];

  return (
    <div className="motion-safe:animate-fade-in-up">
      {/* Hero — compact */}
      <div className="relative max-w-xl mx-auto text-center px-6 sm:px-0 py-8 sm:py-12">
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
            type="button"
            onClick={() => onInspiration('upload')}
            className="bg-pink-600 hover:bg-pink-700 active:scale-[0.97] text-white px-12 py-4 min-h-[44px] rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-pink-300/50 transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
          >
            Get Started &mdash; Upload Inspiration
          </button>
          <button
            type="button"
            onClick={() => onInspiration('selfie')}
            className="text-sm text-pink-600 hover:text-pink-700 underline underline-offset-4 decoration-pink-300 hover:decoration-pink-500 transition-all py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
          >
            or take a selfie &rarr;
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-2xl mx-auto px-6 sm:px-0 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 font-semibold">&oplus;</span>
            <span>Upload a look you love</span>
          </div>
          <span className="hidden sm:inline text-pink-300">&rarr;</span>
          <div className="flex items-center gap-2">
            <span className="text-pink-500 font-semibold">&oplus;</span>
            <span>AI adapts it to your face</span>
          </div>
          <span className="hidden sm:inline text-pink-300">&rarr;</span>
          <div className="flex items-center gap-2">
            <span className="text-pink-500 font-semibold">&oplus;</span>
            <span>Get your personalized tutorial</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-2xl mx-auto px-6 sm:px-0 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`motion-safe:animate-fade-in-up rounded-2xl border shadow-sm ${
                card.primary
                  ? 'sm:col-span-2 bg-gradient-to-br from-pink-50 to-white border-pink-100 p-8 sm:p-10'
                  : 'bg-white border-pink-50 p-6 sm:p-8'
              }`}
            >
              <div className="text-2xl mb-3" aria-hidden="true">{card.icon}</div>
              <h2 className="serif text-xl text-pink-900 tracking-[-0.02em] mb-2">{card.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{card.desc}</p>
              <button
                type="button"
                onClick={card.onClick}
                className={`min-h-[44px] px-6 py-3 rounded-full font-bold uppercase tracking-[0.15em] text-xs transition-all active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 ${
                  card.primary
                    ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-pink-300/50'
                    : 'bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 hover:border-pink-300'
                }`}
              >
                {card.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-12 sm:py-16">
        <p className="serif text-2xl sm:text-3xl text-pink-900 tracking-[-0.02em] mb-6">Ready to glow up?</p>
        <button
          type="button"
          onClick={() => onInspiration()}
          className="bg-pink-600 hover:bg-pink-700 active:scale-[0.97] text-white px-14 py-4 min-h-[44px] rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-pink-300/50 transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;
