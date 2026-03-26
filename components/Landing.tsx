import React from 'react';

interface Props {
  onQuiz: () => void;
  onCelebrity: () => void;
  onInspiration: (hint?: 'upload' | 'selfie') => void;
  onInventory: () => void;
  onFaceAnalysis: () => void;
  onHairLab: () => void;
}

const INSPO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH9cc-d093BTdpCcpV60Mj4YlO0qm6vpDIoXL_HXLFLYotBvM8vj_MJJKkll1OjAF65Zrnx2B_EYf_FdNFanXE-tRg9NGQr-FiSru6p7zyjpwKHtzKllhifQORxEsQF0VahCTzP9-g0r2ueh1l3KD05S7YtxaXCBtgVPynP7sRotVntrjHlfVDh3tm3iP7jEHL0qZM75lXQQ-Sez8hTngdKrAPu6hCsVcf0Pq8zuLcLM1cf6zjvyyTSGmMrJsnUrUjsY--6pAaJgSJ';
const FACE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYKJpoIqwV0jDchtocA664_-3q-9X9L6gWDJVOGjFdURGVJPxPoOSbtzgvEHWHCUzJA2JlTQO1KmbtrplnOluro80iAy4M4jEKrc6itF82e1PlTVC4u5h4-l2SVR8riTXK3u5myqQTdF3130GlfjGvlJUQ5dZNkZysPFpSIa0hnYBIn7kqzb608kN9a0zE3qvSnuHqa2REpLkNyj19X1pGoVlWbFUgk1uglrY2LQD4BMLyjrN1YaxQr6TYGuDcoZYdI2U04zHNbLf2';
const CELEB_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD06EvZZNzKxos1R0yh7ox9WJ7dWm9dwaQSFzLIQMO_2S1RmnUItHti7_xF7Q54GLz8itwZAOdfZbfdrQ_zFWlmC8NhorTpaChncyEIDMbJOrLNFuj3y19fcN5l5IwWW4UXPDcr2hWrXrafqkX6eWKPsIMekpfNRM7j22unB3sYNNfFiBZFKUd9mi7IKTlmi2dTAe6Y_J06R-WBinM-fHqU8kQbOct7GJ97fkESu45PoqbkigJU1A79u1dRpE6MUUO3DkpIvNz_ZTL6';
const HAIR_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv4n0npcywEleQ-co_rNkgg4AB7ia9aJAUEwiCF2G2KPQF1Q_MhL2PtgaYmXmVpcqn93DnV2y_BHHDLheemOa3rRgEsOgAkq5vBOugzX6qBPZQa5qV5R1xIAnOBhoaHgbzvGPohhaljosIXB0ABRUvMkeMLCQF9JVh2XMiXYJzVDmhMtGVZAegv7t6_zimLYBa9FoJmPNPme5YUbxA3XqZhXBjU_j913KQPSIJgDBicyu4kpW504-ctWRqFswXzMHUtq8UdcSijXtN';
const QUIZ_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr40MZ8-GJWY4CbiHOCKTSTcTsKnVrKHCHcoRSUscfVwxGMK-emL1wDQwHzSp7aThQhZcs-elh397KeG89Eyn9qtOHoHCsGvJuN19JMRxfpV7ZKdvEPH8I8pObFsnjXn5EijUhuU1o0Cix8cABZkxVITJ6rrEoPxS1n6mRYWFbRqnITguW27Lwr8afZwh4BlEk3yn4mU1La1ePjmq8QvLDtu3a2WUeyxnLalLSnScKBxxJgtXtNtiwUR5seXQpixRqSRLZTR-uTssf';

const CompactCard = ({ title, label, image, onClick }: { title: string; label: string; image: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="relative aspect-square overflow-hidden editorial-shadow group text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    style={{ borderRadius: '0.25rem' }}
  >
    <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
    <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
      <p className="text-[10px] text-white/60 uppercase tracking-[0.2em]">{label}</p>
      <h4 className="text-sm font-serif text-white">{title}</h4>
    </div>
  </button>
);

const Landing: React.FC<Props> = ({ onQuiz, onCelebrity, onInspiration, onFaceAnalysis, onHairLab }) => {
  return (
    <div className="motion-safe:animate-fade-in-up">
      {/* ── Split Hero with Feature Showcase ── */}
      <section className="px-8 max-w-screen-2xl mx-auto pt-28 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Hero Text */}
          <div className="md:col-span-5 space-y-8">
            <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] text-neutral-900 tracking-tight">
              Your skin, your style, your AI&#8209;perfected look.
            </h1>
            <p className="text-base text-secondary max-w-md font-sans leading-relaxed">
              Experience the next generation of beauty. Glowa analyzes your features to curate a personalized aesthetic.
            </p>
            <button
              type="button"
              onClick={() => onInspiration('upload')}
              className="bg-primary text-white px-10 py-5 rounded-none font-label uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/10 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
              <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/50 to-transparent w-full">
                <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] mb-1">Primary Feature</p>
                <h3 className="text-xl font-serif text-white">Inspiration Lab</h3>
                <p className="text-xs text-white/80 mt-1">Upload any look — AI adapts it to your face</p>
              </div>
            </button>

            {/* Secondary: 2x2 grid of compact cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
