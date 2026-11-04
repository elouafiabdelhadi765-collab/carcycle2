import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Search,
  Store,
  User,
  Package,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ValidationRetraitModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    orders,
    validatePickup,
    merchantUser,
    showToast,
  } = useAppStore();

  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    order?: any;
    error?: string;
  } | null>(null);

  if (activeModal !== 'validation-retrait') return null;

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupCodeInput.trim()) return;

    const res = validatePickup(pickupCodeInput, merchantUser.fullName);
    setResult(res);
    if (res.success) {
      showToast(`Retrait validé avec succès pour ${res.order?.clientName} !`, 'success');
    }
  };

  const handleQuickSelectOrder = (code: string) => {
    setPickupCodeInput(code);
    const res = validatePickup(code, merchantUser.fullName);
    setResult(res);
    if (res.success) {
      showToast(`Retrait validé avec succès pour ${res.order?.clientName} !`, 'success');
    }
  };

  const readyOrders = orders.filter((o) => o.status === 'ready' || o.status === 'preparing');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-6 relative">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#005C52] text-white">
              <QrCode className="w-5 h-5 text-[#FFC940]" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-sm">Validation Retrait Comptoir</h2>
              <p className="text-[11px] text-stone-500">Scan QR Code ou saisie code client (#CC-XXXX)</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form input */}
        <form onSubmit={handleValidate} className="space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Saisir le code de retrait présenté par le patient :
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex : CC-8421"
              value={pickupCodeInput}
              onChange={(e) => setPickupCodeInput(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl font-mono text-base font-bold uppercase tracking-wider text-stone-900 focus:outline-none focus:border-[#005C52]"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#005C52] hover:bg-[#00443D] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Valider</span>
              <ArrowRight className="w-4 h-4 text-[#FFC940]" />
            </button>
          </div>
        </form>

        {/* Result notification */}
        {result && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              result.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {result.success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Commande {result.order?.orderCode} validée et délivrée !</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>{result.error}</span>
                </>
              )}
            </div>

            {result.success && result.order && (
              <div className="space-y-1 pt-1 border-t border-emerald-200/60 text-stone-700">
                <p>
                  <strong>Patient :</strong> {result.order.clientName} ({result.order.clientPhone})
                </p>
                <p>
                  <strong>Articles remis :</strong> {result.order.itemsCount} soin(s) anti-gaspi
                </p>
                <div className="space-y-0.5 text-[11px] text-stone-600 pl-2">
                  {result.order.items.map((i: any) => (
                    <div key={i.id}>
                      • {i.qty}x {i.name}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-800 pt-1">
                  ✓ Enregistré par {merchantUser.fullName} à l'instant.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Pending Orders Queue */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-600 uppercase tracking-wider text-[10px]">
              Commandes prêtes au comptoir en attente de retrait :
            </span>
            <span className="text-stone-400 text-[10px]">{readyOrders.length} commande(s)</span>
          </div>

          {readyOrders.length === 0 ? (
            <p className="text-xs text-stone-400 py-2">Aucune commande en attente de retrait immédiat.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {readyOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => handleQuickSelectOrder(ord.pickupCode)}
                  className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {ord.pickupCode}
                      </span>
                      <span className="font-semibold text-stone-800">{ord.clientName}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {ord.itemsCount} article(s) • Total : {ord.total.toFixed(2)} €
                    </p>
                  </div>

                  <span className="text-[11px] font-bold text-[#005C52] bg-[#E0F0E4] px-2.5 py-1 rounded-lg">
                    Valider le retrait
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
