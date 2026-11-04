import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from './ProductCard';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Star,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CornerDownRight,
  Send,
  ArrowLeft,
  Store,
  QrCode,
  Calendar,
} from 'lucide-react';

export const PharmacyDetailView: React.FC = () => {
  const {
    shops,
    selectedShopId,
    setSelectedShopId,
    products,
    reviews,
    addReview,
    followedShopIds,
    toggleFollowShop,
    favoriteShopIds,
    toggleFavoriteShop,
  } = useAppStore();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // If a shop is selected, show detail; otherwise show all pharmacies
  const activeShop = selectedShopId
    ? shops.find((s) => s.id === selectedShopId) || shops[0]
    : null;

  const shopProducts = activeShop
    ? products.filter((p) => p.shopId === activeShop.id && p.available && p.stock > 0)
    : [];

  const shopReviews = activeShop
    ? reviews.filter((r) => r.shopId === activeShop.id)
    : [];

  const isFollowed = activeShop ? followedShopIds.includes(activeShop.id) : false;
  const isFavorite = activeShop ? favoriteShopIds.includes(activeShop.id) : false;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShop || !comment.trim()) return;
    setIsSubmittingReview(true);
    addReview(activeShop.id, rating, comment);
    setComment('');
    setIsSubmittingReview(false);
  };

  // If no specific shop selected, render list of all partner pharmacies
  if (!activeShop) {
    return (
      <div className="space-y-6 pb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F0E4] text-[#005C52] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#005C52]" />
            <span>Réseau d’Officines et Parapharmacies Partenaires</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans']">
            Pharmacies Partenaires à Dijon & Métropole
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl">
            Toutes les officines référencées sur CareCycle sont vérifiées avec agrément ARS et numéros RPPS.
            Commandez vos soins en Click & Collect et retirez-les directement au comptoir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shops.map((shop) => {
            const availProds = products.filter((p) => p.shopId === shop.id && p.available && p.stock > 0);
            return (
              <div
                key={shop.id}
                onClick={() => setSelectedShopId(shop.id)}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden hover:border-[#005C52] hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="h-44 relative bg-stone-100 overflow-hidden">
                  <img
                    src={shop.coverUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-stone-800 flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{shop.rating}</span>
                    <span className="text-stone-400">({shop.reviewCount})</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-[#005C52] text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                    {shop.distance ?? 0.5} km • Dijon
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C52] bg-[#E0F0E4] px-2 py-0.5 rounded-md">
                        {shop.establishmentType === 'pharmacie' ? 'Pharmacie d’Officine' : 'Parapharmacie'}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        RPPS : {shop.rppsNumber}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-stone-900 group-hover:text-[#005C52] transition-colors">
                      {shop.name}
                    </h2>

                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{shop.address}, {shop.city}</span>
                    </p>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {shop.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {availProds.length} produit(s) anti-gaspi
                    </span>
                    <span className="text-xs font-bold text-[#005C52] flex items-center gap-1">
                      Accéder à la fiche →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Shop View
  return (
    <div className="space-y-8 pb-20">
      {/* Return button */}
      <button
        onClick={() => setSelectedShopId(null)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#005C52] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux pharmacies de Dijon</span>
      </button>

      {/* Hero Header of the Shop */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="h-48 sm:h-64 relative bg-stone-100">
          <img
            src={activeShop.coverUrl}
            alt={activeShop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Quick badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFollowShop(activeShop.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                isFollowed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/95 text-stone-800 hover:bg-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-white' : ''}`} />
              <span>{isFollowed ? 'Officine suivie' : 'Suivre cette officine'}</span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 relative">
          {/* Avatar and basic info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                <img
                  src={activeShop.avatarUrl}
                  alt={activeShop.pharmacistName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#005C52] bg-[#E0F0E4] px-2.5 py-0.5 rounded-full">
                    {activeShop.establishmentType === 'pharmacie' ? 'Pharmacie Titulaire' : 'Parapharmacie'}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {activeShop.pharmacistName}
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans']">
                  {activeShop.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 flex items-center gap-2 text-xs font-bold text-stone-800">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{activeShop.rating} / 5</span>
                <span className="text-stone-400 font-normal">({activeShop.reviewCount} avis)</span>
              </div>
            </div>
          </div>

          {/* Details Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-100 text-xs">
            {/* Contact & Address */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px]">
                Coordonnées & Accès
              </h4>
              <p className="flex items-center gap-2 text-stone-700">
                <MapPin className="w-4 h-4 text-[#005C52] shrink-0" />
                <span>{activeShop.address}, {activeShop.postalCode} {activeShop.city}</span>
              </p>
              <p className="flex items-center gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-[#005C52] shrink-0" />
                <span>{activeShop.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-stone-700">
                <Mail className="w-4 h-4 text-[#005C52] shrink-0" />
                <span>{activeShop.email}</span>
              </p>
            </div>

            {/* Regulatory credentials */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px]">
                Agréments Sanitaires Officiels
              </h4>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">N° RPPS Titulaire :</span>
                  <span className="font-mono font-bold text-stone-900">{activeShop.rppsNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Agrément ARS :</span>
                  <span className="font-mono font-bold text-stone-900">{activeShop.arsAgreement}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-700 font-medium pt-1 border-t border-stone-200/50">
                  <span>Validation Ordre :</span>
                  <span className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                  </span>
                </div>
              </div>
            </div>

            {/* Click & Collect counter instructions */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px]">
                Modalités de Retrait au Comptoir
              </h4>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-stone-700 leading-relaxed">
                {activeShop.instructions}
              </div>
            </div>
          </div>

          {/* Opening Hours Table Toggle / display */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px] mb-3">
              Horaires d’Ouverture de l’Officine
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {activeShop.hours.map((h) => (
                <div
                  key={h.day}
                  className={`p-2.5 rounded-xl border text-center ${
                    h.open
                      ? 'bg-stone-50 border-stone-200 text-stone-800'
                      : 'bg-stone-100/50 border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="font-bold text-xs">{h.day}</div>
                  <div className="text-[11px] mt-0.5 font-medium">
                    {h.open ? `${h.openTime} - ${h.closeTime}` : 'Fermé'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Products at this Pharmacy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Rayon Anti-Gaspillage de cette Officine
            </h2>
            <p className="text-xs text-stone-500">
              {shopProducts.length} référence(s) à sauver chez {activeShop.name}
            </p>
          </div>
        </div>

        {shopProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
            <Store className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-700">Tous les produits ont été sauvés !</h3>
            <p className="text-xs text-stone-500 mt-1">
              Cette pharmacie n'a pas de stock DLC courte actuellement. Activez le suivi pour être notifié des arrivages.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {shopProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#005C52]" />
            <h3 className="text-lg font-bold text-stone-900">Avis Patients & Clients</h3>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            {shopReviews.length} avis vérifiés
          </span>
        </div>

        {/* Reviews list */}
        <div className="space-y-4 divide-y divide-stone-100">
          {shopReviews.length === 0 ? (
            <p className="text-xs text-stone-400 py-4">Soyez le premier à donner votre avis !</p>
          ) : (
            shopReviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">{rev.clientName}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500' : 'text-stone-300'}`}
                      />
                    ))}
                    <span className="text-[10px] text-stone-400 ml-1">{rev.createdAt}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>

                {/* Pharmacist Reply */}
                {rev.reply && (
                  <div className="ml-4 pl-3 border-l-2 border-[#005C52] bg-emerald-50/50 p-3 rounded-r-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#005C52] font-bold text-[11px]">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Réponse de {activeShop.pharmacistName}</span>
                    </div>
                    <p className="text-stone-700">{rev.reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add review form */}
        <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-stone-200 space-y-3">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Laisser un avis sur votre retrait
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600">Note :</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Votre avis sur la qualité des soins et l'accueil en pharmacie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#005C52]"
              required
            />
            <button
              type="submit"
              disabled={isSubmittingReview || !comment.trim()}
              className="px-4 py-2 bg-[#005C52] hover:bg-[#00443D] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
