import React, { useState } from 'react';

type ModalPage = 'privacy' | 'terms' | 'faq' | null;

const PRIVACY_CONTENT = `
# Privacy Policy

**Last updated: March 2026**

## 1. Information We Collect

**Photos you upload:** When you use Glowa's features (Inspiration Lab, Celebrity Twin, Hair Lab, Face Analysis), your photos are sent to OpenAI's API for processing. We do not permanently store your photos on our servers.

**Account information:** If you create an account, we store your email address and authentication data via Supabase.

**Analytics:** We use PostHog to collect anonymous usage data (pages visited, features used, device type). This helps us improve the product.

**Local storage:** Analysis results, inventory items, and profile photos are stored locally in your browser (IndexedDB) and optionally synced to Supabase if you have an account.

## 2. How We Use Your Information

- To provide AI-powered beauty analysis and try-on features
- To save your analysis history and product inventory
- To improve our product through anonymous usage analytics
- To communicate with you if you contact us

## 3. Third-Party Services

- **OpenAI:** Processes your photos for analysis and image generation
- **Supabase:** Stores account data and synced content
- **PostHog:** Collects anonymous analytics
- **Vercel:** Hosts our application

## 4. Data Retention

- Photos are processed in real-time and not retained by Glowa after processing
- Account data is retained until you delete your account
- Local data can be cleared by clearing your browser data

## 5. Your Rights

You can:
- Delete your account and all associated cloud data at any time
- Clear local data by clearing browser storage
- Contact us to request data deletion

## 6. Contact

For privacy inquiries, email us at **support@glowa.ai**
`;

const TERMS_CONTENT = `
# Terms of Service

**Last updated: March 2026**

## 1. Acceptance of Terms

By using Glowa ("the Service"), you agree to these Terms of Service. If you do not agree, please do not use the Service.

## 2. Description of Service

Glowa is an AI-powered beauty platform that provides:
- Makeup style analysis and recommendations
- Virtual try-on features
- Celebrity twin matching
- Hair style visualization
- Product inventory management

## 3. User Responsibilities

- You must be at least 13 years old to use the Service
- You are responsible for the content you upload
- Do not upload photos of others without their consent
- Do not use the Service for any unlawful purpose

## 4. AI-Generated Content

- All AI analysis results and generated images are for entertainment and reference purposes
- Results may not be perfectly accurate
- Glowa is not responsible for purchasing decisions based on product recommendations

## 5. Intellectual Property

- The Glowa brand, logo, and design are our property
- AI-generated results based on your photos are yours to use personally
- You may not use the Service to generate content for commercial purposes without permission

## 6. Limitation of Liability

Glowa is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service.

## 7. Changes to Terms

We may update these terms at any time. Continued use after changes constitutes acceptance.

## 8. Contact

Questions about these terms? Email us at **support@glowa.ai**
`;

const FAQ_CONTENT = `
# Frequently Asked Questions

## Getting Started

**Q: Do I need to create an account?**
No! You can use all features as a guest. Your data is saved locally in your browser. Creating an account lets you sync across devices.

**Q: What photo should I upload?**
For best results, use a clear, front-facing selfie with good lighting, no heavy makeup, and a neutral background.

## Features

**Q: What is Inspiration Lab?**
Upload any makeup look you like (from Instagram, Pinterest, magazines) along with your selfie. Our AI analyzes the look and creates a personalized step-by-step tutorial adapted to your features.

**Q: How does Celebrity Twin work?**
Upload your selfie and our AI identifies which celebrity you most resemble, then creates a tutorial based on their signature makeup style.

**Q: What is the Hair Lab?**
Try different hairstyles and colors on your photo. You can change just the color, just the style, or both.

**Q: What is Face Analysis?**
AI analyzes your facial features and recommends the best jewelry colors, clothing colors, glass shapes, hairstyles, and more.

## Try-On Feature

**Q: Why does the try-on change my face?**
We're continuously improving identity preservation. The AI sometimes alters facial features — we're working on making try-ons more realistic. For now, treat it as an approximation.

**Q: Can I download try-on images?**
Yes! There's a download button on every result page.

## Product Scanning

**Q: How do I scan products for my Vanity?**
Take a clear photo of the product label. The AI works best when the brand name and product name are clearly visible. If there's no label, use manual entry instead.

## Account & Data

**Q: Where is my data stored?**
Guest data is stored locally in your browser (IndexedDB). If you have an account, data syncs to our secure cloud (Supabase with row-level security).

**Q: How do I delete my data?**
Clear your browser data to remove local data. For cloud data, sign in and contact us for account deletion.

**Q: Is my data shared with anyone?**
No. Your photos and data are never shared. See our Privacy Policy for details on third-party services used for processing.

## Contact

**Have more questions?** Email us at **support@glowa.ai**
`;

