
import React from 'react';

interface Props {
  onQuiz: () => void;
  onCelebrity: () => void;
  onInspiration: () => void;
  onInventory: () => void;
  onFaceAnalysis: () => void;
  onHairLab: () => void;
}

const Landing: React.FC<Props> = ({ onQuiz, onCelebrity, onInspiration, onInventory, onFaceAnalysis, onHairLab }) => {
  return (
    <div className="space-y-16 py-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="serif text-6xl text-pink-900">Beauty <span className="italic text-rose-400">Perfected</span></h1>
        <p className="text-gray-500 text-lg">Your hyper-personalized AI beauty consultant. From face shapes to vanity management.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          title="Face Analysis" 
          desc="Best colors, shapes & styles for your features." 
          icon="👁️" 
          onClick={onFaceAnalysis} 
        />
        <FeatureCard 
          title="Inspo Lab" 
          desc="Recreate any look you love with AI." 
          icon="📸" 
          onClick={onInspiration} 
        />
        <FeatureCard 
          title="Twin Scan" 
          desc="Find your celebrity twin secrets." 
          icon="⭐" 
          onClick={onCelebrity} 
        />
        <FeatureCard 
          title="Hair Lab" 
          desc="Try new colors and styles instantly." 
          icon="💇‍♀️" 
          onClick={onHairLab} 
        />
        <FeatureCard 
          title="Discovery" 
          desc="Quiz-based curated styles." 
          icon="✨" 
          onClick={onQuiz} 
        />
      </div>

      <div className="bg-pink-50 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between border border-pink-100 shadow-sm">
        <div className="mb-6 md:mb-0 max-w-lg">
          <h3 className="serif text-3xl text-pink-800">Your Digital Vanity</h3>
          <p className="text-gray-600 mt-2 text-sm">Track your collection, find Sephora dupes, and see what's missing on your shelf.</p>
        </div>
        <button 
          onClick={onInventory}
          className="bg-pink-500 text-white px-8 py-4 rounded-3xl font-bold uppercase tracking-widest shadow-lg hover:shadow-pink-200 transition-all text-xs"
        >
          Organize Vanity
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, onClick }: { title: string, desc: string, icon: string, onClick: () => void }) => (
  <button onClick={onClick} className="group bg-white p-8 rounded-[40px] border border-pink-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all text-left space-y-4">
    <div className="text-4xl group-hover:scale-125 transition-transform">{icon}</div>
    <div>
      <h3 className="serif text-xl text-pink-900 font-bold">{title}</h3>
      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc}</p>
    </div>
  </button>
);

export default Landing;
