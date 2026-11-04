import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  QrCode,
  Tag,
  Bell,
  AlertTriangle,
  ChevronRight,
  Leaf,
  Package,
  Clock,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Percent,
  Check,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Flame,
  Building,
  User,
  Star,
  Barcode,
  ArrowRight,
} from 'lucide-react';
import type { OrderStatus, Product } from '../../types';

export const MerchantDashboard: React.FC = () => {
  const {
    shops,
    merchantUser,
    orders,
    products,
    dlcAlerts,
    updateOrderStatus,
    applyDiscountToProduct,
    resolveDlcAlert,
    addProduct,
    setActiveModal,
    setCurrentTab,
    initSupabaseSync,
    supabaseStatus,
    showToast,
    reviews,
  } = useAppStore();

  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [orderFilter, setOrderFilter] = useState<'all' | 'to_prepare' | 'ready' | 'completed'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Barcode Add Simulator state
  const [quickProductPreset, setQuickProductPreset] = useState('avene_cicalfate');
  const [quickStock, setQuickStock] = useState('4');
  const [quickDiscount, setQuickDiscount] = useState('50');
  const [quickDlcDays, setQuickDlcDays] = useState('14');

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];
  const myOrders = orders.filter((o) => o.shopId === myShop.id);
  const myProducts = products.filter((p) => p.shopId === myShop.id);
  const myReviews = reviews.filter((r) => r.shopId === myShop.id);

  // Filtered orders based on search and status tabs
  const filteredOrders = useMemo(() => {
    return myOrders.filter((ord) => {
      // Status filter
      if (orderFilter === 'to_prepare' && ord.status !== 'new' && ord.status !== 'preparing') {
        return false;
      }
      if (orderFilter === 'ready' && ord.status !== 'ready') {
        return false;
      }
      if (orderFilter === 'completed' && ord.status !== 'completed') {
        return false;
      }

      // Search filter
      if (orderSearch.trim()) {
        const query = orderSearch.toLowerCase();
        const matchCode = ord.pickupCode.toLowerCase().includes(query) || ord.orderCode.toLowerCase().includes(query);
        const matchClient = ord.clientName.toLowerCase().includes(query) || (ord.clientPhone && ord.clientPhone.includes(query));
        const matchItems = ord.items.some((i) => i.name.toLowerCase().includes(query));
        return matchCode || matchClient || matchItems;
      }
      return true;
    });
  }, [myOrders, orderFilter, orderSearch]);

  // KPIs
  const totalRevenue = useMemo(() => {
    return myOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [myOrders]);

  const activeOrdersCount = useMemo(() => {
    return myOrders.filter(
      (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready'
    ).length;
  }, [myOrders]);

  const urgentDlcCount = dlcAlerts.filter((a) => !a.acknowledged).length;

  const totalRescuedCount = useMemo(() => {
    return myOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.itemsCount, 0);
  }, [myOrders]);

  const totalCo2SavedKg = (totalRescuedCount * 0.5 + 14.5).toFixed(1);

  // Category breakdown calculation
  const categoryStats = useMemo(() => {
    const categoriesMap: Record<string, { label: string; count: number; totalValue: number }> = {
      soins_visage: { label: 'Soins Visage & Anti-Âge', count: 0, totalValue: 0 },
      hygiene_corps: { label: 'Hygiène & Corps', count: 0, totalValue: 0 },
      solaire: { label: 'Solaire & Protection UV', count: 0, totalValue: 0 },
      bebe_maternite: { label: 'Bébé & Maternité', count: 0, totalValue: 0 },
      complements_bio: { label: 'Compléments & Bien-être', count: 0, totalValue: 0 },
    };

    myProducts.forEach((p) => {
      const catKey = p.category in categoriesMap ? p.category : 'soins_visage';
      categoriesMap[catKey].count += p.stock;
      categoriesMap[catKey].totalValue += p.price * p.stock;
    });

    return Object.values(categoriesMap);
  }, [myProducts]);

  // Handle manual Supabase sync refresh
  const handleManualSync = async () => {
    setIsRefreshing(true);
    await initSupabaseSync();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Données officine synchronisées avec Supabase', 'success');
    }, 600);
  };

  // Quick preset catalog items for fast addition
  const QUICK_PRESETS: Record<string, { name: string; labo: string; category: any; origPrice: number; image: string; cip: string; ean: string }> = {
    avene_cicalfate: {
      name: 'Cicalfate+ Crème Réparatrice Protectrice 40ml',
      labo: 'Avène',
      category: 'soins_visage',
      origPrice: 11.90,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      cip: '3401360192842',
      ean: '3282779003889',
    },
    laroche_anthelios: {
      name: 'Anthelios UVMune 400 Fluide Invisible SPF50+ 50ml',
      labo: 'La Roche-Posay',
      category: 'solaire',
      origPrice: 17.50,
      image: 'https://images.unsplash.com/photo-1556228722-d0b5ed0b30ef?w=800&q=80',
      cip: '3401360281923',
      ean: '3337875777414',
    },
    nuxe_huile: {
      name: 'Huile Prodigieuse Multi-Fonctions 50ml',
      labo: 'Nuxe',
      category: 'hygiene_corps',
      origPrice: 16.90,
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80',
      cip: '3401360098765',
      ean: '3264680009754',
    },
    bioderma_crealine: {
      name: 'Créaline H2O Solution Micellaire Démaquillante 500ml',
      labo: 'Bioderma',
      category: 'soins_visage',
      origPrice: 12.90,
      image: 'https://images.unsplash.com/photo-1608248597359-009772c1c9c7?w=800&q=80',
      cip: '3401360054321',
      ean: '3401573670644',
    },
    klorane_shampoing: {
      name: 'Shampoing Extra-Doux au Lait d’Avoine 400ml',
      labo: 'Klorane',
      category: 'hygiene_corps',
      origPrice: 9.80,
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80',
      cip: '3401360088991',
      ean: '3282779051392',
    },
  };

  const handleQuickAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = QUICK_PRESETS[quickProductPreset];
    if (!preset) return;

    const discountPct = parseInt(quickDiscount, 10);
    const calculatedPrice = Math.round(preset.origPrice * (1 - discountPct / 100) * 100) / 100;
    const daysAhead = parseInt(quickDlcDays, 10);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    const dlcFormatted = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;

    const newProd = addProduct({
      shopId: myShop.id,
      shopName: myShop.name,
      name: preset.name,
      laboName: preset.labo,
      category: preset.category,
      price: calculatedPrice,
      originalPrice: preset.origPrice,
      description: `Produit anti-gaspillage officiel à date courte (${dlcFormatted}). Conditionnement neuf sous blister d'origine officinale.`,
      image: preset.image,
      stock: parseInt(quickStock, 10) || 3,
      dlcDate: dlcFormatted,
      isDlcShort: daysAhead <= 15,
      cipCode: preset.cip,
      eanCode: preset.ean,
      lotNumber: 'L2026-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      available: true,
      promo: true,
    });

    showToast(`"${newProd.name.slice(0, 30)}..." publié à -${discountPct}% !`, 'success');
  };

  return (
    <div className="space-y-8 pb-24">
      {/* ── 1. Pharmacy Identity & Command Header ────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-stone-200 shrink-0 bg-stone-100 shadow-xs">
            <img src={myShop.avatarUrl} alt={myShop.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C52] bg-[#E0F0E4] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#005C52]" />
                <span>Officine Titulaire Agréée ARS</span>
              </span>
              <span className="text-xs text-stone-500 font-mono">
                RPPS : {merchantUser.rppsNumber || myShop.rppsNumber}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-emerald-700 font-medium">
                Agrément : {myShop.arsAgreement}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans'] tracking-tight">
              {myShop.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
              <span>Pharmacien : <strong className="text-stone-800">{merchantUser.fullName}</strong></span>
              <span>·</span>
              <span>{myShop.address}, {myShop.city}</span>
              <span>·</span>
              <span className="text-[#005C52] font-semibold">Comptoir Click & Collect Ouvert</span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveModal('validation-retrait')}
            className="px-4 py-2.5 bg-[#005C52] hover:bg-[#00443D] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#005C52]/20 flex items-center gap-2"
          >
            <QrCode className="w-4 h-4 text-[#FFC940]" />
            <span>Valider Retrait (#CC-XXXX)</span>
          </button>

          <button
            onClick={() => setActiveModal('add-product')}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#005C52]" />
            <span>+ Ajouter soin</span>
          </button>

          <button
            onClick={() => setActiveModal('qr-poster')}
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
            title="Télécharger affiche A4 QR Code comptoir"
          >
            <Store className="w-4 h-4 text-[#005C52]" />
          </button>

          <button
            onClick={handleManualSync}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors disabled:opacity-50"
            title="Actualiser la base Supabase"
          >
            <RefreshCw className={`w-4 h-4 text-stone-500 ${isRefreshing ? 'animate-spin text-[#005C52]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── 2. Time Filter & Four Core Key Performance Indicators ─────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
              Indicateurs de Performance & Revalorisation
            </h2>
            <p className="text-xs text-stone-500">
              Chiffre d’affaires sauvé des rebuts, flux comptoir et suivi des dates courtes
            </p>
          </div>

          {/* Interactive Period Selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/80 text-xs font-medium">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'today' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Aujourd’hui
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'week' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              7 jours
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'month' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ce mois
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'all' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Global
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Chiffre d'Affaires Revalorisé */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">C.A. Revalorisé Net</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-[#005C52]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-stone-900 tabular-nums">
              {totalRevenue.toFixed(2)} €
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +18.4% vs M-1
              </span>
              <span className="text-stone-400">Reversement 48h</span>
            </div>
          </div>

          {/* KPI 2: Commandes en cours */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Commandes Comptoir</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-stone-900 tabular-nums">
              {activeOrdersCount}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
              <span className="text-blue-700 font-medium">À préparer / délivrer</span>
              <span className="text-stone-400">Délai moyen ~14 min</span>
            </div>
          </div>

          {/* KPI 3: Alertes DLC */}
          <div
            onClick={() => setCurrentTab('dlc')}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Alertes DLC Urgentes</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-600 tabular-nums">
              {urgentDlcCount}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
              <span className="text-amber-800 font-bold">Périssables sous 15 jours</span>
              <span className="text-[#005C52] font-semibold group-hover:underline">Traiter →</span>
            </div>
          </div>

          {/* KPI 4: Impact Écologique */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Bilan RSE Officine</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#005C52] tabular-nums">
              {totalCo2SavedKg} kg
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
              <span className="text-emerald-800 font-bold">{totalRescuedCount + 34} soins sauvés</span>
              <span className="text-stone-400">Zéro destruction</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Real-Time Counter Withdrawal Queue ──────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                File d'Attente Comptoir & Retraits en Direct
              </h2>
              <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-bold">
                {myOrders.length}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Préparez les colis, étiquetez avec le code <strong className="font-mono text-stone-700">#CC-XXXX</strong> et validez lors de la remise au patient.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Code #CC, patient, produit..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#005C52] w-52"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  orderFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setOrderFilter('to_prepare')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  orderFilter === 'to_prepare' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                À préparer
              </button>
              <button
                onClick={() => setOrderFilter('ready')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  orderFilter === 'ready' ? 'bg-emerald-100 text-[#005C52] shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Prêtes
              </button>
              <button
                onClick={() => setOrderFilter('completed')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  orderFilter === 'completed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Retirées
              </button>
            </div>
          </div>
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 space-y-2">
            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-semibold text-stone-700">Aucune commande ne correspond à ce filtre.</p>
            <p>Toutes les commandes reçues par votre officine apparaîtront ici en temps réel.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 sm:p-5 rounded-2xl border border-stone-200/90 hover:border-[#005C52]/50 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-extrabold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 text-sm">
                      {ord.pickupCode}
                    </span>

                    <span className="font-bold text-stone-900 text-sm">{ord.clientName}</span>

                    <span className="text-stone-400 font-mono">({ord.clientPhone || '06 12 34 56 78'})</span>

                    <span className="text-stone-300">·</span>

                    <span className="text-stone-400">
                      {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* Status badge */}
                    {ord.status === 'new' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                        Nouvelle commande
                      </span>
                    )}
                    {ord.status === 'preparing' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
                        En préparation
                      </span>
                    )}
                    {ord.status === 'ready' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                        Prête au comptoir
                      </span>
                    )}
                    {ord.status === 'completed' && (
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Retirée {ord.pickedUpAt ? `(${new Date(ord.pickedUpAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})` : ''}
                      </span>
                    )}
                  </div>

                  <div className="text-stone-700 flex flex-wrap items-center gap-2">
                    {ord.items.map((i) => (
                      <span key={i.id} className="bg-stone-50 border border-stone-200 px-2 py-1 rounded-md text-[11px]">
                        <strong className="text-stone-900">{i.qty}x</strong> {i.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-stone-400 text-[11px]">
                    <span>Montant réglé : <strong className="text-stone-900 font-mono text-xs">{ord.total.toFixed(2)} €</strong></span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">Économie anti-gaspi : {ord.savingsTotal?.toFixed(2) || '8.50'} €</span>
                    {ord.notes && (
                      <>
                        <span>·</span>
                        <span className="text-amber-800 italic bg-amber-50 px-2 py-0.5 rounded">
                          Note client : "{ord.notes}"
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status action control */}
                <div className="flex items-center gap-2 shrink-0">
                  {ord.status === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'preparing')}
                      className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs transition-colors"
                    >
                      Mettre en préparation
                    </button>
                  )}

                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Prête au comptoir !</span>
                    </button>
                  )}

                  {ord.status === 'ready' && (
                    <button
                      onClick={() => setActiveModal('validation-retrait')}
                      className="px-4 py-2 bg-[#005C52] hover:bg-[#00443D] text-white rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FFC940]" />
                      <span>Valider Retrait ({ord.pickupCode})</span>
                    </button>
                  )}

                  {ord.status === 'completed' && (
                    <div className="text-stone-400 text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Délivrée par {ord.pickedUpBy || 'Officine'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 4. Urgent DLC Matrix & Immediate Repricing Actions ─────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                Surveillance des Dates Courtes & Démarque Directe
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Appliquez en un clic une remise réglementaire incitative pour écouler vos stocks avant péremption.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('dlc')}
            className="text-xs font-semibold text-[#005C52] hover:underline flex items-center gap-1"
          >
            <span>Toutes les alertes officine ({dlcAlerts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {dlcAlerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl">
            Aucune alerte de péremption critique en attente. Vos stocks sont à jour.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dlcAlerts.slice(0, 6).map((alert) => {
              const prod = products.find((p) => p.id === alert.productId);
              if (!prod) return null;

              return (
                <div
                  key={alert.id}
                  className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 overflow-hidden shrink-0">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase text-stone-400">{prod.laboName}</span>
                        <span
                          className={`px-2 py-0.2 rounded font-extrabold text-[10px] ${
                            alert.alertType === 'J-3'
                              ? 'bg-red-100 text-red-800'
                              : alert.alertType === 'J-7'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {alert.alertType} ({alert.daysRemaining}j)
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 truncate" title={prod.name}>
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono">
                        DLC : <strong className="text-stone-800">{prod.dlcDate}</strong> · Stock : {prod.stock} ex.
                      </p>
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <div>
                      <span className="text-stone-400 line-through text-[11px]">{prod.originalPrice.toFixed(2)} €</span>{' '}
                      <span className="font-bold text-stone-900 font-mono text-sm">{prod.price.toFixed(2)} €</span>
                    </div>

                    {/* Instant Remise buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          applyDiscountToProduct(prod.id, 50);
                          resolveDlcAlert(alert.id);
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-emerald-50 text-[#005C52] border border-stone-200 font-bold text-[10px] transition-colors"
                        title="Appliquer -50%"
                      >
                        -50%
                      </button>
                      <button
                        onClick={() => {
                          applyDiscountToProduct(prod.id, 60);
                          resolveDlcAlert(alert.id);
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-emerald-50 text-[#005C52] border border-stone-200 font-bold text-[10px] transition-colors"
                        title="Appliquer -60%"
                      >
                        -60%
                      </button>
                      <button
                        onClick={() => {
                          applyDiscountToProduct(prod.id, 70);
                          resolveDlcAlert(alert.id);
                        }}
                        className="px-2 py-1 rounded bg-[#005C52] hover:bg-[#00443D] text-white font-bold text-[10px] transition-colors shadow-xs"
                        title="Appliquer -70% Urgence"
                      >
                        -70%
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. Express CIP / EAN Parapharmacy Quick-Add & Analytics Grid ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Express Quick-Add Barcode Box */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#005C52] to-[#003B35] rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-[#005C52]/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Barcode className="w-5 h-5 text-[#FFC940]" />
              <h3 className="text-base font-bold font-['Plus_Jakarta_Sans']">
                Enregistrement Express Rayon
              </h3>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Un soin en rayon arrive à échéance ? Choisissez un produit type, ajustez la remise et publiez-le instantanément sur CareCycle.
            </p>
          </div>

          <form onSubmit={handleQuickAddProduct} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-emerald-200 font-medium mb-1">
                Produit Parapharmacie Fréquent
              </label>
              <select
                value={quickProductPreset}
                onChange={(e) => setQuickProductPreset(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:bg-[#003B35]"
              >
                <option value="avene_cicalfate" className="text-stone-900">Avène Cicalfate+ 40ml (11.90 €)</option>
                <option value="laroche_anthelios" className="text-stone-900">La Roche-Posay Anthelios SPF50+ (17.50 €)</option>
                <option value="nuxe_huile" className="text-stone-900">Nuxe Huile Prodigieuse 50ml (16.90 €)</option>
                <option value="bioderma_crealine" className="text-stone-900">Bioderma Créaline H2O 500ml (12.90 €)</option>
                <option value="klorane_shampoing" className="text-stone-900">Klorane Shampoing Avoine 400ml (9.80 €)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-emerald-200 font-medium mb-1">Remise anti-gaspi</label>
                <select
                  value={quickDiscount}
                  onChange={(e) => setQuickDiscount(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:bg-[#003B35]"
                >
                  <option value="40" className="text-stone-900">-40%</option>
                  <option value="50" className="text-stone-900">-50%</option>
                  <option value="60" className="text-stone-900">-60%</option>
                  <option value="70" className="text-stone-900">-70%</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">Stock disponible</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quickStock}
                  onChange={(e) => setQuickStock(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-200 font-medium mb-1">
                Échéance DLC restante
              </label>
              <select
                value={quickDlcDays}
                onChange={(e) => setQuickDlcDays(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:bg-[#003B35]"
              >
                <option value="3" className="text-stone-900">J-3 (Périssable immédiat)</option>
                <option value="7" className="text-stone-900">J-7 (Urgence une semaine)</option>
                <option value="14" className="text-stone-900">J-14 (Date courte standard)</option>
                <option value="30" className="text-stone-900">J-30 (1 mois)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#FFC940] hover:bg-[#E5B536] text-stone-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publier immédiatement au catalogue</span>
            </button>
          </form>
        </div>

        {/* Category Revalorization Progress */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                Répartition des Stocks par Rayon Parapharmaceutique
              </h3>
              <p className="text-xs text-stone-500">
                Volume d'invendus sauvés et valeur valorisée par segment
              </p>
            </div>
            <span className="text-xs font-semibold text-[#005C52]">
              {myProducts.length} références actives
            </span>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat, idx) => {
              const maxVal = Math.max(...categoryStats.map((c) => c.totalValue), 1);
              const pct = Math.min(100, Math.round((cat.totalValue / maxVal) * 100));

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">{cat.label}</span>
                    <span className="text-stone-500 font-mono">
                      {cat.count} articles · <strong className="text-stone-900">{cat.totalValue.toFixed(2)} €</strong>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#005C52] to-[#00897B] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Counter Trust and Customer Reviews */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-stone-900">4.9 / 5</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500">{myReviews.length > 0 ? `${myReviews.length} avis patients vérifiés` : 'Avis officine excellents'}</span>
            </div>

            <button
              onClick={() => setCurrentTab('reviews')}
              className="text-[#005C52] hover:underline font-bold flex items-center gap-1"
            >
              <span>Consulter les retours comptoir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
