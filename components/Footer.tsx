import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-pink-50 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-center md:text-left">
        <div className="space-y-2">
          <div className="serif text-2xl font-bold text-pink-600">GlowUp AI</div>
          <p className="text-gray-500 text-sm max-w-xs">Your personal, pocket-sized professional makeup artist powered by advanced AI.</p>
        </div>
        
        <div className="flex space-x-12">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-widest">Community</h4>
            <ul className="text-gray-600 text-sm space-y-2">
              <li><span className="text-gray-600">Instagram</span></li>
              <li><span className="text-gray-600">TikTok</span></li>
              <li><span className="text-gray-600">Pinterest</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="text-gray-600 text-sm space-y-2">
              <li><span className="text-gray-600">Privacy</span></li>
              <li><span className="text-gray-600">Safety</span></li>
              <li><span className="text-gray-600">Terms</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} GlowUp AI. Built for beauty lovers everywhere.
      </div>
    </footer>
  );
};

export default Footer;
