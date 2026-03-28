
import React, { useRef, useState } from 'react';
import { Product } from '../types';

interface Props {
  currentInventory: (Product & { id: string })[];
  onScan: (photos: string[]) => void;
  onAddManual: (brand: string, name: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const InventoryManager: React.FC<Props> = ({ currentInventory, onScan, onAddManual, onDelete, onBack }) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [manualName, setManualName] = useState('');
  const [manualBrand, setManualBrand] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const photoPromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(photoPromises).then(results => setSelectedPhotos(prev => [...prev, ...results]));
  };

  const handleManualAdd = () => {
    if (manualName && manualBrand) {
      onAddManual(manualBrand, manualName);
      setManualName('');
      setManualBrand('');
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 pt-32 animate-in slide-in-from-bottom-4">
      <div className="max-w-5xl mx-auto px-4 space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-neutral-900 hover:opacity-70 transition-opacity min-h-[44px] px-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined align-middle" style={{ fontSize: '20px' }}>arrow_back</span>
            <span className="ml-1 align-middle">Back</span>
          </button>
          <h2 className="text-3xl text-neutral-900 tracking-tight">Your Collection</h2>
          <div className="w-20" aria-hidden="true"></div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-12 gap-8">

          {/* Left Column */}
          <div className="md:col-span-4 space-y-6">

            {/* Scan Products Card */}
            <div className="bg-white editorial-shadow p-6 space-y-5" style={{ borderRadius: '0.25rem' }}>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium">Scan Products</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Scan the item&apos;s label. If there is no label, manually type the product name and brand in the field below.
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-neutral-900 text-white text-xs uppercase tracking-[0.15em] font-medium rounded-none min-h-[44px] hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Upload Label Photo
              </button>
              <input
                id="inventory-upload"
                name="inventory-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {selectedPhotos.length > 0 && (
                <>
                  <div className="flex gap-2 flex-wrap">
                    {selectedPhotos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`Selected photo ${i + 1}`}
                        className="w-14 h-14 object-cover"
                        style={{ borderRadius: '0.25rem' }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => { onScan(selectedPhotos); setSelectedPhotos([]); }}
                    className="w-full py-3 bg-primary text-on-primary text-xs uppercase tracking-[0.15em] font-medium rounded-none min-h-[44px] hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Analyze {selectedPhotos.length} {selectedPhotos.length === 1 ? 'Photo' : 'Photos'}
                  </button>
                </>
              )}
            </div>

            {/* Manual Entry Card */}
            <div className="bg-white editorial-shadow p-6 space-y-5" style={{ borderRadius: '0.25rem' }}>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium">Manual Entry</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="manual-brand" className="text-[10px] uppercase tracking-[0.2em] text-secondary block mb-1">Brand</label>
                  <input
                    id="manual-brand"
                    value={manualBrand}
                    onChange={e => setManualBrand(e.target.value)}
                    placeholder="e.g. Dior"
                    className="w-full py-2 text-sm text-neutral-900 bg-transparent border-0 border-b border-outline-variant outline-none focus:border-primary transition-colors placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label htmlFor="manual-name" className="text-[10px] uppercase tracking-[0.2em] text-secondary block mb-1">Product Name</label>
                  <input
                    id="manual-name"
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="e.g. Lip Glow Oil"
                    className="w-full py-2 text-sm text-neutral-900 bg-transparent border-0 border-b border-outline-variant outline-none focus:border-primary transition-colors placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleManualAdd}
                disabled={!manualName || !manualBrand}
                className="w-full py-3 bg-neutral-900 text-white text-xs uppercase tracking-[0.15em] font-medium rounded-none min-h-[44px] hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Add to Collection
              </button>
            </div>
          </div>

          {/* Right Column — Product Grid */}
          <div className="md:col-span-8">
            {currentInventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-3">
                <span className="material-symbols-outlined text-neutral-300" style={{ fontSize: '48px' }}>inventory_2</span>
                <p className="text-lg text-neutral-400 italic">Your collection is empty</p>
                <p className="text-xs text-secondary">Scan product labels or add items manually to get started.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentInventory.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white editorial-shadow p-5 flex items-start justify-between"
                    style={{ borderRadius: '0.25rem' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-secondary uppercase tracking-[0.2em]">{product.brand}</p>
                      <h4 className="text-sm text-neutral-900 mt-1 truncate">{product.name}</h4>
                      <p className="text-xs text-secondary mt-0.5">{product.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors min-h-[44px] p-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded flex-shrink-0"
                      aria-label={`Remove ${product.name}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
