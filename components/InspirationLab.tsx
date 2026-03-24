import React, { useState, useRef, useEffect } from 'react';

interface InspirationLabProps {
  masterFacePhoto: string | null;
  onBack: () => void;
  onQuiz: () => void;
  onSubmit: (inspoPhoto: string | null, facePhoto: string, inspoText: string) => Promise<void>;
  onSetMasterPhoto: (photo: string) => void;
  validateFace: (photo: string) => Promise<boolean>;
  initialInspoPhoto?: string | null;
  initialInspoText?: string;
  initialFace?: string | null;
  entryHint?: 'upload' | 'selfie' | null;
}

const InspirationLab: React.FC<InspirationLabProps> = ({
  masterFacePhoto,
  onBack,
  onQuiz,
  onSubmit,
  onSetMasterPhoto,
  validateFace,
  initialInspoPhoto,
  initialInspoText,
  initialFace,
  entryHint,
}) => {
  const [inspoPhoto, setInspoPhoto] = useState<string | null>(initialInspoPhoto ?? null);
  const [inspoText, setInspoText] = useState(initialInspoText ?? '');
  const [localFace, setLocalFace] = useState<string | null>(initialFace ?? null);
  const [showUploadSelfie, setShowUploadSelfie] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const inspoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (entryHint === 'selfie' && !masterFacePhoto) {
      setShowUploadSelfie(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInspoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setInspoPhoto(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
    if (inspoFileRef.current) inspoFileRef.current.value = '';
  };

  const activeFace = localFace || masterFacePhoto;
  const hasInspo = !!inspoPhoto || inspoText.trim().length > 0;
  const canSubmit = hasInspo && !!activeFace && !submitting && !validating && !showUploadSelfie;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataURL = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setValidating(true);
      setError(null);

      const ok = await validateFace(dataURL);
      if (ok) {
        setLocalFace(dataURL);
        setShowUploadSelfie(false);
        if (!masterFacePhoto) {
          onSetMasterPhoto(dataURL);
        }
      } else {
        setError("We couldn\u2019t detect a face. Please use a clear, front-facing selfie with good lighting.");
      }
    } catch {
      setError('Something went wrong reading that file. Please try a different image.');
    } finally {
      setValidating(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!hasInspo || !activeFace) return;

    setSubmitting(true);
    try {
      await onSubmit(inspoPhoto, activeFace, inspoText);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="motion-safe:animate-fade-in-up py-12 sm:py-20 max-w-xl mx-auto px-6 sm:px-0 pt-32">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors duration-300 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
      >
        &larr; Back
      </button>

      {/* Header */}
      <div className="text-center mb-16 mt-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-label mb-8">
          Inspiration Lab
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-neutral-900 leading-[1.08] tracking-tight">
          Show us the vibe.<br />
          <span className="italic text-neutral-600">We&rsquo;ll decode it.</span>
        </h1>
        <div className="mx-auto mt-10 mb-8 h-px w-12 bg-primary" />
        <p className="font-sans text-secondary text-lg leading-relaxed max-w-sm mx-auto">
          Upload a look or describe the aesthetic&hellip;
        </p>
      </div>

      {/* Step 01 — Your Inspiration */}
      <div className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-serif text-3xl text-neutral-200">01</span>
          <span className="font-serif text-xl text-neutral-900">Your inspiration</span>
        </div>
        <div className="bg-white editorial-shadow p-6 sm:p-8 space-y-6" style={{ borderRadius: '0.25rem' }}>
          <input
            type="file"
            ref={inspoFileRef}
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleInspoFileSelect}
          />
          {inspoPhoto ? (
            <div className="space-y-3">
              <img
                src={inspoPhoto}
                alt="Your inspiration"
                className="w-full max-h-[200px] object-cover"
                style={{ borderRadius: '0.25rem' }}
              />
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => inspoFileRef.current?.click()}
                  className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2 py-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded transition-colors duration-300"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => setInspoPhoto(null)}
                  className="text-xs text-neutral-400 hover:text-red-500 underline underline-offset-2 py-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inspoFileRef.current?.click()}
              className="w-full py-4 min-h-[44px] border-2 border-dashed border-neutral-200 text-secondary rounded-none text-sm font-medium hover:bg-surface-container-low transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Upload an inspiration image 📸
            </button>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-100" />
            <span className="text-[10px] text-secondary uppercase tracking-[0.2em]">or describe it</span>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div>
            <label
              htmlFor="inspo-text"
              className="block text-[10px] text-neutral-900 font-label uppercase tracking-[0.2em] mb-2"
            >
              Describe the look
            </label>
            <textarea
              id="inspo-text"
              placeholder="e.g. 'Golden hour glow with smoked-out liner and glossy lips'..."
              className="w-full p-4 border-0 border-b border-outline-variant outline-none h-28 resize-none text-sm text-on-surface placeholder:text-neutral-300 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-surface-container-low"
              value={inspoText}
              onChange={(e) => setInspoText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-100 mb-12" />

      {/* Step 02 — Your Selfie */}
      <div className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-serif text-3xl text-neutral-200">02</span>
          <span className="font-serif text-xl text-neutral-900">Your selfie</span>
        </div>
        <div className="bg-white editorial-shadow p-6 sm:p-8" style={{ borderRadius: '0.25rem' }}>
          {/* Case A: Using master profile photo */}
          {masterFacePhoto && !showUploadSelfie && !localFace && (
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-200 flex-shrink-0 editorial-shadow">
                <img src={masterFacePhoto} alt="Your profile photo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">Using your profile photo</p>
                <p className="text-xs text-secondary mt-1">We&rsquo;ll use this for personalised analysis.</p>
                <button
                  type="button"
                  onClick={() => setShowUploadSelfie(true)}
                  className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2 mt-2 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded transition-colors duration-300"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Case B: Local face uploaded */}
          {localFace && !showUploadSelfie && (
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-200 flex-shrink-0 editorial-shadow">
                <img src={localFace} alt="Your uploaded selfie" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">Selfie ready</p>
                <p className="text-xs text-secondary mt-1">We&rsquo;ll use this for personalised analysis.</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadSelfie(true)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded transition-colors duration-300"
                  >
                    Change
                  </button>
                  {masterFacePhoto && (
                    <button
                      type="button"
                      onClick={() => setLocalFace(null)}
                      className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded transition-colors duration-300"
                    >
                      Use profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Case C: No photo available, or actively uploading */}
          {(showUploadSelfie || (!localFace && !masterFacePhoto)) && (
            <div className="space-y-4 text-center">
              <input type="file" ref={fileRef} accept="image/jpeg,image/png" className="hidden" onChange={handleFileSelect} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-describedby={error ? 'selfie-error' : undefined}
                className="w-full py-4 min-h-[44px] border-2 border-dashed border-neutral-200 text-secondary rounded-none text-sm font-medium hover:bg-surface-container-low transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Upload a selfie 📷
              </button>
              {showUploadSelfie && masterFacePhoto && (
                <button
                  type="button"
                  onClick={() => { setShowUploadSelfie(false); setLocalFace(null); }}
                  className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors duration-300 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  &larr; Back to profile photo
                </button>
              )}
            </div>
          )}

          {/* Validation spinner */}
          {validating && (
            <div className="mt-4 text-center">
              <span role="status" aria-live="polite" className="text-sm text-secondary font-medium">Validating your selfie&hellip;</span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-100 mb-12" />

      {/* Error */}
      {error && (
        <div id="selfie-error" role="alert" aria-live="assertive" className="text-sm text-red-500 font-medium text-center mb-8">
          {error}
        </div>
      )}

      {/* Quiz nudge */}
      {!hasInspo && (
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={onQuiz}
            className="group inline-flex items-center gap-1.5 py-3 px-4 min-h-[44px] text-neutral-500 hover:text-neutral-800 transition-colors duration-300 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            <span className="text-secondary">No inspiration in mind?</span>
            <span className="underline underline-offset-4 decoration-neutral-200 group-hover:decoration-neutral-500 transition-colors duration-300">
              Take a style quiz instead
            </span>
          </button>
        </div>
      )}

      {/* Submit section */}
      <div className="text-center space-y-4">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="bg-primary hover:opacity-90 active:scale-[0.97] text-white px-12 py-5 min-h-[44px] rounded-none font-label uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/10 transition-all duration-300 disabled:opacity-30 disabled:grayscale focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {submitting ? 'Analyzing\u2026' : 'Glow Up \u2728'}
        </button>
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors duration-300 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspirationLab;
