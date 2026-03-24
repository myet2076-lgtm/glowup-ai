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
  image: string;
  imageAlt: string;
}

const Landing: React.FC<Props> = ({ onQuiz, onCelebrity, onInspiration, onFaceAnalysis, onHairLab }) => {
  const features: FeatureCard[] = [
    { title: 'Inspiration Lab', label: 'Upload & Recreate', onClick: () => onInspiration('upload'), image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBooeGveL-x1g268J5nouaBPT85926uGYbu7Q_6XzswK8WQ20ADVSNciaI106p4M6aPkyMUwHEc5FYQHgzb9gfQNAXYnNKv6Bn9Ha9vLMScoABHyjnZs9VL1EKpYgl7Q-j_Eni6Eo9BadvljqTHNZ9us-ZqCkgtTzGH7GRAfPYm84HNsV5gTuHBRYsuJLJh4h5skAXFlbuafHVv5vdwCeGIm4kym0RdS-h_fwZvQlQervGzGi2xdZBg2KjxTRmPlq_5sxTg-x2EDKT0', imageAlt: 'The Ethereal – inspiration look' },
    { title: 'Face Analysis', label: 'Know Your Features', onClick: onFaceAnalysis, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYKJpoIqwV0jDchtocA664_-3q-9X9L6gWDJVOGjFdURGVJPxPoOSbtzgvEHWHCUzJA2JlTQO1KmbtrplnOluro80iAy4M4jEKrc6itF82e1PlTVC4u5h4-l2SVR8riTXK3u5myqQTdF3130GlfjGvlJUQ5dZNkZysPFpSIa0hnYBIn7kqzb608kN9a0zE3qvSnuHqa2REpLkNyj19X1pGoVlWbFUgk1uglrY2LQD4BMLyjrN1YaxQr6TYGuDcoZYdI2U04zHNbLf2', imageAlt: 'Face analysis portrait' },
    { title: 'Celebrity Twin', label: 'Find Your Match', onClick: onCelebrity, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD06EvZZNzKxos1R0yh7ox9WJ7dWm9dwaQSFzLIQMO_2S1RmnUItHti7_xF7Q54GLz8itwZAOdfZbfdrQ_zFWlmC8NhorTpaChncyEIDMbJOrLNFuj3y19fcN5l5IwWW4UXPDcr2hWrXrafqkX6eWKPsIMekpfNRM7j22unB3sYNNfFiBZFKUd9mi7IKTlmi2dTAe6Y_J06R-WBinM-fHqU8kQbOct7GJ97fkESu45PoqbkigJU1A79u1dRpE6MUUO3DkpIvNz_ZTL6', imageAlt: 'Celebrity twin match portrait' },
    { title: 'Hair Lab', label: 'Try New Styles', onClick: onHairLab, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD06EvZZNzKxos1R0yh7ox9WJ7dWm9dwaQSFzLIQMO_2S1RmnUItHti7_xF7Q54GLz8itwZAOdfZbfdrQ_zFWlmC8NhorTpaChncyEIDMbJOrLNFuj3y19fcN5l5IwWW4UXPDcr2hWrXrafqkX6eWKPsIMekpfNRM7j22unB3sYNNfFiBZFKUd9mi7IKTlmi2dTAe6Y_J06R-WBinM-fHqU8kQbOct7GJ97fkESu45PoqbkigJU1A79u1dRpE6MUUO3DkpIvNz_ZTL6', imageAlt: 'Hair styling portrait' },
    { title: 'Style Quiz', label: 'Discover Your Look', onClick: onQuiz, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr40MZ8-GJWY4CbiHOCKTSTcTsKnVrKHCHcoRSUscfVwxGMK-emL1wDQwHzSp7aThQhZcs-elh397KeG89Eyn9qtOHoHCsGvJuN19JMRxfpV7ZKdvEPH8I8pObFsnjXn5EijUhuU1o0Cix8cABZkxVITJ6rrEoPxS1n6mRYWFbRqnITguW27Lwr8afZwh4BlEk3yn4mU1La1ePjmq8QvLDtu3a2WUeyxnLalLSnScKBxxJgtXtNtiwUR5seXQpixRqSRLZTR-uTssf', imageAlt: 'Style quiz beauty portrait' },
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
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv4n0npcywEleQ-co_rNkgg4AB7ia9aJAUEwiCF2G2KPQF1Q_MhL2PtgaYmXmVpcqn93DnV2y_BHHDLheemOa3rRgEsOgAkq5vBOugzX6qBPZQa5qV5R1xIAnOBhoaHgbzvGPohhaljosIXB0ABRUvMkeMLCQF9JVh2XMiXYJzVDmhMtGVZAegv7t6_zimLYBa9FoJmPNPme5YUbxA3XqZhXBjU_j913KQPSIJgDBicyu4kpW504-ctWRqFswXzMHUtq8UdcSijXtN"
                alt="Portrait of a woman with glowing skin"
                className="w-full h-full object-cover"
              />
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
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAstWFCgIcmkkMVk_PHsM9yCxaga9p9YTLhn_wHhrmghWQSu36HzdlpHm9P2AebbHiQBoHi7_-DjswSMHv40ESqVdNl9MKQZ9vRxMyYJygqxFf5TsYvi1PQy_aMEBfFCQSwrjZNEjJp9MGEDTVeKJ_bR5wZlOlsULAaJ8mE_rnRlqvEnrkChslyXWbeL-mXteY_0IvxNGY1eXWxmwY5fuWCkEi12MSyrH1OQwa_Viu5YTVR5U1Wke-UM7oPEdEYrY-YuFrx2PV8brb8"
                  alt="Phone on marble surface capturing a selfie"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <h3 className="font-serif text-2xl">Capture</h3>
              <p className="text-secondary font-sans leading-relaxed text-sm">Simply upload a photo. Our AI maps 40,000 unique points on your face with clinical precision.</p>
            </div>
            <div className="space-y-6 md:mt-20">
              <div className="aspect-[4/5] bg-white overflow-hidden editorial-shadow mb-8 group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr40MZ8-GJWY4CbiHOCKTSTcTsKnVrKHCHcoRSUscfVwxGMK-emL1wDQwHzSp7aThQhZcs-elh397KeG89Eyn9qtOHoHCsGvJuN19JMRxfpV7ZKdvEPH8I8pObFsnjXn5EijUhuU1o0Cix8cABZkxVITJ6rrEoPxS1n6mRYWFbRqnITguW27Lwr8afZwh4BlEk3yn4mU1La1ePjmq8QvLDtu3a2WUeyxnLalLSnScKBxxJgtXtNtiwUR5seXQpixRqSRLZTR-uTssf"
                  alt="Beauty portrait with soft lighting"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl">Synthesize</h3>
              <p className="text-secondary font-sans leading-relaxed text-sm">Our neural network cross-references your skin tone and texture against curated professional looks.</p>
            </div>
            <div className="space-y-6">
              <div className="aspect-[4/5] bg-white overflow-hidden editorial-shadow mb-8 group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH9cc-d093BTdpCcpV60Mj4YlO0qm6vpDIoXL_HXLFLYotBvM8vj_MJJKkll1OjAF65Zrnx2B_EYf_FdNFanXE-tRg9NGQr-FiSru6p7zyjpwKHtzKllhifQORxEsQF0VahCTzP9-g0r2ueh1l3KD05S7YtxaXCBtgVPynP7sRotVntrjHlfVDh3tm3iP7jEHL0qZM75lXQQ-Sez8hTngdKrAPu6hCsVcf0Pq8zuLcLM1cf6zjvyyTSGmMrJsnUrUjsY--6pAaJgSJ"
                  alt="Styled portrait with refined beauty look"
                  className="w-full h-full object-cover"
                />
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
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
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
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr40MZ8-GJWY4CbiHOCKTSTcTsKnVrKHCHcoRSUscfVwxGMK-emL1wDQwHzSp7aThQhZcs-elh397KeG89Eyn9qtOHoHCsGvJuN19JMRxfpV7ZKdvEPH8I8pObFsnjXn5EijUhuU1o0Cix8cABZkxVITJ6rrEoPxS1n6mRYWFbRqnITguW27Lwr8afZwh4BlEk3yn4mU1La1ePjmq8QvLDtu3a2WUeyxnLalLSnScKBxxJgtXtNtiwUR5seXQpixRqSRLZTR-uTssf"
                alt="Beauty portrait background"
                className="w-full h-full object-cover opacity-60 grayscale"
              />
              <div className="absolute inset-0 bg-neutral-900/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
