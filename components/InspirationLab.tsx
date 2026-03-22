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

  // Entry hint: auto-open selfie upload if hint is 'selfie' and no master photo
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
      // Reset file input so re-selecting same file triggers change
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
    <div className="motion-safe:animate-fade-in-up py-12 sm:py-20 max-w-xl mx-auto px-6 sm:px-0">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-pink-500 transition-colors py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
      >
        &larr; Back
      </button>

      {/* Header */}
      <div className="text-center mb-16 mt-4">
        <p className="text-pink-600 uppercase tracking-[0.3em] text-xs font-medium mb-8">
          Inspiration Lab
        </p>
        <h1 className="serif text-4xl sm:text-5xl text-pink-900 leading-[1.08] tracking-[-0.02em]">
          Show us the vibe.<br />
          <span className="italic text-rose-600">We&rsquo;ll decode it.</span>
        </h1>
        <div className="mx-auto mt-10 mb-8 h-px w-12 bg-pink-200" />
        <p className="font-light text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
          Upload a look or describe the aesthetic&hellip;
        </p>
      </div>

      {/* Step 01 — Your Inspiration */}
      <div className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="serif text-3xl text-pink-200">01</span>
          <span className="serif text-xl text-pink-900">Your inspiration</span>
        </div>
        <div className="bg-white rounded-2xl border border-pink-50 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Inspo image upload — inline, no PhotoUpload component */}
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
                className="w-full max-h-[200px] object-cover rounded-2xl border border-pink-100"
              />
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => inspoFileRef.current?.click()}
                  className="text-xs text-pink-600 underline underline-offset-2 py-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => setInspoPhoto(null)}
                  className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 py-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inspoFileRef.current?.click()}
              className="w-full py-4 min-h-[44px] border-2 border-dashed border-pink-200 text-pink-500 rounded-2xl text-sm font-medium hover:bg-pink-50 transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
            >
              Upload an inspiration image 📸
            </button>
          )}

          {/* "or describe it" divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-pink-100" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">or describe it</span>
            <div className="flex-1 h-px bg-pink-100" />
          </div>

          <div>
            <label
              htmlFor="inspo-text"
              className="block text-xs text-gray-600 font-medium uppercase tracking-widest mb-2"
            >
              Describe the look
            </label>
            <textarea
              id="inspo-text"
              placeholder="e.g. 'Golden hour glow with smoked-out liner and glossy lips'..."
              className="w-full p-4 rounded-2xl border border-pink-100 outline-none h-28 resize-none text-sm text-gray-700 placeholder:text-gray-300 transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
              value={inspoText}
              onChange={(e) => setInspoText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-pink-200 mb-12" />

      {/* Step 02 — Your Selfie */}
      <div className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="serif text-3xl text-pink-200">02</span>
          <span className="serif text-xl text-pink-900">Your selfie</span>
        </div>
        <div className="bg-white rounded-2xl border border-pink-50 shadow-sm p-6 sm:p-8">
          {/* Case A: Using master profile photo (no local face, not uploading) */}
          {masterFacePhoto && !showUploadSelfie && !localFace && (
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-300 shadow-md flex-shrink-0">
                <img
                  src={masterFacePhoto}
                  alt="Your profile photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-pink-900">Using your profile photo</p>
                <p className="text-xs text-gray-500 mt-1">
                  We&rsquo;ll use this for personalised analysis.
                </p>
                <button
                  type="button"
                  onClick={() => setShowUploadSelfie(true)}
                  className="text-xs text-pink-600 underline underline-offset-2 mt-2 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Case B: Local face uploaded (not uploading) */}
          {localFace && !showUploadSelfie && (
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-300 shadow-md flex-shrink-0">
                <img
                  src={localFace}
                  alt="Your uploaded selfie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-pink-900">Selfie ready</p>
                <p className="text-xs text-gray-500 mt-1">
                  We&rsquo;ll use this for personalised analysis.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadSelfie(true)}
                    className="text-xs text-pink-600 underline underline-offset-2 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
                  >
                    Change
                  </button>
                  {masterFacePhoto && (
                    <button
                      type="button"
                      onClick={() => setLocalFace(null)}
                      className="text-xs text-pink-600 underline underline-offset-2 py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
                    >
                      Use profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Case C: No photo available, or actively uploading a new one */}
          {(showUploadSelfie || (!localFace && !masterFacePhoto)) && (
            <div className="space-y-4 text-center">
              <input
                type="file"
                ref={fileRef}
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-describedby={error ? 'selfie-error' : undefined}
                className="w-full py-4 min-h-[44px] border-2 border-dashed border-pink-200 text-pink-500 rounded-2xl text-sm font-medium hover:bg-pink-50 transition-all focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
              >
                Upload a selfie 📷
              </button>
              {showUploadSelfie && masterFacePhoto && (
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadSelfie(false);
                    setLocalFace(null);
                  }}
                  className="text-xs text-gray-400 hover:text-pink-500 transition-colors py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
                >
                  &larr; Back to profile photo
                </button>
              )}
            </div>
          )}

          {/* Validation spinner */}
          {validating && (
            <div className="mt-4 text-center">
              <span role="status" aria-live="polite" className="text-sm text-pink-600 font-medium">
                Validating your selfie&hellip;
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-pink-200 mb-12" />

      {/* Error */}
      {error && (
        <div
          id="selfie-error"
          role="alert"
          aria-live="assertive"
          className="text-sm text-red-500 font-medium text-center mb-8"
        >
          {error}
        </div>
      )}

      {/* Quiz nudge */}
      {!hasInspo && (
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={onQuiz}
            className="group inline-flex items-center gap-1.5 py-3 px-4 min-h-[44px] text-pink-600 hover:text-pink-700 transition-colors text-sm font-medium focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
          >
            <span className="text-gray-600">No inspiration in mind?</span>
            <span className="underline underline-offset-4 decoration-pink-300 group-hover:decoration-pink-500 transition-colors">
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
          className="bg-pink-600 hover:bg-pink-700 active:scale-[0.97] text-white px-12 py-4 min-h-[44px] rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-pink-300/50 transition-all disabled:opacity-30 disabled:grayscale focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
        >
          {submitting ? 'Analyzing\u2026' : 'Glow Up \u2728'}
        </button>
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-gray-400 hover:text-pink-500 transition-colors py-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 rounded"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspirationLab;
