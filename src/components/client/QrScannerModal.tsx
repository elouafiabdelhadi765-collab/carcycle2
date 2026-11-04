import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, QrCode, Store, Check, ArrowRight, Camera } from 'lucide-react';

export const QrScannerModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    shops,
    setSelectedShopId,
    setCurrentTab,
    toggleFollowShop,
    followedShopIds,
    showToast,
  } = useAppStore();

  const [inputCode, setInputCode] = useState('');
  const [selectedDemoShop, setSelectedDemoShop] = useState(shops[0]?.id || '');

  if (activeModal !== 'qr-scanner') return null;

  const handleScanSimulation = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) return;

    if (!followedShopIds.includes(shop.id)) {
      toggleFollowShop(shop.id);
    }
    showToast(`Officine "${shop.name}" reconnue et ajoutée à vos suivis !`, 'success');
    setSelectedShopId(shop.id);
    setCurrentTab('pharmacies');
    setActiveModal(null);
  };

  const handleManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toLowerCase();
    const matched = shops.find(
      (s) =>
        s.id.toLowerCase().includes(clean) ||
        s.name.toLowerCase().includes(clean) ||
        s.rppsNumber.includes(clean)
    );

    if (matched) {
      handleScanSimulation(matched.id);
    } else {
      showToast('Aucune officine trouvée avec cet identifiant ou nom.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-6 relative">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#005C52] text-white">
              <QrCode className="w-5 h-5 text-[#FFC940]" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-sm">Scanner une Pharmacie</h2>
              <p className="text-[11px] text-stone-500">Affiche comptoir ou QR code CareCycle</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Scanner Simulation Frame */}
        <div className="relative bg-stone-900 rounded-2xl h-56 flex flex-col items-center justify-center overflow-hidden border-2 border-[#005C52]">
          {/* Viewfinder crosshairs */}
          <div className="w-40 h-40 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center animate-pulse">
            <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-400/50" />
            <Camera className="w-8 h-8 text-white/40" />
          </div>

          <div className="absolute bottom-3 text-center px-4">
            <span className="text-[11px] text-emerald-200 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full font-medium">
              Placez le QR Code de l'officine au centre du cadre
            </span>
          </div>
        </div>

        {/* Demo Fast Selector for testing */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Ou simuler le scan d’une officine partenaire :
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {shops.map((shop) => (
              <button
                key={shop.id}
                onClick={() => handleScanSimulation(shop.id)}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-[#005C52] hover:bg-emerald-50/50 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <Store className="w-4 h-4 text-[#005C52] shrink-0" />
                  <span className="font-semibold text-stone-800 truncate">{shop.name}</span>
                </div>
                <span className="text-[10px] font-bold text-[#005C52] whitespace-nowrap">
                  Scanner →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual code entry */}
        <form onSubmit={handleManualCode} className="pt-2 border-t border-stone-100 space-y-2">
          <label className="block text-xs text-stone-500 font-medium">
            Entrer le nom ou N° RPPS de la pharmacie :
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex : Centrale, 10004928192..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#005C52]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#005C52] text-white rounded-xl text-xs font-bold hover:bg-[#00443D] transition-colors"
            >
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
