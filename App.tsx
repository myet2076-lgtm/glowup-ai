
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
    
    const isValid = await validateFace(activePhoto);
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

    const isValid = await validateFace(activePhoto);
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

    const isValid = await validateFace(activeFace);
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

    const isValid = await validateFace(masterFacePhoto);
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
          <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8 text-center space-y-6">
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
            onInspiration={() => setCurrentPage('inspiration')}
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
                const ok = await validateFace(img);
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
               const ok = await validateFace(img);
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
               const ok = await validateFace(img);
               if (ok) setMasterFacePhoto(img);
            }}
            isMasterSet={!!masterFacePhoto}
          />
        )}

        {currentPage === 'inspiration' && (
          <div className="space-y-8 py-8 animate-in slide-in-from-bottom-8">
             <div className="flex items-center justify-between">
                <button onClick={() => setCurrentPage('landing')} className="text-gray-400 hover:text-pink-500 flex items-center text-sm transition-colors">← Back</button>
                <div className="text-center">
                   <h1 className="serif text-4xl text-pink-700">Inspiration Lab</h1>
                   <p className="text-xs text-gray-400 uppercase font-black tracking-widest mt-1">Recreate any aesthetic</p>
                </div>
                <div className="w-10"></div>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                {/* Left Side: Inspiration Source */}
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-4">1. The Inspiration</h3>
                   <PhotoUpload 
                    title="Inspo Image" 
                    description="Upload the look you want. JPEG/PNG." 
                    onUpload={setInspoPhoto} 
                    compact 
                   />
                   <div className="bg-white p-6 rounded-[32px] border border-pink-50 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-xs font-black text-pink-400 uppercase tracking-widest">Description</label>
                       <span className="text-[10px] text-gray-300">Optional</span>
                    </div>
                    <textarea 
                      placeholder="e.g. 'Golden hour glow with smoked-out liner and glossy lips'..."
                      className="w-full p-4 rounded-2xl border border-pink-100 outline-none h-28 focus:ring-2 ring-pink-200 text-sm placeholder:text-gray-300 transition-all"
                      value={inspoText}
                      onChange={(e) => setInspoText(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right Side: User Canvas */}
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-4">2. Your Canvas</h3>
                   
                   {!localInspoFace && masterFacePhoto ? (
                      <div className="space-y-6">
                        <div className="relative h-[380px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white group">
                           <img src={masterFacePhoto} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setLocalInspoFace(null)} // This state is tricky, if it's null we show PFP.
                                className="bg-white text-gray-800 px-6 py-2 rounded-full text-xs font-bold shadow-lg"
                              >
                                Using Profile Photo
                              </button>
                           </div>
                        </div>
                        <button 
                           onClick={() => setLocalInspoFace('PENDING_UPLOAD')} 
                           className="w-full py-4 border-2 border-dashed border-pink-200 text-pink-400 rounded-[24px] text-xs font-bold uppercase hover:bg-pink-50 transition-all"
                        >
                          Change to New Upload
                        </button>
                      </div>
                   ) : (
                     <div className="space-y-4">
                        <PhotoUpload 
                          title="Your Selfie" 
                          description="Clear face photo for analysis. JPEG/PNG." 
                          onUpload={async (img) => {
                            if (img) {
                              const ok = await validateFace(img);
                              if (ok) setLocalInspoFace(img);
                            } else {
                              setLocalInspoFace(null);
                            }
                          }} 
                          compact 
                          useProfileOption={!!masterFacePhoto}
                          onUseProfile={() => setLocalInspoFace(null)}
                        />
                        {localInspoFace && localInspoFace !== 'PENDING_UPLOAD' && (
                           <button 
                              onClick={() => setLocalInspoFace(null)}
                              className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-pink-500 transition-colors"
                           >
                             Reset to Profile Photo
                           </button>
                        )}
                     </div>
                   )}
                </div>
             </div>

             <div className="flex flex-col items-center pt-8 border-t border-pink-50 space-y-4">
               <button 
                  disabled={(!localInspoFace && !masterFacePhoto) || (!inspoPhoto && !inspoText) || localInspoFace === 'PENDING_UPLOAD'} 
                  onClick={processInspiration} 
                  className="bg-pink-500 text-white px-16 py-6 rounded-[24px] font-black uppercase tracking-widest shadow-2xl hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
               >
                 Glow Up AI ✨
               </button>
               <button onClick={handleRestart} className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] hover:text-pink-500 transition-colors">Start Over</button>
             </div>
          </div>
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
