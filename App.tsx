import React, { useState, useEffect, useCallback } from 'react';
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
  validateFaceImage,
} from './openaiService';
import {
  saveAnalysis,
  updateAnalysisTryOn,
  loadAnalysis,
  loadAllAnalyses,
  deleteAnalysis,
  loadProfilePhoto,
  saveProfilePhoto,
  generateId,
  SavedAnalysis,
  loadAllInventory,
  saveInventoryItem,
  deleteInventoryItem,
} from './persistence';
import {
  upsertCloudAnalysis,
  updateCloudTryOn,
  loadAllCloudAnalyses,
  loadCloudAnalysis,
  deleteCloudAnalysis,
  upsertCloudInventoryItem,
  loadAllCloudInventory,
  deleteCloudInventoryItem,
  upsertCloudProfilePhoto,
  loadCloudProfilePhoto,
} from './cloudPersistence';
import { useAuth } from './auth';
import HistoryView from './components/HistoryView';
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
import AuthModal from './components/AuthModal';
import { trackPageView, trackEvent, identifyUser, resetUser } from './analytics';

const App: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const isAuthenticated = Boolean(user);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [resultSource, setResultSource] = useState<'quiz' | 'celebrity' | 'inspiration' | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [analysis, setAnalysis] = useState<MakeupAnalysis | null>(null);
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [inventory, setInventory] = useState<(Product & { id: string })[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [masterFacePhoto, setMasterFacePhoto] = useState<string | null>(null);
  const [inspoPhoto, setInspoPhoto] = useState<string | null>(null);
  const [localInspoFace, setLocalInspoFace] = useState<string | null>(null);
  const [inspoText, setInspoText] = useState('');
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [hairResultImage, setHairResultImage] = useState<string | null>(null);
  const [inspoEntryHint, setInspoEntryHint] = useState<'upload' | 'selfie' | null>(null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [historyDetailData, setHistoryDetailData] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev < 98 ? prev + Math.random() * 8 : prev));
      }, 400);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (isAuthenticated) {
        try {
          const cloudPhoto = await loadCloudProfilePhoto();
          if (!cancelled && cloudPhoto) {
            setMasterFacePhoto(cloudPhoto);
            return;
          }
        } catch {
          // fall through to local
        }
      }

      const localPhoto = await loadProfilePhoto();
      if (!cancelled) {
        setMasterFacePhoto(localPhoto);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (isAuthenticated) {
        try {
          const cloudInventory = await loadAllCloudInventory();
          if (!cancelled) {
            setInventory(cloudInventory);
            return;
          }
        } catch {
          // fall through to local
        }
      }

      const localInventory = await loadAllInventory();
      if (!cancelled) {
        setInventory(localInventory);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!masterFacePhoto) return;

    const persist = async () => {
      if (isAuthenticated) {
        try {
          await upsertCloudProfilePhoto(masterFacePhoto);
          return;
        } catch {
          // fallback to local
        }
      }
      await saveProfilePhoto(masterFacePhoto);
    };

    persist();
  }, [masterFacePhoto, isAuthenticated, user?.id]);

  const persistAnalysis = useCallback(
    async (data: SavedAnalysis) => {
      if (isAuthenticated) {
        try {
          await upsertCloudAnalysis(data);
          return;
        } catch {
          // fallback to local
        }
      }
      await saveAnalysis(data);
    },
    [isAuthenticated, user?.id]
  );

  const persistInventoryItem = useCallback(
    async (item: Product & { id: string }) => {
      if (isAuthenticated) {
        try {
          await upsertCloudInventoryItem(item);
          return;
        } catch {
          // fallback to local
        }
      }
      await saveInventoryItem(item);
    },
    [isAuthenticated, user?.id]
  );

  const deleteInventoryById = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        try {
          await deleteCloudInventoryItem(id);
          return;
        } catch {
          // fallback to local
        }
      }
      await deleteInventoryItem(id);
    },
    [isAuthenticated, user?.id]
  );

  const loadAnalysisById = useCallback(
    async (id: string): Promise<SavedAnalysis | null> => {
      if (isAuthenticated) {
        try {
          return await loadCloudAnalysis(id);
        } catch {
          // fallback to local
        }
      }
      return await loadAnalysis(id);
    },
    [isAuthenticated, user?.id]
  );

  const updateTryOnById = useCallback(
    async (id: string, image: string) => {
      if (isAuthenticated) {
        try {
          await updateCloudTryOn(id, image);
          return;
        } catch {
          // fallback to local
        }
      }
      await updateAnalysisTryOn(id, image);
    },
    [isAuthenticated, user?.id]
  );

  const loadAnalysesForHistory = useCallback(async (): Promise<SavedAnalysis[]> => {
    if (isAuthenticated) {
      try {
        return await loadAllCloudAnalyses();
      } catch {
        // fallback to local
      }
    }
    return await loadAllAnalyses();
  }, [isAuthenticated, user?.id]);

  const deleteAnalysisForHistory = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        try {
          await deleteCloudAnalysis(id);
          return;
        } catch {
          // fallback to local
        }
      }
      await deleteAnalysis(id);
    },
    [isAuthenticated, user?.id]
  );

  // ── Analytics ──
  // Track page views
  useEffect(() => {
    trackPageView(currentPage);
  }, [currentPage]);

  // Identify user on auth
  useEffect(() => {
    if (user) {
      identifyUser(user.id, user.email || undefined);
    } else if (!authLoading) {
      resetUser();
    }
  }, [user, authLoading]);

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

  const validateFaceWithUI = async (photo: string): Promise<boolean> => {
    setLoading(true);
    setLoadingMessage('Verifying selfie...');
    try {
      const isValid = await validateFaceImage(photo.split(',')[1]);
      if (!isValid) {
        alert('Please upload a clear face selfie only!');
        return false;
      }
      return true;
    } catch {
      alert('Validation failed. Try again with a clear photo.');
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
    setLoadingMessage('Mapping facial geometry...');
    try {
      const result = await analyzeFaceFeatures(activePhoto.split(',')[1]);
      trackEvent('analysis_completed', { source: 'face-analysis' });
      setFaceAnalysis(result);
      setCurrentPage('face-analysis');
    } catch {
      alert('Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const processQuiz = async (answers: QuizAnswers) => {
    setTryOnImage(null);
    setLoading(true);
    setLoadingMessage('Curating beauty blueprint...');
    try {
      const result = await getMakeupFromQuiz(answers);
      trackEvent('analysis_completed', { source: 'quiz', style: result.styleName });
      const id = generateId();
      setCurrentAnalysisId(id);
      setAnalysis(result);
      setResultSource('quiz');
      setCurrentPage('results');
      await persistAnalysis({
        id,
        timestamp: Date.now(),
        source: 'quiz',
        analysis: result,
        userPhoto: masterFacePhoto,
        inspoPhoto: null,
        tryOnImage: null,
      });
    } catch {
      alert('Quiz error!');
    } finally {
      setLoading(false);
    }
  };

  const processCelebrity = async (photo?: string) => {
    const activePhoto = photo || masterFacePhoto;
    if (!activePhoto) {
      setCurrentPage('celebrity');
      return;
    }

    const isValid = await validateFaceWithUI(activePhoto);
    if (!isValid) return;

    setTryOnImage(null);
    setLoading(true);
    setLoadingMessage('Searching your celebrity twin...');
    try {
      const result = await analyzeCelebrityLookAlike(activePhoto.split(',')[1]);
      trackEvent('analysis_completed', { source: 'celebrity', celebrity: result.celebrityMatch });
      const id = generateId();
      setCurrentAnalysisId(id);
      setAnalysis(result);
      setResultSource('celebrity');
      setCurrentPage('results');
      await persistAnalysis({
        id,
        timestamp: Date.now(),
        source: 'celebrity',
        analysis: result,
        userPhoto: activePhoto,
        inspoPhoto: null,
        tryOnImage: null,
      });
    } catch {
      alert('Celebrity search failed!');
    } finally {
      setLoading(false);
    }
  };

  const processInspiration = async () => {
    const activeFace = localInspoFace || masterFacePhoto;
    if (!activeFace) {
      alert('Please provide a canvas photo (your selfie) first!');
      return;
    }

    const isValid = await validateFaceWithUI(activeFace);
    if (!isValid) return;

    setLoading(true);
    setLoadingMessage('Analyzing inspiration...');
    try {
      const result = await analyzeInspirationLook(inspoPhoto, activeFace, inspoText);
      setAnalysis(result);
      setResultSource('inspiration');
      setCurrentPage('results');
    } catch {
      alert('Inspiration failed!');
    } finally {
      setLoading(false);
    }
  };

  const processInspirationSubmit = async (
    newInspoPhoto: string | null,
    facePhoto: string,
    newInspoText: string
  ) => {
    setInspoPhoto(newInspoPhoto);
    if (facePhoto !== masterFacePhoto) {
      setLocalInspoFace(facePhoto);
    } else {
      setLocalInspoFace(null);
    }
    setInspoText(newInspoText);
    setTryOnImage(null);
    setLoading(true);
    setLoadingMessage('Analyzing inspiration...');
    try {
      const result = await analyzeInspirationLook(newInspoPhoto, facePhoto, newInspoText);
      trackEvent('analysis_completed', { source: 'inspiration', style: result.styleName });
      const id = generateId();
      setCurrentAnalysisId(id);
      setAnalysis(result);
      setResultSource('inspiration');
      setCurrentPage('results');
      await persistAnalysis({
        id,
        timestamp: Date.now(),
        source: 'inspiration',
        analysis: result,
        userPhoto: facePhoto,
        inspoPhoto: newInspoPhoto,
        tryOnImage: null,
      });
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
    setLoadingMessage('AI Makeup Magic...');
    try {
      const result = await generateTryOn(activeFace.split(',')[1], `${analysis.styleName}: ${analysis.description}`);
      trackEvent('tryon_generated', { style: analysis.styleName });
      setTryOnImage(result);
      if (currentAnalysisId) {
        await updateTryOnById(currentAnalysisId, result);
      }
    } catch {
      alert('Try-on failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleHairTryOn = async (
    style: string,
    color: string,
    mode: 'both' | 'keep-style' | 'keep-color'
  ) => {
    if (!masterFacePhoto) return;

    const isValid = await validateFaceWithUI(masterFacePhoto);
    if (!isValid) return;

    setLoading(true);
    setLoadingMessage(
      mode === 'keep-style'
        ? `Changing hair color to ${color}...`
        : mode === 'keep-color'
          ? `Changing hairstyle to ${style}...`
          : `Styling hair: ${color} ${style}...`
    );
    try {
      const result = await generateHairTryOn(masterFacePhoto.split(',')[1], style, color, mode);
      trackEvent('hair_tryon_generated', { style, color, mode });
      setHairResultImage(result);
    } catch {
      alert('Hair lab failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryScan = async (photos: string[]) => {
    if (photos.length === 0) return;
    setLoading(true);
    setLoadingMessage('Scanning vanity...');
    try {
      const results = await analyzeInventory(photos.map((p) => p.split(',')[1]));
      trackEvent('product_scanned', { count: results.length });
      const itemsWithIds = results.map((p) => ({ ...p, id: generateId() }));
      for (const item of itemsWithIds) {
        await persistInventoryItem(item);
      }
      setInventory((prev) => [...prev, ...itemsWithIds]);
    } catch {
      alert('Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAdd = async (brand: string, name: string) => {
    setLoading(true);
    setLoadingMessage('Validating product details...');
    try {
      const official = await normalizeProduct(brand, name);
      const item = { ...official, category: official.category || 'other', id: generateId() };
      await persistInventoryItem(item);
      setInventory((prev) => [...prev, item]);
    } catch {
      const item = { brand, name, category: 'other', id: generateId() };
      await persistInventoryItem(item);
      setInventory((prev) => [...prev, item]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInventoryItem = async (id: string) => {
    await deleteInventoryById(id);
    setInventory((prev) => prev.filter((p) => p.id !== id));
  };

  const removeFromWishlist = (idx: number) => {
    setWishlist((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSignOut = async () => {
    try {
      trackEvent('user_signed_out');
      await signOut();
      setShowAuthModal(false);
    } catch {
      alert('Sign out failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onHome={handleRestart}
        onInventory={() => setCurrentPage('inventory')}
        onWishlist={() => setCurrentPage('wishlist')}
        onHistory={() => setCurrentPage('history')}
        activePage={currentPage}
        onRestart={handleRestart}
        inventoryCount={inventory.length}
        wishlistCount={wishlist.length}
        masterPhoto={masterFacePhoto}
        onSetMasterPhoto={setMasterFacePhoto}
        validateFace={validateFace}
        authLoading={authLoading}
        userEmail={user?.email ?? null}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <main className="flex-grow">
        {loading && (
          <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8 text-center space-y-6" role="status" aria-live="polite">
            <div className="w-64 bg-surface-container-low h-3 overflow-hidden" style={{ borderRadius: '0.25rem' }}>
              <div className="h-full bg-primary transition-all duration-300" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Analysis progress" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-neutral-900 font-serif text-xl italic">{loadingMessage}</p>
          </div>
        )}

        {currentPage === 'landing' && (
          <Landing
            onQuiz={() => setCurrentPage('quiz')}
            onCelebrity={() => setCurrentPage('celebrity')}
            onInspiration={(hint) => {
              setInspoEntryHint(hint ?? null);
              setCurrentPage('inspiration');
            }}
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
          <FaceAnalysisView result={faceAnalysis} userPhoto={masterFacePhoto} onBack={() => {
            setFaceAnalysis(null);
            setCurrentPage('landing');
          }} />
        )}

        {currentPage === 'wishlist' && (
          <WishlistView wishlist={wishlist} onRemove={removeFromWishlist} onBack={() => setCurrentPage('landing')} />
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
            onDelete={handleDeleteInventoryItem}
            onBack={() => setCurrentPage('landing')}
          />
        )}

        {currentPage === 'history' && (
          <HistoryView
            onBack={() => setCurrentPage('landing')}
            onViewDetail={async (id) => {
              const data = await loadAnalysisById(id);
              if (data) {
                setHistoryDetailData(data);
                setCurrentPage('history-detail');
              }
            }}
            loadAnalyses={loadAnalysesForHistory}
            deleteAnalysisById={deleteAnalysisForHistory}
            dataScopeKey={user?.id ?? 'guest'}
          />
        )}

        {currentPage === 'history-detail' && historyDetailData && (
          <ResultsView
            analysis={historyDetailData.analysis}
            inventory={[]}
            userPhoto={historyDetailData.userPhoto}
            inspoPhoto={historyDetailData.inspoPhoto}
            onBack={() => setCurrentPage('history')}
            onRestart={() => setCurrentPage('landing')}
            onTryOn={() => {}}
            onAddToWishlist={() => {}}
            tryOnImage={historyDetailData.tryOnImage}
            isCelebrityTwin={historyDetailData.source === 'celebrity'}
            readonly={true}
          />
        )}

        {currentPage === 'results' && analysis && (
          <ResultsView
            analysis={analysis}
            inventory={inventory}
            userPhoto={localInspoFace || masterFacePhoto}
            inspoPhoto={inspoPhoto}
            onBack={() => {
              if (resultSource === 'quiz') setCurrentPage('landing');
              else if (resultSource === 'celebrity') setCurrentPage('celebrity');
              else setCurrentPage('inspiration');
            }}
            onRestart={handleRestart}
            onTryOn={handleTryOn}
            onAddToWishlist={(p) => setWishlist((prev) => [...prev, p])}
            tryOnImage={tryOnImage}
            isCelebrityTwin={resultSource === 'celebrity'}
            onFaceAnalysis={() => processFaceAnalysis()}
            onCelebrity={() => setCurrentPage('celebrity')}
            onHairLab={() => setCurrentPage('hair-lab')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
