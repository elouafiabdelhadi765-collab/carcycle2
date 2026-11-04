import React from 'react';
import type { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Heart, Plus, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const {
    addToCart,
    favoriteProductIds,
    toggleFavoriteProduct,
    setSelectedProductId,
    setActiveModal,
  } = useAppStore();

  const isFavorite = favoriteProductIds.includes(product.id);
  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // DLC Urgency styling
  const daysLeft = product.dlcDaysLeft ?? 15;
  const isUrgent = daysLeft <= 7;
  const isCritical = daysLeft <= 3;

  const dlcBadge = isCritical ? (
    <span className="flex items-center gap-1 bg-[#D9534F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
      <AlertCircle className="w-3 h-3" />
      Urgence {daysLeft}j (DLC)
    </span>
  ) : isUrgent ? (
    <span className="flex items-center gap-1 bg-[#FFC940] text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
      <Clock className="w-3 h-3" />
      Date courte {daysLeft}j
    </span>
  ) : (
    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" />
      DLC {product.dlcDate}
    </span>
  );

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        <span className="bg-[#005C52] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
          -{discountPct}%
        </span>
        {dlcBadge}
      </div>

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavoriteProduct(product.id);
        }}
        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isFavorite
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-white/80 backdrop-blur-sm text-stone-400 hover:text-red-500 hover:bg-white'
        }`}
        aria-label="Ajouter aux favoris"
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
      </button>

      {/* Image container */}
      <div
        onClick={() => {
          setSelectedProductId(product.id);
          setActiveModal('product-detail');
        }}
        className="w-full h-44 sm:h-48 bg-stone-100 relative cursor-pointer overflow-hidden flex items-center justify-center p-4"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
            Plus que {product.stock} dispo
          </span>
        )}
      </div>

      {/* Body content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div
          onClick={() => {
            setSelectedProductId(product.id);
            setActiveModal('product-detail');
          }}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span className="text-[#005C52] font-semibold tracking-wide uppercase text-[11px]">
              {product.laboName}
            </span>
            {product.cipCode && (
              <span className="text-[10px] text-stone-400">CIP {product.cipCode}</span>
            )}
          </div>

          <h3 className="font-semibold text-xs sm:text-sm text-stone-900 line-clamp-2 leading-snug group-hover:text-[#005C52] transition-colors">
            {product.name}
          </h3>

          <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
            {product.shopName}
          </p>
        </div>

        {/* Price and Cart action */}
        <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#005C52] font-mono">
                {product.price.toFixed(2)} €
              </span>
              <span className="text-xs text-stone-400 line-through font-mono">
                {product.originalPrice.toFixed(2)} €
              </span>
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">
              Économie : {(product.originalPrice - product.price).toFixed(2)} €
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium flex items-center justify-center transition-all ${
              product.stock > 0
                ? 'bg-[#005C52] hover:bg-[#00443D] text-white shadow-sm hover:scale-105 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Ajouter au panier Click & Collect"
            aria-label="Ajouter au panier"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
