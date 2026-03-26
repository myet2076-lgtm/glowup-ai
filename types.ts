
export type AppState = 'landing' | 'quiz' | 'celebrity' | 'inspiration' | 'inventory' | 'results' | 'face-analysis' | 'wishlist' | 'hair-lab' | 'history' | 'history-detail';

export interface Product {
  name: string;
  brand?: string;
  category: string;
  shade?: string;
  image?: string;
  description?: string;
  sephoraUrl?: string;
}

export interface TutorialLink {
  platform: 'YouTube' | 'Vogue' | 'Allure' | 'TikTok';
  title: string;
  url: string;
}

export interface MakeupStep {
  step: number;
  title: string;
  instruction: string;
  productToUse: string;
  amount: string;
  technique: string;
  proTip?: string; 
}

export interface MakeupAnalysis {
  styleName: string;
  description: string;
  celebrityMatch?: string;
  celebrityImage?: string; // For visual twin matching
  tutorialSteps: MakeupStep[];
  recommendedProducts: Product[];
  tikTokSearchQuery: string;
  tutorialLinks: TutorialLink[];
  colorPalette: string[];
  styleImage?: string;
}

export interface FaceAnalysisResult {
  faceShape: string;
  eyebrowShape: string;
  jewelryColor: 'Gold' | 'Silver' | 'Rose Gold';
  jewelryReason: string;
  clothingSeason: string;
  bestClothingColors: string[];
  glassShapes: string[];
  bestHairColors: string[];
  bestHairstyles: string[];
  eyebrowTips: string;
  undertone: string;
}

export interface QuizAnswers {
  skinTone: string;
  eyeShape: string;
  faceShape: string;
  vibe: string;
  occasion: string;
}
