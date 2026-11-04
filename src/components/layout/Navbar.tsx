import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  ShoppingBag,
  Bell,
  MapPin,
  Search,
  Sparkles,
  Store,
  QrCode,
  ChevronDown,
  Layers,
  Heart,
  SlidersHorizontal,
  User as UserIcon,
  LogIn,
} from 'lucide-react';
import { NotificationDropdown } from '../common/NotificationDropdown';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    clientUser,
    merchantUser,
    cart,
    setIsCartDrawerOpen,
    notifications,
    searchQuery,
    setSearchQuery,
    currentTab,
    setCurrentTab,
    setActiveModal,
    userCity,
    setUserCity,
    dlcAlerts,
    favoriteProductIds,
    favoriteShopIds,
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const unreadNotifs = notifications.filter(
    (n) => (n.recipientRole === role || !n.recipientRole) && !n.read
  ).length;

  const urgentDlcCount = dlcAlerts.filter((a) => !a.acknowledged).length;

  const cities = [
    'Dijon Centre (21000)',
    'Dijon Toison d’Or (21000)',
    'Dijon Fontaine-d’Ouche (21000)',
    'Chenôve (21300)',
    'Talant (21240)',
    'Quetigny (21800)',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentTab(role === 'client' ? 'home' : 'dashboard');
              }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005C52] to-[#00443D] flex items-center justify-center text-white shadow-md shadow-[#005C52]/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl font-['Plus_Jakarta_Sans'] tracking-tight text-[#FFC940]">
                  C
                </span>
                <span className="font-extrabold text-xl font-['Plus_Jakarta_Sans'] -ml-1 text-white">
                  C
                </span>
              </div>
              <div className="leading-tight">
                <div className="text-xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
                  <span className="text-[#005C52]">Care</span>
                  <span className="text-[#E5A812]">Cycle</span>
                </div>
                <div className="text-[10px] font-semibold text-stone-500 tracking-wider uppercase">
                  Anti-gaspi Parapharmacie
                </div>
              </div>
            </button>

            {/* City geolocation selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100/80 hover:bg-stone-200/70 text-xs font-medium text-stone-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#005C52]" />
                <span>{userCity}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showCityPicker && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Périmètre officines
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setUserCity(city);
                        setShowCityPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 transition-colors ${
                        userCity === city ? 'font-bold text-[#005C52] bg-emerald-50/50' : 'text-stone-700'
                      }`}
                    >
                      <span>{city}</span>
                      {userCity === city && <span className="w-1.5 h-1.5 rounded-full bg-[#005C52]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search bar (Client mode) or Quick Counter Validation (Merchant mode) */}
          {role === 'client' ? (
            <div className="flex-1 max-w-lg hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un soin, marque (Avène, La Roche-Posay, Nuxe...), CIP..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentTab !== 'explore' && e.target.value.trim().length > 0) {
                      setCurrentTab('explore');
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-[#005C52] rounded-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setActiveModal('validation-retrait')}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-[#005C52] hover:bg-[#00443D] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <QrCode className="w-4 h-4 text-[#FFC940]" />
                <span>Valider Retrait (#CC-XXXX)</span>
              </button>

              <button
                onClick={() => setActiveModal('add-product')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors"
              >
                <span>+ Ajouter produit</span>
              </button>
            </div>
          )}

          {/* Right actions: Notifications, User Auth & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User / Connexion Trigger */}
            <button
              onClick={() => setActiveModal('auth')}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#005C52]/50 hover:bg-stone-50 text-stone-700 transition-colors text-xs font-semibold"
              title="Connexion / Compte Supabase (Patient ou Pharmacien)"
            >
              <div className="w-6 h-6 rounded-lg bg-[#005C52] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                {role === 'client'
                  ? (clientUser?.fullName?.charAt(0) || 'C')
                  : 'Dr'}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="font-bold text-stone-800 text-[11px] truncate max-w-[110px]">
                  {role === 'client' ? clientUser.fullName : merchantUser.fullName}
                </span>
                <span className="text-[9px] text-[#005C52] font-semibold">
                  {role === 'client' ? 'Espace Patient' : 'Espace Officine'}
                </span>
              </div>
            </button>

            {/* Notifications button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-stone-600 hover:text-[#005C52] hover:bg-stone-100 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {role === 'client' && (
              <>
                {/* Cart button with floating drawer opener */}
                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="flex items-center gap-2 bg-[#005C52] hover:bg-[#00443D] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-[#005C52]/20 transition-all hover:scale-102"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 text-[#FFC940]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#FFC940] text-stone-900 rounded-full w-4 h-4 text-[10px] font-extrabold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline font-mono">
                    {cartTotal > 0 ? `${cartTotal.toFixed(2)} €` : 'Panier'}
                  </span>
                </button>
              </>
            )}

            {role === 'merchant' && (
              <button
                onClick={() => setActiveModal('qr-poster')}
                className="p-2 rounded-xl text-stone-700 hover:text-[#005C52] hover:bg-stone-100 transition-colors"
                title="Affiche QR Code Comptoir"
              >
                <QrCode className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-stone-100 py-1 overflow-x-auto no-scrollbar">
          {role === 'client' ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'home'
                    ? 'bg-[#E0F0E4] text-[#005C52]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Accueil & Anti-Gaspi
              </button>

              <button
                onClick={() => setCurrentTab('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'explore'
                    ? 'bg-[#E0F0E4] text-[#005C52]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Catalogue Soins & Beauté
              </button>

              <button
                onClick={() => setCurrentTab('pharmacies')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'pharmacies'
                    ? 'bg-[#E0F0E4] text-[#005C52]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Officines Partenaires
              </button>

              <button
                onClick={() => setCurrentTab('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'orders'
                    ? 'bg-[#E0F0E4] text-[#005C52]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Mes Retraits Click & Collect
              </button>

              <button
                onClick={() => setCurrentTab('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'profile'
                    ? 'bg-[#E0F0E4] text-[#005C52]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Mon Profil & Impact
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'dashboard'
                    ? 'bg-[#005C52] text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Tableau de Bord Officine
              </button>

              <button
                onClick={() => setCurrentTab('dlc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  currentTab === 'dlc'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <span>Alertes DLC Urgentes</span>
                {urgentDlcCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {urgentDlcCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('products')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'products'
                    ? 'bg-[#005C52] text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Gestion des Produits & Stock
              </button>

              <button
                onClick={() => setCurrentTab('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'orders'
                    ? 'bg-[#005C52] text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Commandes Comptoir
              </button>

              <button
                onClick={() => setCurrentTab('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'settings'
                    ? 'bg-[#005C52] text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Paramètres & Horaires Officine
              </button>

              <button
                onClick={() => setCurrentTab('reviews')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  currentTab === 'reviews'
                    ? 'bg-[#005C52] text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Avis Patients
              </button>
            </div>
          )}

          {/* Quick scan trigger for client */}
          {role === 'client' && (
            <button
              onClick={() => setActiveModal('qr-scanner')}
              className="flex items-center gap-1.5 text-xs text-[#005C52] hover:text-[#00443D] font-medium px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors shrink-0"
              title="Scanner le QR Code d'une officine"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scanner Officine</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
