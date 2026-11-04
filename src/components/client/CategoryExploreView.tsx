import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from './ProductCard';
import { CARECYCLE_CATEGORIES, getCategoryLabel } from '../../constants/categories';
import type { ProductCategory } from '../../types';
import {
  Search,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  Tag,
  X,
  Filter,
  Check,
} from 'lucide-react';

export const CategoryExploreView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dlcUrgentOnly,
    setDlcUrgentOnly,
  } = useAppStore();

  const [selectedLabo, setSelectedLabo] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);

  // Extract distinct laboratories
  const labos = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.laboName).filter(Boolean)));
    return list.sort();
  }, [products]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.available || p.stock <= 0) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Urgent DLC only
      if (dlcUrgentOnly && !p.isDlcShort && (!p.dlcDaysLeft || p.dlcDaysLeft > 15)) {
        return false;
      }

      // Labo filter
      if (selectedLabo !== 'all' && p.laboName !== selectedLabo) {
        return false;
      }

      // Discount filter
      const discountPct = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      if (discountPct < minDiscount) {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchLabo = p.laboName.toLowerCase().includes(q);
        const matchCip = p.cipCode?.toLowerCase().includes(q);
        const matchShop = p.shopName?.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchLabo && !matchCip && !matchShop && !matchDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const discountA = (a.originalPrice - a.price) / a.originalPrice;
      const discountB = (b.originalPrice - b.price) / b.originalPrice;

      if (sortBy === 'discount') {
        return discountB - discountA;
      }
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (sortBy === 'dlc_urgent') {
        const daysA = a.dlcDaysLeft ?? 999;
        const daysB = b.dlcDaysLeft ?? 999;
        return daysA - daysB;
      }
      // default: recommended
      return b.price - a.price;
    });
  }, [products, selectedCategory, dlcUrgentOnly, selectedLabo, minDiscount, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-20">
      {/* Search and Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Catalogue Parapharmacie & Anti-Gaspillage
            </h1>
            <p className="text-xs text-stone-500">
              Soins certifiés réservables en Click & Collect immédiat à Dijon
            </p>
          </div>

          {/* Quick Urgence DLC Toggle */}
          <button
            onClick={() => setDlcUrgentOnly(!dlcUrgentOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              dlcUrgentOnly
                ? 'bg-red-50 text-[#D9534F] border-red-200 shadow-sm'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Flame className="w-4 h-4 fill-current text-[#D9534F]" />
            <span>Filtre Urgence DLC (J-3 à J-15)</span>
            {dlcUrgentOnly && <Check className="w-3.5 h-3.5 text-[#D9534F]" />}
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par soin, actif, marque (Avène, La Roche-Posay...), code CIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#005C52] rounded-2xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-[#005C52] text-white border-[#005C52]'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            Tous les rayons ({products.filter((p) => p.available && p.stock > 0).length})
          </button>

          {CARECYCLE_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id && p.available).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#005C52] text-white border-[#005C52]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters and sorting row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Labo select */}
            <select
              value={selectedLabo}
              onChange={(e) => setSelectedLabo(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 font-medium focus:outline-none focus:border-[#005C52]"
            >
              <option value="all">Tous les laboratoires</option>
              {labos.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Min discount select */}
            <select
              value={minDiscount}
              onChange={(e) => setMinDiscount(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 font-medium focus:outline-none focus:border-[#005C52]"
            >
              <option value={0}>Toutes les remises</option>
              <option value={40}>-40% et plus</option>
              <option value={50}>-50% et plus</option>
              <option value={60}>-60% et plus</option>
            </select>

            {(selectedCategory !== 'all' || selectedLabo !== 'all' || minDiscount > 0 || dlcUrgentOnly || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLabo('all');
                  setMinDiscount(0);
                  setDlcUrgentOnly(false);
                  setSearchQuery('');
                }}
                className="text-[#005C52] hover:underline font-semibold flex items-center gap-1 px-2 py-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold text-stone-800 focus:outline-none focus:border-[#005C52]"
            >
              <option value="recommended">Recommandés</option>
              <option value="discount">Remise la plus forte (-%)</option>
              <option value="dlc_urgent">DLC la plus proche</option>
              <option value="price_asc">Prix croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          <strong>{filteredProducts.length}</strong> soin(s) anti-gaspillage trouvé(s)
          {selectedCategory !== 'all' && ` dans "${getCategoryLabel(selectedCategory)}"`}
        </span>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#005C52] flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Aucun soin ne correspond à ces critères
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Modifiez votre recherche ou réinitialisez vos filtres pour découvrir toutes nos offres en pharmacie.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLabo('all');
              setMinDiscount(0);
              setDlcUrgentOnly(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#005C52] text-white rounded-xl text-xs font-semibold hover:bg-[#00443D] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
