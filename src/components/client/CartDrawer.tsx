import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Leaf,
  Store,
  Tag,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQty,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setActiveModal,
  } = useAppStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  // Group items by pharmacy
  const shopsInCart = Array.from(new Set(cart.map((i) => i.shopId))).map((shopId) => {
    const items = cart.filter((i) => i.shopId === shopId);
    const shopName = items[0]?.shopName || 'Pharmacie';
    return { shopId, shopName, items };
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalSubtotal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPct) / 100 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalSavings = (originalSubtotal - finalTotal);
  const co2AvoidedKg = (totalItemsCount * 0.5).toFixed(1);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-stone-200 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#005C52] text-white">
              <ShoppingBag className="w-4 h-4 text-[#FFC940]" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-sm sm:text-base">
                Mon Panier Anti-Gaspillage
              </h2>
              <p className="text-[11px] text-stone-500">
                {totalItemsCount} soin(s) réservé(s) en Click & Collect
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#005C52] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">Votre panier est vide</h3>
            <p className="text-xs text-stone-500 max-w-xs">
              Découvrez des soins de parapharmacie à dates courtes remisés jusqu’à -70% et évitez leur destruction.
            </p>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="mt-2 px-4 py-2 bg-[#005C52] hover:bg-[#00443D] text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Sauver des soins maintenant
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* Environmental Impact Banner */}
            <div className="bg-[#E0F0E4] rounded-2xl p-3 flex items-center gap-3 border border-emerald-200/60">
              <div className="w-9 h-9 rounded-xl bg-[#005C52] text-white flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#FFC940]" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#005C52]">
                  Bravo ! Vous évitez ~{co2AvoidedKg} kg de CO₂
                </div>
                <div className="text-emerald-900/80 text-[11px]">
                  En sauvant ces soins de la destruction médicale.
                </div>
              </div>
            </div>

            {/* Items grouped by shop */}
            <div className="space-y-4">
              {shopsInCart.map((shopGroup) => (
                <div
                  key={shopGroup.shopId}
                  className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50/50 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800 pb-2 border-b border-stone-200">
                    <Store className="w-4 h-4 text-[#005C52]" />
                    <span className="truncate">{shopGroup.shopName}</span>
                    <span className="ml-auto text-[10px] text-stone-400 font-normal">
                      Retrait au comptoir
                    </span>
                  </div>

                  <div className="space-y-3">
                    {shopGroup.items.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-white rounded-xl p-2.5 border border-stone-100 flex items-center gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-14 h-14 object-contain rounded-lg bg-stone-50 p-1 shrink-0"
                        />

                        <div className="flex-1 min-w-0 text-xs">
                          <span className="text-[10px] text-[#005C52] font-semibold uppercase block">
                            {item.laboName}
                          </span>
                          <h4 className="font-semibold text-stone-900 truncate">
                            {item.productName}
                          </h4>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-[#005C52] font-mono">
                              {item.price.toFixed(2)} €
                            </span>
                            <span className="text-[10px] text-stone-400 line-through font-mono">
                              {item.originalPrice.toFixed(2)} €
                            </span>
                            {item.dlcDate && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                                DLC {item.dlcDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity adjustment */}
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                            <button
                              onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                              className="p-1 hover:bg-stone-200 text-stone-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                              className="p-1 hover:bg-stone-200 text-stone-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-stone-400 hover:text-red-500 transition-colors p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Tag className="w-3.5 h-3.5 text-[#005C52]" />
                <span>Code promotionnel ou bon solidaire</span>
              </div>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-900 font-mono">
                        {appliedPromo.code}
                      </span>
                      <span className="text-emerald-700 ml-1">
                        (-{appliedPromo.discountPct}%)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-red-500 p-1"
                    title="Retirer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: WELCOME10, ZEROGASPI"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#005C52]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Appliquer
                  </button>
                </form>
              )}

              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.error ? 'text-red-600' : 'text-emerald-700'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer / Total and Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Prix public en parapharmacie :</span>
                <span className="line-through font-mono">{originalSubtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Économies anti-gaspi :</span>
                <span className="font-mono">-{totalSavings.toFixed(2)} €</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Remise code {appliedPromo.code} :</span>
                  <span className="font-mono">-{discountAmount.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 font-bold text-stone-900 text-base">
                <span>Total à régler :</span>
                <span className="text-xl font-mono text-[#005C52]">
                  {finalTotal.toFixed(2)} €
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#005C52] hover:bg-[#00443D] text-white rounded-2xl font-bold text-sm shadow-md shadow-[#005C52]/20 transition-all hover:scale-101"
            >
              <span>Confirmer ma réservation Click & Collect</span>
              <ArrowRight className="w-4 h-4 text-[#FFC940]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantie de conformité sanitaire en officine</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
