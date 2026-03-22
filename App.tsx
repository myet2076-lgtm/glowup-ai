
import React, { useState, useEffect } from 'react';
import { AppState, QuizAnswers, MakeupAnalysis, Product, FaceAnalysisResult } from './types';
import { 
  getMakeupFromQuiz, 
  analyzeCelebrityLookAlike, 
  analyzeInspirationLook, 
  analyzeInventory,
  generateTryOn,
  analyzeFaceFeatures,
  normalizeProduct,
  generateHairTryOn,
  validateFaceImage
} from './geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import PhotoUpload from './components/PhotoUpload';
import InventoryManager from './components/InventoryManager';
import ResultsView from './components/ResultsView';
import FaceAnalysisView from './components/FaceAnalysisView';
import WishlistView from './components/WishlistView';
import HairLabView from './components/HairLabView';
import InspirationLab from './components/InspirationLab';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [resultSource, setResultSource] = useState<'quiz' | 'celebrity' | 'inspiration' | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const [analysis, setAnalysis] = useState<MakeupAnalysis | null>(null);
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [masterFacePhoto, setMasterFacePhoto] = useState<string | null>(null);
  const [inspoPhoto, setInspoPhoto] = useState<string | null>(null);
  const [localInspoFace, setLocalInspoFace] = useState<string | null>(null);
  const [inspoText, setInspoText] = useState('');
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [hairResultImage, setHairResultImage] = useState<string | null>(null);
  const [inspoEntryHint, setInspoEntryHint] = useState<'upload' | 'selfie' | null>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => (prev < 98 ? prev + (Math.random() * 8) : prev));
      }, 400);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleRestart = () => {
    setAnalysis(null);
    setFaceAnalysis(null);
    setInspoPhoto(null);
    setLocalInspoFace(null);
    setInspoText('');
    setTryOnImage(null);
    setHairResultImage(null);
    setResultSource(null);
    setCurrentPage('landing');
  };

  const validateFace = async (photo: string): Promise<boolean> => {
    try {
      return await validateFaceImage(photo.split(',')[1]);
    } catch {
      return false;
    }
  };

  /** Legacy wrapper that shows global loading + alerts — used by celebrity, face analysis, hair lab */
  const validateFaceWithUI = async (photo: string): Promise<boolean> => {
    setLoading(true);
    setLoadingMessage("Verifying selfie...");
    try {
      const isValid = await validateFaceImage(photo.split(',')[1]);
      if (!isValid) {
        alert("Please upload a clear face selfie only!");
        return false;
      }
      return true;
    } catch (err) {
      alert("Validation failed. Try again with a clear photo.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processFaceAnalysis = async (photo?: string) => {
    const activePhoto = photo || masterFacePhoto;
    if (!activePhoto) {
      setCurrentPage('face-analysis');
      return;
    }
    
    const isValid = await validateFaceWithUI(activePhoto);
    if (!isValid) return;

    setLoading(true);
    setLoadingMessage("Mapping facial geometry...");
    try {
      const result = await analyzeFaceFeatures(activePhoto.split(',')[1]);
      setFaceAnalysis(result);
      setCurrentPage('face-analysis');
    } catch (err) { alert("Analysis failed."); }
    finally { setLoading(false); }
  };

  const processQuiz = async (answers: QuizAnswers) => {
    setLoading(true);
    setLoadingMessage("Curating beauty blueprint...");
    try {
      const result = await getMakeupFromQuiz(answers);
      setAnalysis(result);
      setResultSource('quiz');
      setCurrentPage('results');
    } catch (err) { alert("Quiz error!"); }
    finally { setLoading(false); }
  };

  const processCelebrity = async (photo?: string) => {
    const activePhoto = photo || masterFacePhoto;
    if (!activePhoto) {
      setCurrentPage('celebrity');
      return;
    }

    const isValid = await validateFaceWithUI(activePhoto);
    if (!isValid) return;

    setLoading(true);
    setLoadingMessage("Searching your celebrity twin...");
    try {
      const result = await analyzeCelebrityLookAlike(activePhoto.split(',')[1]);
      setAnalysis(result);
      setResultSource('celebrity');
      setCurrentPage('results');
    } catch (err) { alert("Celebrity search failed!"); }
    finally { setLoading(false); }
  };

  const processInspiration = async () => {
    const activeFace = localInspoFace || masterFacePhoto;
    if (!activeFace) {
      alert("Please provide a canvas photo (your selfie) first!");
      return;
    }

    const isValid = await validateFaceWithUI(activeFace);
    if (!isValid) return;

    setLoading(true);
    setLoadingMessage("Analyzing inspiration...");
    try {
      const result = await analyzeInspirationLook(inspoPhoto, activeFace, inspoText);
      setAnalysis(result);
      setResultSource('inspiration');
      setCurrentPage('results');
    } catch (err) { alert("Inspiration failed!"); }
    finally { setLoading(false); }
  };

  const processInspirationSubmit = async (
    newInspoPhoto: string | null,
    facePhoto: string,
    newInspoText: string
  ) => {
    setInspoPhoto(newInspoPhoto);
    // Only set localInspoFace if it's a DIFFERENT photo than master
    if (facePhoto !== masterFacePhoto) {
      setLocalInspoFace(facePhoto);
    } else {
      setLocalInspoFace(null); // Clear — means "using profile photo"
    }
    setInspoText(newInspoText);
    setLoading(true);
    setLoadingMessage("Analyzing inspiration...");
    try {
      const result = await analyzeInspirationLook(newInspoPhoto, facePhoto, newInspoText);
      setAnalysis(result);
      setResultSource('inspiration');
      setCurrentPage('results');
    } catch {
      throw new Error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTryOn = async () => {
    const activeFace = localInspoFace || masterFacePhoto;
    if (!activeFace || !analysis) return;
    setLoading(true);
    setLoadingMessage("AI Makeup Magic...");
    try {
      const result = await generateTryOn(activeFace.split(',')[1], `${analysis.styleName}: ${analysis.description}`);
      setTryOnImage(result);
    } catch (err) { alert("Try-on failed."); }
    finally { setLoading(false); }
  };

  const handleHairTryOn = async (style: string, color: string) => {
    if (!masterFacePhoto) return;

    const isValid = await validateFaceWithUI(masterFacePhoto);
    if (!isValid) return;

    setLoading(true);
    setLoadingMessage(`Styling hair: ${color} ${style}...`);
    try {
      const result = await generateHairTryOn(masterFacePhoto.split(',')[1], style, color);
      setHairResultImage(result);
    } catch (err) { alert("Hair lab failed."); }
    finally { setLoading(false); }
  };

  const handleInventoryScan = async (photos: string[]) => {
    if (photos.length === 0) return;
    setLoading(true);
    setLoadingMessage("Scanning vanity...");
    try {
      const results = await analyzeInventory(photos.map(p => p.split(',')[1]));
      setInventory(prev => [...prev, ...results]);
    } catch (err) { alert("Scan failed."); }
    finally { setLoading(false); }
  };

  const handleManualAdd = async (brand: string, name: string) => {
    setLoading(true);
    setLoadingMessage("Validating product details...");
    try {
      const official = await normalizeProduct(brand, name);
      setInventory(prev => [...prev, { ...official, category: official.category || 'other' }]);
    } catch (err) {
      setInventory(prev => [...prev, { brand, name, category: 'other' }]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (idx: number) => {
    setWishlist(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffafb]">
      <Header 
        onHome={handleRestart} 
        onInventory={() => setCurrentPage('inventory')}
        onWishlist={() => setCurrentPage('wishlist')}
        onRestart={handleRestart}
        inventoryCount={inventory.length}
        wishlistCount={wishlist.length}
        masterPhoto={masterFacePhoto}
        onSetMasterPhoto={setMasterFacePhoto}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {loading && (
          <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8 text-center space-y-6" role="status" aria-live="polite">
            <div className="w-64 bg-pink-50 h-3 rounded-full overflow-hidden border border-pink-100">
              <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-pink-600 font-bold text-xl italic serif">{loadingMessage}</p>
          </div>
        )}

        {currentPage === 'landing' && (
          <Landing 
            onQuiz={() => setCurrentPage('quiz')} 
            onCelebrity={() => setCurrentPage('celebrity')} 
            onInspiration={(hint) => { setInspoEntryHint(hint ?? null); setCurrentPage('inspiration'); }}
            onInventory={() => setCurrentPage('inventory')}
            onFaceAnalysis={() => processFaceAnalysis()}
            onHairLab={() => setCurrentPage('hair-lab')}
          />
        )}

        {currentPage === 'hair-lab' && (
          <HairLabView 
            userPhoto={masterFacePhoto} 
            resultImage={hairResultImage}
            onSetProfile={async (img) => {
              if (img) {
                const ok = await validateFaceWithUI(img);
                if (ok) setMasterFacePhoto(img);
              } else {
                setMasterFacePhoto(null);
              }
            }}
            onTryStyle={handleHairTryOn}
            onBack={() => setCurrentPage('landing')}
            onRestart={handleRestart}
          />
        )}

        {currentPage === 'face-analysis' && !faceAnalysis && (
          <PhotoUpload 
            title="Analysis Scan"
            description="Clear face, natural lighting. Accepts JPEG/PNG."
            onUpload={processFaceAnalysis}
            onBack={() => setCurrentPage('landing')}
            useProfileOption={!!masterFacePhoto}
            onUseProfile={() => processFaceAnalysis(masterFacePhoto!)}
            onSetAsMaster={async (img) => {
               const ok = await validateFaceWithUI(img);
               if (ok) setMasterFacePhoto(img);
            }}
            isMasterSet={!!masterFacePhoto}
          />
        )}

        {currentPage === 'face-analysis' && faceAnalysis && (
          <FaceAnalysisView result={faceAnalysis} userPhoto={masterFacePhoto} onBack={() => {setFaceAnalysis(null); setCurrentPage('landing');}} />
        )}

        {currentPage === 'wishlist' && (
          <WishlistView wishlist={wishlist} onRemove={removeFromWishlist} onBack={() => setCurrentPage('landing')} onRestart={handleRestart} />
        )}

        {currentPage === 'quiz' && (
          <Quiz onSubmit={processQuiz} onBack={() => setCurrentPage('landing')} />
        )}

        {currentPage === 'celebrity' && (
          <PhotoUpload 
            title="Twin Scan"
            description="Find your celebrity twin secrets. Use a clear selfie or your profile photo."
            onUpload={processCelebrity}
            onBack={() => setCurrentPage('landing')}
            useProfileOption={!!masterFacePhoto}
            onUseProfile={() => processCelebrity(masterFacePhoto!)}
            onSetAsMaster={async (img) => {
               const ok = await validateFaceWithUI(img);
               if (ok) setMasterFacePhoto(img);
            }}
            isMasterSet={!!masterFacePhoto}
          />
        )}

        {currentPage === 'inspiration' && (
          <InspirationLab
            masterFacePhoto={masterFacePhoto}
            onBack={() => setCurrentPage('landing')}
            onQuiz={() => setCurrentPage('quiz')}
            onSubmit={processInspirationSubmit}
            onSetMasterPhoto={setMasterFacePhoto}
            validateFace={validateFace}
            initialInspoPhoto={inspoPhoto}
            initialInspoText={inspoText}
            initialFace={localInspoFace}
            entryHint={inspoEntryHint}
          />
        )}

        {currentPage === 'inventory' && (
          <InventoryManager 
            currentInventory={inventory} 
            onScan={handleInventoryScan} 
            onAddManual={handleManualAdd}
            onBack={() => setCurrentPage('landing')} 
          />
        )}

        {currentPage === 'results' && analysis && (
          <ResultsView 
            analysis={analysis} 
            inventory={inventory} 
            userPhoto={localInspoFace || masterFacePhoto}
            inspoPhoto={inspoPhoto}
            onBack={() => setCurrentPage('inspiration')}
            onRestart={handleRestart}
            onTryOn={handleTryOn}
            onAddToWishlist={(p) => setWishlist(prev => [...prev, p])}
            tryOnImage={tryOnImage}
            isCelebrityTwin={resultSource === 'celebrity'}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
