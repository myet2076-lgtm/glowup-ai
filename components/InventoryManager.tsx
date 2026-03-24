
import React, { useRef, useState } from 'react';
import { Product } from '../types';

interface Props {
  currentInventory: Product[];
  onScan: (photos: string[]) => void;
  onAddManual: (brand: string, name: string) => void;
  onBack: () => void;
}

const InventoryManager: React.FC<Props> = ({ currentInventory, onScan, onAddManual, onBack }) => {
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

  const getProductIcon = (cat: string) => {
    cat = cat.toLowerCase();
    if (cat.includes('lip')) return '💄';
    if (cat.includes('eye') || cat.includes('mascara')) return '👁️';
    if (cat.includes('foundation') || cat.includes('face')) return '🧴';
    if (cat.includes('blush') || cat.includes('palette')) return '🎨';
    return '✨';
  };

  return (
    <div className="space-y-12 py-8 pt-32 animate-in slide-in-from-bottom-4 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-pink-600 font-bold hover:translate-x-[-4px] transition-transform">← Home</button>
        <h2 className="serif text-4xl text-pink-900">Your Digital Vanity</h2>
        <div className="w-10"></div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-pink-50 shadow-xl space-y-4">
            <h3 className="text-[10px] font-black uppercase text-pink-400 tracking-widest">Scan label</h3>
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-pink-50 text-pink-600 rounded-2xl font-bold border border-pink-100 text-xs hover:bg-pink-100 transition-colors">Upload Label Photo</button>
            <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            {selectedPhotos.length > 0 && <button onClick={() => onScan(selectedPhotos)} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold text-xs shadow-lg animate-pulse">Sync {selectedPhotos.length} Items</button>}
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-pink-50 shadow-xl space-y-4">
            <h3 className="text-[10px] font-black uppercase text-pink-400 tracking-widest">Manual Entry</h3>
            <input value={manualBrand} onChange={e => setManualBrand(e.target.value)} placeholder="Brand (e.g. Dior)" className="w-full p-3 rounded-xl border border-pink-50 text-xs outline-none focus:ring-1 ring-pink-200 transition-all" />
            <input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Product Name" className="w-full p-3 rounded-xl border border-pink-50 text-xs outline-none focus:ring-1 ring-pink-200 transition-all" />
            <button onClick={handleManualAdd} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">Add to Vanity</button>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white p-10 rounded-[50px] border border-pink-50 shadow-inner min-h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/20 to-transparent pointer-events-none"></div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-8 relative z-10">
              {currentInventory.length === 0 ? (
                <div className="col-span-full h-80 flex flex-col items-center justify-center text-pink-200 space-y-4 opacity-50">
                  <span className="text-7xl">🧴</span>
                  <p className="font-bold text-sm italic tracking-widest">Your vanity is a blank canvas...</p>
                </div>
              ) : (
                currentInventory.map((item, i) => (
                  <a 
                    key={i} 
                    href={`https://www.sephora.com/search?keyword=${encodeURIComponent(item.brand + ' ' + item.name)}`}
                    target="_blank"
                    className="flex flex-col items-center group animate-in zoom-in duration-300"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md border-2 border-white ring-4 ring-pink-50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all cursor-pointer relative">
                      {getProductIcon(item.category)}
                      <div className="absolute -bottom-1 w-10 h-1 bg-black/5 rounded-full blur-[3px]"></div>
                    </div>
                    <div className="mt-3 text-center space-y-0.5">
                       <p className="text-[9px] font-black text-gray-800 uppercase leading-tight truncate w-24 px-1">{item.name}</p>
                       <p className="text-[7px] text-pink-400 font-bold uppercase tracking-tighter">{item.brand}</p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
