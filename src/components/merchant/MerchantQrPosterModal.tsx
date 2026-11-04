import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { QRCodeView } from '../common/QRCodeView';
import {
  X,
  Printer,
  Download,
  Store,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const MerchantQrPosterModal: React.FC = () => {
  const { activeModal, setActiveModal, shops, merchantUser } = useAppStore();

  if (activeModal !== 'qr-poster') return null;

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];
  const qrValue = `https://carecycle.fr/shop/${myShop.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative print:max-w-none print:w-full print:h-full print:border-none print:shadow-none">
        {/* Controls bar (hidden during print) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-stone-100 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005C52] text-white flex items-center justify-center">
              <Printer className="w-4 h-4 text-[#FFC940]" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-sm">Affiche Comptoir Officine (A4)</h2>
              <p className="text-[11px] text-stone-500">Pour inviter vos patients à suivre vos invendus</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#005C52] hover:bg-[#00443D] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer l'Affiche</span>
            </button>

            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Artwork */}
        <div className="p-8 sm:p-12 flex flex-col items-center text-center space-y-6 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-8 border-[#005C52] rounded-3xl m-4 print:m-0 print:border-none">
          {/* Pharmacy Branding Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005C52] text-white text-xs font-bold tracking-wide">
              <Leaf className="w-3.5 h-3.5 text-[#FFC940]" />
              <span>ENGAGEMENT ZÉRO GASPILLAGE EN OFFICINE</span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
              <span className="text-[#005C52]">Care</span>
              <span className="text-[#E5A812]">Cycle</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 max-w-md mx-auto">
              {myShop.name}
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              {myShop.address}, {myShop.city} • RPPS : {myShop.rppsNumber}
            </p>
          </div>

          {/* Central Call to Action */}
          <div className="max-w-md space-y-1">
            <h2 className="text-lg font-bold text-stone-800">
              Ne jetez plus, valorisez avec nous !
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Scannez ce QR Code pour accéder en direct à nos soins et parapharmacie à dates courtes jusqu’à <strong>-70%</strong>.
            </p>
          </div>

          {/* Large Stylized QR Code */}
          <div className="p-4 bg-white rounded-3xl border-2 border-stone-200 shadow-md">
            <QRCodeView
              value={qrValue}
              size={220}
              sublabel="Ouvrez l'appareil photo de votre smartphone pour scanner"
              className="border-none shadow-none p-2"
            />
          </div>

          {/* 3 Step Instruction Guide */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg text-left text-xs pt-4 border-t border-stone-200">
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#005C52] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h4 className="font-bold text-stone-900">Scannez</h4>
              <p className="text-[11px] text-stone-500 leading-snug">
                Pointez votre appareil photo sur ce code.
              </p>
            </div>

            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#FFC940] text-stone-900 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h4 className="font-bold text-stone-900">Réservez</h4>
              <p className="text-[11px] text-stone-500 leading-snug">
                Bloquez vos soins anti-gaspi en Click & Collect.
              </p>
            </div>

            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#005C52] flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h4 className="font-bold text-stone-900">Retirez</h4>
              <p className="text-[11px] text-stone-500 leading-snug">
                Passez directement à notre comptoir.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-stone-400 font-medium">
            Pharmacie partenaire du réseau CareCycle France • Agréée ARS Bourgogne-Franche-Comté
          </div>
        </div>
      </div>
    </div>
  );
};
