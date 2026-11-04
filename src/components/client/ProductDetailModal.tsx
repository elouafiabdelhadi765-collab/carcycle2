import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  Heart,
  ShoppingBag,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Store,
  Check,
  Plus,
  Minus,
  Barcode,
  Info,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    setActiveModal,
    products,
    shops,
    addToCart,
    favoriteProductIds,
    toggleFavoriteProduct,
    setSelectedShopId,
    setCurrentTab,
  } = useAppStore();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const shop = shops.find((s) => s.id === product.shopId) || shops[0];
  const isFavorite = favoriteProductIds.includes(product.id);
  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const savings = ((product.originalPrice - product.price) * quantity).toFixed(2);

  const handleClose = () => {
    setSelectedProductId(null);
    setActiveModal(null);
  };

  const handleGoToShop = () => {
    setSelectedShopId(shop.id);
    setCurrentTab('pharmacies');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative">
        {/* Close & Favorite top bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E0F0E4] text-[#005C52]">
              Anti-Gaspillage Parapharmacie
            </span>
            <span className="text-xs font-mono text-stone-400">
              Réf : {product.cipCode ? `CIP ${product.cipCode}` : product.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteProduct(product.id)}
              className="p-2 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Favoris"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Visual & Key details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="relative bg-stone-50 rounded-2xl p-6 flex items-center justify-center min-h-[260px] border border-stone-100">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-56 max-w-full object-contain mix-blend-multiply"
              />
              <div className="absolute top-3 left-3 bg-[#005C52] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                -{discountPct}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#005C52]">
                Laboratoire {product.laboName}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>

              {/* Price card */}
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-500 font-medium">Prix anti-gaspillage</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#005C52] font-mono">
                      {product.price.toFixed(2)} €
                    </span>
                    <span className="text-sm text-stone-400 line-through font-mono">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-800 bg-[#E0F0E4] px-2.5 py-1 rounded-full">
                    Économisez {(product.originalPrice - product.price).toFixed(2)} €
                  </div>
                </div>
              </div>

              {/* Pharmacy chip */}
              <div
                onClick={handleGoToShop}
                className="flex items-center gap-3 p-3 bg-stone-50 hover:bg-stone-100 rounded-xl cursor-pointer border border-stone-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#005C52] flex items-center justify-center text-white shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-semibold text-stone-900 truncate">{shop.name}</div>
                  <div className="text-stone-500 truncate">{shop.address}, {shop.city}</div>
                </div>
                <span className="text-[11px] font-semibold text-[#005C52] whitespace-nowrap">
                  Voir l'officine →
                </span>
              </div>
            </div>
          </div>

          {/* DLC & Pharmaceutical Safety Guarantee */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Date Limite de Consommation (DLC) : {product.dlcDate}</span>
              {product.dlcDaysLeft && (
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Dans {product.dlcDaysLeft} jours
                </span>
              )}
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Ce produit de parapharmacie est vérifié par le pharmacien titulaire. Son emballage primaire est hermétiquement scellé et ses principes actifs restent 100% stables et conformes aux exigences sanitaires.
            </p>
          </div>

          {/* Product description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Description & Conseils d’utilisation
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Traceability meta table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Code CIP Pharma</span>
              <span className="font-mono font-semibold text-stone-800">{product.cipCode || '—'}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Code EAN-13</span>
              <span className="font-mono font-semibold text-stone-800">{product.eanCode || '—'}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Numéro de Lot</span>
              <span className="font-mono font-semibold text-stone-800">{product.lotNumber || 'Non renseigné'}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Stock Disponible</span>
              <span className="font-semibold text-stone-800">{product.stock} unité(s)</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs text-stone-500 font-medium">Quantité :</span>
            <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-stone-200 transition-colors text-stone-600"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm font-mono text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 hover:bg-stone-200 transition-colors text-stone-600"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right sm:hidden">
              <div className="text-xs text-stone-500">Total :</div>
              <div className="font-bold font-mono text-[#005C52]">
                {(product.price * quantity).toFixed(2)} €
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                addToCart(product, quantity);
                handleClose();
              }}
              disabled={product.stock <= 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#005C52] hover:bg-[#00443D] text-white rounded-xl font-semibold text-sm shadow-md shadow-[#005C52]/20 transition-all hover:scale-102"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFC940]" />
              <span>
                Réserver en Click & Collect • {(product.price * quantity).toFixed(2)} €
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
