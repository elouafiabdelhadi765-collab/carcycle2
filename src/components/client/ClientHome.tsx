import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from './ProductCard';
import { CARECYCLE_CATEGORIES } from '../../constants/categories';
import {
  Sparkles,
  Leaf,
  Clock,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  MapPin,
  Store,
  Star,
  CheckCircle2,
  PackageOpen,
  ArrowRight,
  Flame,
} from 'lucide-react';
import type { ProductCategory } from '../../types';

export const ClientHome: React.FC = () => {
  const {
    products,
    shops,
    selectedCategory,
    setSelectedCategory,
    setCurrentTab,
    setSelectedShopId,
    clientUser,
    userCity,
  } = useAppStore();

  // Products with short DLC or high discounts
  const urgentDlcProducts = products.filter(
    (p) => p.available && p.stock > 0 && (p.isDlcShort || (p.dlcDaysLeft && p.dlcDaysLeft <= 15))
  );

  const featuredDeals = products.filter(
    (p) => p.available && p.stock > 0 && (p.originalPrice - p.price) / p.originalPrice >= 0.45
  );

  return (
    <div className="space-y-10 pb-16">
      {/* ── 1. Hero Impact Banner ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#005C52] via-[#004D44] to-[#003832] text-white p-6 sm:p-10 shadow-xl shadow-[#005C52]/15">
        {/* Decorative circle glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-[#FFC940]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-200">
            <Leaf className="w-3.5 h-3.5 text-[#FFC940]" />
            <span>Objectif Zéro Gaspillage en Officine • {userCity}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] leading-tight">
            Sauvez des soins de grandes marques à{' '}
            <span className="text-[#FFC940] underline decoration-[#FFC940]/40">
              prix anti-gaspi jusqu’à -70%
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            Crèmes, solaires, laits pour bébé et compléments alimentaires approchant de leur date limite :
            commandez en Click & Collect et retirez au comptoir de votre pharmacie de quartier.
          </p>

          {/* Impact Stats Pills */}
          <div className="pt-2 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/15">
            <div>
              <div className="text-xl sm:text-3xl font-extrabold font-mono text-[#FFC940]">
                {urgentDlcProducts.length * 6 + 48}
              </div>
              <div className="text-[11px] sm:text-xs text-emerald-200 font-medium">
                Soins à sauver aujourd'hui
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-3xl font-extrabold font-mono text-white">
                -50%
              </div>
              <div className="text-[11px] sm:text-xs text-emerald-200 font-medium">
                Remise moyenne constatée
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                100%
              </div>
              <div className="text-[11px] sm:text-xs text-emerald-200 font-medium">
                Contrôlé par des pharmaciens
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Category Quick Filters ────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              Explorer par Rayon
            </h2>
            <p className="text-xs text-stone-500">Sélectionnez une catégorie pour filtrer les soins</p>
          </div>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-xs font-semibold text-[#005C52] hover:underline flex items-center gap-1"
          >
            <span>Tout voir</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentTab('explore');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
              selectedCategory === 'all'
                ? 'bg-[#005C52] text-white border-[#005C52] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Toutes les offres ({products.filter((p) => p.available && p.stock > 0).length})</span>
          </button>

          {CARECYCLE_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id && p.available).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentTab('explore');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#005C52] text-white border-[#005C52] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500/40'
                }`}
              >
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. Urgence DLC : Sauvetage Express ────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-[#D9534F]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                  Sauvetage Express : Dates Très Courtes (J-3 à J-15)
                </h2>
                <span className="bg-[#D9534F] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Urgence DLC
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Remises maximales autorisées pour éviter la mise au rebut
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentTab('explore');
            }}
            className="hidden sm:flex text-xs font-semibold text-[#005C52] hover:underline items-center gap-1"
          >
            <span>Voir les {urgentDlcProducts.length} urgences</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {urgentDlcProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 4. Offres Vedettes & Marques Phares ──────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Offres Vedettes Dermo-Cosmétique
              </h2>
              <p className="text-xs text-stone-500">
                La Roche-Posay, Avène, Caudalie, Bioderma, Mustela à prix cassé
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredDeals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 5. Partner Pharmacies (Officines à Dijon) ──────────────────────── */}
      <section className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-[#005C52]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Nos Officines Partenaires à Dijon
              </h2>
              <p className="text-xs text-stone-500">
                Pharmaciens titulaires engagés pour la revalorisation de leurs invendus
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('pharmacies')}
            className="text-xs font-semibold text-[#005C52] hover:underline flex items-center gap-1"
          >
            <span>Toutes les officines ({shops.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {shops.map((shop) => {
            const shopProds = products.filter((p) => p.shopId === shop.id && p.available && p.stock > 0);
            return (
              <div
                key={shop.id}
                onClick={() => {
                  setSelectedShopId(shop.id);
                  setCurrentTab('pharmacies');
                }}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden hover:border-emerald-500/50 hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row"
              >
                {/* Shop Cover */}
                <div className="sm:w-48 h-40 sm:h-auto relative bg-stone-100 overflow-hidden shrink-0">
                  <img
                    src={shop.coverUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-stone-800 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{shop.rating}</span>
                    <span className="text-stone-400">({shop.reviewCount})</span>
                  </div>
                  {shop.distance && (
                    <div className="absolute bottom-2 left-2 bg-[#005C52] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                      {shop.distance} km
                    </div>
                  )}
                </div>

                {/* Shop Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#005C52] bg-[#E0F0E4] px-2 py-0.5 rounded-md">
                        {shop.establishmentType === 'pharmacie' ? 'Pharmacie Agréée' : 'Parapharmacie'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        RPPS : {shop.rppsNumber}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 group-hover:text-[#005C52] transition-colors leading-snug">
                      {shop.name}
                    </h3>

                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{shop.address}, {shop.city}</span>
                    </p>

                    <p className="text-xs text-stone-600 line-clamp-2 mt-2">
                      {shop.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="text-xs font-semibold text-emerald-800">
                      {shopProds.length} soins anti-gaspi disponibles
                    </div>
                    <span className="text-xs font-bold text-[#005C52] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Consulter le rayon →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. Comment fonctionne le Click & Collect Anti-Gaspi ───────────── */}
      <section className="bg-stone-100/80 rounded-3xl p-6 sm:p-10 border border-stone-200">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold tracking-wider text-[#005C52] uppercase bg-[#E0F0E4] px-3 py-1 rounded-full">
            Simplicité & Sécurité
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Comment fonctionne CareCycle ?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Une démarche solidaire et éco-responsable pour votre pouvoir d'achat et la planète.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/70 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E0F0E4] text-[#005C52] font-extrabold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Réservez vos soins</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Choisissez parmi des centaines de références dermatologiques et cosmétiques remisées jusqu'à -70% à proximité de chez vous.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/70 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5D6] text-amber-800 font-extrabold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Recevez votre Pass Retrait</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Votre commande génère instantanément un code sécurisé (#CC-XXXX) et un QR Code présentable sur votre smartphone.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/70 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#005C52] font-extrabold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Retirez en pharmacie</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Rendez-vous au comptoir de l'officine. Le pharmacien scanne votre code et vous remet votre commande sans délai d'attente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
