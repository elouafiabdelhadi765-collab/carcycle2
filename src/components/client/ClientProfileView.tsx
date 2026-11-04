import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from './ProductCard';
import {
  User,
  Leaf,
  PiggyBank,
  PackageCheck,
  Heart,
  Store,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Edit2,
  Check,
  LogIn,
  LogOut,
} from 'lucide-react';
import { signOutFromSupabase } from '../../services/supabase';

export const ClientProfileView: React.FC = () => {
  const {
    clientUser,
    updateClientUser,
    shops,
    products,
    favoriteShopIds,
    favoriteProductIds,
    setSelectedShopId,
    setCurrentTab,
    setRole,
    setActiveModal,
    showToast,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(clientUser.fullName);
  const [phone, setPhone] = useState(clientUser.phone);
  const [address, setAddress] = useState(clientUser.address);

  const favoriteShops = shops.filter((s) => favoriteShopIds.includes(s.id));
  const favoriteProducts = products.filter((p) => favoriteProductIds.includes(p.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientUser({ fullName: name, phone, address });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#005C52] to-[#00443D] text-white flex items-center justify-center font-bold text-2xl shadow-md overflow-hidden">
              {clientUser.avatarUrl ? (
                <img src={clientUser.avatarUrl} alt={clientUser.fullName} className="w-full h-full object-cover" />
              ) : (
                clientUser.fullName.charAt(0)
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                  {clientUser.fullName}
                </h1>
                <span className="text-xs bg-[#E0F0E4] text-[#005C52] px-2.5 py-0.5 rounded-full font-semibold">
                  Compte Patient
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{clientUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#005C52]" />
              <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
            </button>

            <button
              onClick={() => setActiveModal('auth')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#005C52]" />
              <span>Changer de compte</span>
            </button>

            <button
              onClick={async () => {
                await signOutFromSupabase();
                showToast('Déconnecté de Supabase', 'info');
                setActiveModal('auth');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Edit Form or Information Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">Téléphone de retrait</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">Adresse principale</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>

            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-[#005C52] text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#00443D] transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#005C52]" />
              <span>{clientUser.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#005C52]" />
              <span>{clientUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#005C52]" />
              <span>{clientUser.address}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Anti-Waste Ecological Impact ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#005C52] to-[#003832] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl shadow-[#005C52]/10">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#FFC940]" />
          <h2 className="text-lg sm:text-xl font-bold font-['Plus_Jakarta_Sans']">
            Mon Bilan Éco-Responsable CareCycle
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-1">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
              <PiggyBank className="w-4 h-4 text-[#FFC940]" />
              <span>Économies réalisées</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#FFC940]">
              {clientUser.eurosSaved ? clientUser.eurosSaved.toFixed(2) : '74.50'} €
            </div>
            <p className="text-[11px] text-emerald-100/80">
              Grâce aux remises anti-gaspi sur vos soins
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-1">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>Émissions CO₂ évitées</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {clientUser.co2SavedKg ? clientUser.co2SavedKg.toFixed(1) : '5.5'} kg
            </div>
            <p className="text-[11px] text-emerald-100/80">
              ~500g de CO₂ préservés par produit sauvé
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-1">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
              <PackageCheck className="w-4 h-4 text-[#FFC940]" />
              <span>Soins sauvés du rebut</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-300">
              {clientUser.productsRescued ?? 11}
            </div>
            <p className="text-[11px] text-emerald-100/80">
              Produits valorisés auprès des officines
            </p>
          </div>
        </div>
      </div>

      {/* Favorite Pharmacies */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <span>Mes Officines Favorites</span>
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
            {favoriteShops.length}
          </span>
        </h2>

        {favoriteShops.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-stone-200 text-stone-500 text-xs">
            Vous n'avez pas encore d'officine favorite.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favoriteShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => {
                  setSelectedShopId(shop.id);
                  setCurrentTab('pharmacies');
                }}
                className="bg-white rounded-2xl p-4 border border-stone-200 flex items-center gap-3 cursor-pointer hover:border-[#005C52] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                  <img src={shop.avatarUrl} alt={shop.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <h4 className="font-bold text-stone-900 truncate">{shop.name}</h4>
                  <p className="text-stone-500 truncate">{shop.address}, {shop.city}</p>
                </div>
                <span className="text-xs font-bold text-[#005C52]">Consulter →</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Products */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <span>Mes Produits Favoris</span>
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
            {favoriteProducts.length}
          </span>
        </h2>

        {favoriteProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-stone-200 text-stone-500 text-xs">
            Aucun soin sauvegardé dans vos favoris.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {favoriteProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Merchant switch box */}
      <div className="bg-stone-100 rounded-3xl p-6 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#005C52] text-white flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Vous êtes titulaire ou préparateur en pharmacie ?</h4>
            <p className="text-stone-500">
              Basculez vers l'espace officine pour gérer vos alertes DLC, scanner les retraits et enregistrer vos invendus.
            </p>
          </div>
        </div>

        <button
          onClick={() => setRole('merchant')}
          className="px-4 py-2.5 bg-[#005C52] hover:bg-[#00443D] text-white font-bold rounded-xl transition-all whitespace-nowrap shadow-sm"
        >
          Accéder à l'Espace Pharmacien →
        </button>
      </div>
    </div>
  );
};