const ModalOverlay: React.FC<{ title: string; content: string; onClose: () => void }> = ({ title, content, onClose }) => (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
    <div
      className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto editorial-shadow relative"
      style={{ borderRadius: '0.25rem' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-neutral-100 z-10">
        <h2 className="text-xl text-neutral-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="px-6 py-6 prose-sm text-neutral-700 leading-relaxed space-y-4">
        {content.split('\n').map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('# ')) return <h1 key={i} className="text-2xl text-neutral-900 mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{trimmed.slice(2)}</h1>;
          if (trimmed.startsWith('## ')) return <h2 key={i} className="text-lg text-neutral-900 mt-6 mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{trimmed.slice(3)}</h2>;
          if (trimmed.startsWith('**Q:')) return <p key={i} className="font-semibold text-neutral-900 mt-4">{trimmed.replace(/\*\*/g, '')}</p>;
          if (trimmed.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-sm">{trimmed.slice(2)}</li>;
          // Bold text
          const parts = trimmed.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={i} className="text-sm">
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={j} className="text-neutral-900">{part.slice(2, -2)}</strong>
                  : part
              )}
            </p>
          );
        })}
      </div>
    </div>
  </div>
);

const Footer: React.FC = () => {
  const [modal, setModal] = useState<ModalPage>(null);

  return (
    <>
      <footer className="bg-white border-t border-neutral-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 w-full max-w-screen-2xl mx-auto py-24 px-8">
          <div className="space-y-6">
            <div className="text-3xl text-neutral-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>GLOWA</div>
            <p className="text-neutral-500 max-w-xs text-xs leading-relaxed uppercase tracking-widest">Redefining beauty standards through the lens of personalized artificial intelligence.</p>
          </div>
          <div className="grid grid-cols-2 gap-12 w-full md:w-auto">
            <div className="space-y-6">
              <h5 className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-900 font-bold">Legal</h5>
              <ul className="space-y-3">
                <li><button type="button" onClick={() => setModal('privacy')} className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer bg-transparent border-none p-0">Privacy</button></li>
                <li><button type="button" onClick={() => setModal('terms')} className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer bg-transparent border-none p-0">Terms</button></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-900 font-bold">Support</h5>
              <ul className="space-y-3">
                <li><a href="mailto:support@glowa.ai" className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer no-underline">Contact</a></li>
                <li><button type="button" onClick={() => setModal('faq')} className="text-neutral-400 hover:text-primary text-xs transition-all tracking-wider cursor-pointer bg-transparent border-none p-0">FAQ</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-8 pb-12 flex justify-between items-center border-t border-neutral-50 pt-12">
          <p className="text-neutral-400 text-[10px] uppercase tracking-widest">&copy; {new Date().getFullYear()} Glowa. All rights reserved.</p>
        </div>
      </footer>

      {modal === 'privacy' && <ModalOverlay title="Privacy Policy" content={PRIVACY_CONTENT} onClose={() => setModal(null)} />}
      {modal === 'terms' && <ModalOverlay title="Terms of Service" content={TERMS_CONTENT} onClose={() => setModal(null)} />}
      {modal === 'faq' && <ModalOverlay title="FAQ" content={FAQ_CONTENT} onClose={() => setModal(null)} />}
    </>
  );
};

export default Footer;
