import React, { useState, useEffect } from 'react';
import { SavedAnalysis } from '../persistence';

interface HistoryViewProps {
  onBack: () => void;
  onViewDetail: (id: string) => void;
  loadAnalyses: () => Promise<SavedAnalysis[]>;
  deleteAnalysisById: (id: string) => Promise<void>;
  dataScopeKey?: string;
}

const sourceLabels: Record<string, string> = {
  quiz: 'Quiz',
  celebrity: 'Celebrity Twin',
  inspiration: 'Inspiration',
};

const formatDate = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const HistoryView: React.FC<HistoryViewProps> = ({ onBack, onViewDetail, loadAnalyses, deleteAnalysisById, dataScopeKey }) => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setLoaded(false);
    loadAnalyses().then((data) => {
      setAnalyses(data);
      setLoaded(true);
    });
  }, [loadAnalyses, dataScopeKey]);

  const handleDelete = async (id: string) => {
    await deleteAnalysisById(id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    setConfirmId(null);
  };

  return (
    <div className="motion-safe:animate-fade-in-up max-w-2xl mx-auto px-4 py-8 space-y-8 pt-32">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3 text-xs font-label uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-800 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl text-neutral-900 tracking-tight">Your History</h1>
        <div className="w-16" />
      </div>

      {loaded && analyses.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <p className="text-xl text-neutral-400 italic">No saved looks yet.</p>
          <p className="text-sm text-secondary">Start creating and your looks will appear here!</p>
        </div>
      )}

      <div className="space-y-4">
        {analyses.map((item) => (
          <div
            key={item.id}
            className="bg-white editorial-shadow flex items-stretch overflow-hidden"
            style={{ borderRadius: '0.25rem' }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              {item.userPhoto ? (
                <img
                  src={item.userPhoto}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: 'linear-gradient(135deg, #e8d5c4 0%, #c4a882 100%)',
                  }}
                />
              )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
              <h3 className="text-base text-neutral-900 truncate">
                {item.analysis.styleName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-secondary uppercase tracking-[0.2em]">
                  {sourceLabels[item.source] || item.source}
                </span>
                <span className="text-neutral-200">·</span>
                <span className="text-[10px] text-secondary">{formatDate(item.timestamp)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => onViewDetail(item.id)}
                className="min-h-[44px] px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-neutral-900 text-xs font-label uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{ borderRadius: '0.25rem' }}
              >
                View
              </button>

              {confirmId === item.id ? (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="min-h-[44px] px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-label uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                    style={{ borderRadius: '0.25rem' }}
                    aria-label={`Confirm delete ${item.analysis.styleName}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="min-h-[44px] px-3 py-2 text-neutral-500 text-xs font-label uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    style={{ borderRadius: '0.25rem' }}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(item.id)}
                  className="min-h-[44px] px-3 py-2 text-neutral-400 hover:text-red-500 text-xs font-label uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={{ borderRadius: '0.25rem' }}
                  aria-label={`Delete ${item.analysis.styleName}`}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
