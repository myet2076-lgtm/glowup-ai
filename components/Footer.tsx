import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="flex flex-col md:flex-row justify-between items-start gap-16 w-full max-w-screen-2xl mx-auto py-24 px-8">
        <div className="space-y-6">
          <div className="text-2xl font-serif text-neutral-900 italic">GlowUp AI</div>
          <p className="text-neutral-500 max-w-xs text-xs leading-relaxed uppercase tracking-widest">Redefining beauty standards through the lens of personalized artificial intelligence.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
          <div className="space-y-6">
            <h5 className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-900 font-bold">Legal</h5>
            <ul className="space-y-3">
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">Privacy</span></li>
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">Terms</span></li>
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">Editorial</span></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-900 font-bold">Support</h5>
            <ul className="space-y-3">
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">Contact</span></li>
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">FAQ</span></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-900 font-bold">Social</h5>
            <ul className="space-y-3">
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">Instagram</span></li>
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">TikTok</span></li>
              <li><span className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer">Pinterest</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-8 pb-12 flex justify-between items-center border-t border-neutral-50 pt-12">
        <p className="text-neutral-400 text-[10px] uppercase tracking-widest">&copy; {new Date().getFullYear()} GlowUp AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
