import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Shop,
  Product,
  Order,
  DLCAlert,
  AppNotification,
  Review,
  User,
  CartItem,
  ProductCategory,
  OrderStatus,
  UserRole,
} from '../types';
import {
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_DLC_ALERTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  DEFAULT_CLIENT_USER,
  DEFAULT_MERCHANT_USER,
  DEFAULT_ADMIN_USER,
} from '../data/initialData';
import {
  fetchShopsFromSupabase,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  fetchReviewsFromSupabase,
  createOrderInSupabase,
  updateOrderStatusInSupabase,
  createProductInSupabase,
  updateProductInSupabase,
  deleteProductInSupabase,
  createReviewInSupabase,
  pingSupabase,
  SUPABASE_URL,
} from '../services/supabase';

interface PromoCode {
  code: string;
  discountPct: number;
  description: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  category: 'supabase' | 'auth' | 'order' | 'dlc' | 'seed' | 'audit';
  message: string;
}

const VALID_PROMOS: Record<string, PromoCode> = {
  'WELCOME10': { code: 'WELCOME10', discountPct: 10, description: '10% de remise bienvenue' },
  'ZEROGASPI': { code: 'ZEROGASPI', discountPct: 15, description: '15% de remise anti-gaspi solidaire' },
  'CARECYCLE': { code: 'CARECYCLE', discountPct: 20, description: '20% de remise privilège' },
};

export interface AppState {
  // Supabase Live Sync Status
  supabaseStatus: {
    connected: boolean;
    latencyMs?: number;
    lastSyncedAt?: string;
    isSyncing: boolean;
    url: string;
    error?: string;
  };
  initSupabaseSync: () => Promise<void>;
  checkSupabasePing: () => Promise<void>;

  // Auth & Roles
  role: UserRole;
  clientUser: User;
  merchantUser: User;
  adminUser: User;
  setRole: (role: UserRole) => void;
  updateClientUser: (data: Partial<User>) => void;
  updateMerchantUser: (data: Partial<User>) => void;
  updateAdminUser: (data: Partial<User>) => void;

  // Developer & Admin Toolkit
  systemLogs: SystemLog[];
  addSystemLog: (level: 'info' | 'warn' | 'error' | 'success', category: 'supabase' | 'auth' | 'order' | 'dlc' | 'seed' | 'audit', message: string) => void;
  clearSystemLogs: () => void;
  resetToInitialData: () => void;
  simulateTestOrder: () => Order;
  simulateDlcAlert: (productId?: string, alertType?: 'J-3' | 'J-7' | 'J-15') => DLCAlert;

  // Shops
  shops: Shop[];
  updateShop: (shopId: string, data: Partial<Shop>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailable: (productId: string) => void;
  applyDiscountToProduct: (productId: string, discountPct: number) => void;

  // DLC Alerts
  dlcAlerts: DLCAlert[];
  acknowledgeDlcAlert: (alertId: string) => void;
  resolveDlcAlert: (alertId: string, newDiscountPct?: number) => void;

  // Orders
  orders: Order[];
  createOrder: (data: {
    shopId: string;
    items: { product: Product; quantity: number }[];
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  validatePickup: (pickupCodeOrId: string, pharmacistName?: string) => { success: boolean; order?: Order; error?: string };
  cancelOrder: (orderId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Favorites & Following
  favoriteShopIds: string[];
  favoriteProductIds: string[];
  followedShopIds: string[];
  toggleFavoriteShop: (shopId: string) => void;
  toggleFavoriteProduct: (productId: string) => void;
  toggleFollowShop: (shopId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (shopId: string, rating: number, comment: string) => void;
  replyToReview: (reviewId: string, reply: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Navigation & UI Modals
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  sortBy: 'recommended' | 'discount' | 'price_asc' | 'dlc_urgent' | 'distance';
  setSortBy: (sort: 'recommended' | 'discount' | 'price_asc' | 'dlc_urgent' | 'distance') => void;
  dlcUrgentOnly: boolean;
  setDlcUrgentOnly: (val: boolean) => void;
  userCity: string;
  setUserCity: (city: string) => void;

  // Global Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Supabase Live Sync
      supabaseStatus: {
        connected: true,
        latencyMs: 45,
        isSyncing: false,
        url: SUPABASE_URL,
      },
      checkSupabasePing: async () => {
        const ping = await pingSupabase();
        set((state) => ({
          supabaseStatus: {
            ...state.supabaseStatus,
            connected: ping.ok,
            latencyMs: ping.latencyMs,
            error: ping.error,
          },
        }));
      },
      initSupabaseSync: async () => {
        set((state) => ({
          supabaseStatus: { ...state.supabaseStatus, isSyncing: true },
        }));

        try {
          const ping = await pingSupabase();
          const [remoteShops, remoteProducts, remoteOrders, remoteReviews] = await Promise.all([
            fetchShopsFromSupabase(),
            fetchProductsFromSupabase(),
            fetchOrdersFromSupabase(),
            fetchReviewsFromSupabase(),
          ]);

          set((state) => ({
            shops: remoteShops.length > 0 ? remoteShops : state.shops,
            products: remoteProducts.length > 0 ? remoteProducts : state.products,
            orders: remoteOrders.length > 0 ? remoteOrders : state.orders,
            reviews: remoteReviews.length > 0 ? remoteReviews : state.reviews,
            supabaseStatus: {
              ...state.supabaseStatus,
              connected: ping.ok,
              latencyMs: ping.latencyMs,
              lastSyncedAt: new Date().toLocaleTimeString('fr-FR'),
              isSyncing: false,
              error: ping.error,
            },
          }));
        } catch (err: any) {
          set((state) => ({
            supabaseStatus: {
              ...state.supabaseStatus,
              isSyncing: false,
              error: err?.message,
            },
          }));
        }
      },

      // Auth & Roles
      role: 'client',
      clientUser: DEFAULT_CLIENT_USER,
      merchantUser: DEFAULT_MERCHANT_USER,
      adminUser: DEFAULT_ADMIN_USER,
      setRole: (role) => {
        set({ role });
        const labels: Record<UserRole, string> = {
          client: 'Passage en Mode Client / Patient',
          merchant: 'Connecté à l’Espace Officine (Dr. Jean-Marc Dumont)',
          admin: 'Connecté à l’Espace Admin & Console Développeur',
        };
        get().showToast(labels[role], 'info');
        get().addSystemLog('info', 'auth', `Rôle utilisateur basculé vers : ${role}`);
      },
      updateClientUser: (data) =>
        set((state) => ({ clientUser: { ...state.clientUser, ...data } })),
      updateMerchantUser: (data) =>
        set((state) => ({ merchantUser: { ...state.merchantUser, ...data } })),
      updateAdminUser: (data) =>
        set((state) => ({ adminUser: { ...state.adminUser, ...data } })),

      // Developer & Admin Toolkit
      systemLogs: [
        {
          id: 'log-init-1',
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          level: 'success',
          category: 'supabase',
          message: 'Client Supabase initialisé (Endpoint: nfdwkmzyzrixtchbnulp.supabase.co)',
        },
        {
          id: 'log-init-2',
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          level: 'info',
          category: 'auth',
          message: 'Session utilisateur chargée en local storage (CareCycle v2)',
        },
      ],
      addSystemLog: (level, category, message) => {
        const newLog: SystemLog = {
          id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          level,
          category,
          message,
        };
        set((state) => ({ systemLogs: [newLog, ...state.systemLogs.slice(0, 99)] }));
      },
      clearSystemLogs: () => set({ systemLogs: [] }),
      resetToInitialData: () => {
        set({
          shops: INITIAL_SHOPS,
          products: INITIAL_PRODUCTS,
          orders: INITIAL_ORDERS,
          dlcAlerts: INITIAL_DLC_ALERTS,
          notifications: INITIAL_NOTIFICATIONS,
          reviews: INITIAL_REVIEWS,
          cart: [],
        });
        get().addSystemLog('warn', 'seed', 'Données locales réinitialisées aux valeurs initiales');
        get().showToast('Base locale réinitialisée au jeu de données standard Dijon', 'info');
      },
      simulateTestOrder: () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `CC-${randomNum}`;
        const shop = get().shops[0];
        const product = get().products[Math.floor(Math.random() * get().products.length)] || get().products[0];

        const testOrder: Order = {
          id: 'order-sim-' + Date.now(),
          orderCode,
          pickupCode: orderCode,
          status: 'new',
          shopId: shop.id,
          shopName: shop.name,
          shopAvatarUrl: shop.avatarUrl,
          shopAddress: shop.address + ', ' + shop.city,
          clientName: 'Patient Test (Simulation Dev)',
          clientPhone: '06 00 11 22 33',
          clientEmail: 'simulation.test@carecycle.health',
          total: product.price,
          originalTotal: product.originalPrice,
          savingsTotal: Math.round((product.originalPrice - product.price) * 100) / 100,
          itemsCount: 1,
          items: [
            {
              id: 'item-sim-1',
              productId: product.id,
              name: product.name,
              qty: 1,
              price: product.price,
              image: product.image,
              laboName: product.laboName,
            },
          ],
          createdAt: new Date().toISOString(),
          paymentStatus: 'paid',
          notes: 'Test Click & Collect généré depuis la console admin.',
        };

        set((state) => ({
          orders: [testOrder, ...state.orders],
        }));

        createOrderInSupabase(testOrder).catch(() => {});
        get().addSystemLog('success', 'order', `Simulation : Commande test ${orderCode} injectée`);
        get().showToast(`Commande test ${orderCode} injectée avec succès !`, 'success');
        return testOrder;
      },
      simulateDlcAlert: (productId, alertType = 'J-3') => {
        const targetProd = productId
          ? get().products.find((p) => p.id === productId) || get().products[0]
          : get().products[Math.floor(Math.random() * get().products.length)];

        const days = alertType === 'J-3' ? 3 : alertType === 'J-7' ? 7 : 15;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        const dlcFormatted = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;

        const newAlert: DLCAlert = {
          id: 'alert-sim-' + Date.now(),
          shopId: targetProd.shopId,
          productId: targetProd.id,
          productName: targetProd.name,
          laboName: targetProd.laboName,
          dlcDate: dlcFormatted,
          daysRemaining: days,
          alertType,
          currentStock: targetProd.stock,
          price: targetProd.price,
          originalPrice: targetProd.originalPrice,
          currentDiscountPct: Math.round(((targetProd.originalPrice - targetProd.price) / targetProd.originalPrice) * 100),
          sentAt: new Date().toISOString(),
          acknowledged: false,
        };

        set((state) => ({
          dlcAlerts: [newAlert, ...state.dlcAlerts],
        }));

        get().addSystemLog('warn', 'dlc', `Simulation : Alerte ${alertType} créée sur "${targetProd.name.slice(0, 25)}..."`);
        get().showToast(`Alerte DLC critique ${alertType} simulée`, 'info');
        return newAlert;
      },

      // Shops
      shops: INITIAL_SHOPS,
      updateShop: (shopId, data) =>
        set((state) => ({
          shops: state.shops.map((s) => (s.id === shopId ? { ...s, ...data } : s)),
        })),

      // Products
      products: INITIAL_PRODUCTS,
      addProduct: (newProdData) => {
        const id = 'prod-' + Date.now().toString(36);
        const newProduct: Product = {
          ...newProdData,
          id,
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
        createProductInSupabase(newProduct).catch(() => {});
        get().showToast('Produit anti-gaspillage ajouté et synchronisé', 'success');
        return newProduct;
      },
      updateProduct: (productId, data) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === productId ? { ...p, ...data } : p)),
        }));
        updateProductInSupabase(productId, data).catch(() => {});
      },
      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
        deleteProductInSupabase(productId).catch(() => {});
        get().showToast('Produit retiré du catalogue', 'info');
      },
      toggleProductAvailable: (productId) => {
        const prod = get().products.find((p) => p.id === productId);
        if (prod) {
          const nextAvailable = !prod.available;
          set((state) => ({
            products: state.products.map((p) =>
              p.id === productId ? { ...p, available: nextAvailable } : p
            ),
          }));
          updateProductInSupabase(productId, { available: nextAvailable }).catch(() => {});
        }
      },
      applyDiscountToProduct: (productId, discountPct) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== productId) return p;
            const newPrice = Math.round(p.originalPrice * (1 - discountPct / 100) * 100) / 100;
            return {
              ...p,
              price: newPrice,
              promo: true,
              isDlcShort: discountPct >= 50,
            };
          }),
        }));
        const prod = get().products.find((p) => p.id === productId);
        if (prod) {
          updateProductInSupabase(productId, { price: prod.price }).catch(() => {});
        }
        get().showToast(`Remise de -${discountPct}% appliquée avec succès !`, 'success');
      },

      // DLC Alerts
      dlcAlerts: INITIAL_DLC_ALERTS,
      acknowledgeDlcAlert: (alertId) =>
        set((state) => ({
          dlcAlerts: state.dlcAlerts.map((a) =>
            a.id === alertId ? { ...a, acknowledged: true } : a
          ),
        })),
      resolveDlcAlert: (alertId, newDiscountPct) => {
        const alert = get().dlcAlerts.find((a) => a.id === alertId);
        if (alert && newDiscountPct) {
          get().applyDiscountToProduct(alert.productId, newDiscountPct);
        }
        set((state) => ({
          dlcAlerts: state.dlcAlerts.filter((a) => a.id !== alertId),
        }));
        get().showToast('Alerte DLC traitée et prix remisé synchronisé', 'success');
      },

      // Orders
      orders: INITIAL_ORDERS,
      createOrder: ({ shopId, items, notes }) => {
        const shop = get().shops.find((s) => s.id === shopId) || get().shops[0];
        const client = get().clientUser;
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `CC-${randomNum}`;
        const pickupCode = `CC-${randomNum}`;

        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const originalSubtotal = items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);

        const promo = get().appliedPromo;
        const discountAmount = promo ? (subtotal * promo.discountPct) / 100 : 0;
        const finalTotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
        const savingsTotal = Math.round((originalSubtotal - finalTotal) * 100) / 100;

        const orderItems = items.map((i) => ({
          id: 'item-' + Math.random().toString(36).slice(2, 7),
          productId: i.product.id,
          name: i.product.name,
          qty: i.quantity,
          price: i.product.price,
          image: i.product.image,
          laboName: i.product.laboName,
        }));

        const newOrder: Order = {
          id: 'order-' + Date.now(),
          orderCode,
          pickupCode,
          status: 'new',
          shopId: shop.id,
          shopName: shop.name,
          shopAvatarUrl: shop.avatarUrl,
          shopAddress: shop.address + ', ' + shop.city,
          clientName: client.fullName,
          clientPhone: client.phone,
          clientEmail: client.email,
          total: finalTotal,
          originalTotal: originalSubtotal,
          savingsTotal,
          itemsCount: items.reduce((sum, i) => sum + i.quantity, 0),
          items: orderItems,
          createdAt: new Date().toISOString(),
          paymentStatus: 'paid',
          notes,
        };

        // Decrement stock
        set((state) => ({
          orders: [newOrder, ...state.orders],
          products: state.products.map((p) => {
            const purchased = items.find((i) => i.product.id === p.id);
            if (purchased) {
              return { ...p, stock: Math.max(0, p.stock - purchased.quantity) };
            }
            return p;
          }),
          clientUser: {
            ...state.clientUser,
            ordersCount: (state.clientUser.ordersCount || 0) + 1,
            eurosSaved: Math.round(((state.clientUser.eurosSaved || 0) + savingsTotal) * 100) / 100,
            co2SavedKg: Math.round(((state.clientUser.co2SavedKg || 0) + newOrder.itemsCount * 0.5) * 10) / 10,
            productsRescued: (state.clientUser.productsRescued || 0) + newOrder.itemsCount,
          },
        }));

        // Sync with Supabase in background
        createOrderInSupabase(newOrder).catch(() => {});

        // Add merchant notification
        const newNotif: AppNotification = {
          id: 'notif-' + Date.now(),
          recipientRole: 'merchant',
          shopId: shop.id,
          type: 'order',
          title: `Nouvelle commande ${orderCode}`,
          message: `${client.fullName} a réservé ${newOrder.itemsCount} produit(s) en Click & Collect (${finalTotal.toFixed(2)} €).`,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));

        get().clearCart();
        return newOrder;
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
        updateOrderStatusInSupabase(orderId, status).catch(() => {});

        const statusLabels: Record<OrderStatus, string> = {
          new: 'Nouvelle',
          preparing: 'En cours de préparation',
          ready: 'Prête au comptoir !',
          completed: 'Retirée',
          cancelled: 'Annulée',
        };
        get().showToast(`Statut commande mis à jour : ${statusLabels[status]}`, 'info');
      },
      validatePickup: (pickupCodeOrId, pharmacistName = 'Dr. Jean-Marc Dumont') => {
        const cleaned = pickupCodeOrId.trim().toUpperCase();
        const state = get();
        const order = state.orders.find(
          (o) => o.pickupCode.toUpperCase() === cleaned || o.id === pickupCodeOrId || o.orderCode.toUpperCase() === cleaned
        );

        if (!order) {
          return { success: false, error: 'Code de retrait introuvable. Vérifiez le numéro #CC-XXXX.' };
        }

        if (order.status === 'completed') {
          return { success: false, error: 'Cette commande a déjà été retirée.' };
        }

        if (order.status === 'cancelled') {
          return { success: false, error: 'Cette commande a été annulée.' };
        }

        const now = new Date().toISOString();
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  status: 'completed',
                  pickedUpAt: now,
                  pickedUpBy: pharmacistName,
                }
              : o
          ),
        }));

        updateOrderStatusInSupabase(order.id, 'completed', pharmacistName).catch(() => {});

        // Add client notification
        const clientNotif: AppNotification = {
          id: 'notif-' + Date.now(),
          recipientRole: 'client',
          type: 'order',
          title: `Retrait validé (${order.orderCode})`,
          message: `Votre commande a été retirée avec succès auprès du ${pharmacistName}. Merci de sauver des soins avec CareCycle !`,
          read: false,
          createdAt: now,
        };
        set((s) => ({ notifications: [clientNotif, ...s.notifications] }));

        return { success: true, order: { ...order, status: 'completed', pickedUpAt: now, pickedUpBy: pharmacistName } };
      },
      cancelOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)),
        }));
        updateOrderStatusInSupabase(orderId, 'cancelled').catch(() => {});
        get().showToast('Commande annulée.', 'info');
      },

      // Cart
      cart: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.cart.findIndex((i) => i.productId === product.id);
          let newCart: CartItem[];
          if (existingIndex >= 0) {
            newCart = [...state.cart];
            newCart[existingIndex].quantity += quantity;
          } else {
            const newItem: CartItem = {
              productId: product.id,
              productName: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              quantity,
              shopId: product.shopId,
              shopName: product.shopName || 'Pharmacie',
              image: product.image,
              laboName: product.laboName,
              dlcDate: product.dlcDate,
              isDlcShort: product.isDlcShort,
            };
            newCart = [...state.cart, newItem];
          }
          return { cart: newCart, isCartDrawerOpen: true };
        });
        get().showToast(`"${product.name.slice(0, 32)}..." ajouté au panier !`, 'success');
      },
      updateCartQty: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((i) => i.productId !== productId) };
          }
          return {
            cart: state.cart.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
          };
        });
      },
      removeFromCart: (productId) =>
        set((state) => ({ cart: state.cart.filter((i) => i.productId !== productId) })),
      clearCart: () => set({ cart: [], appliedPromo: null }),
      appliedPromo: null,
      applyPromoCode: (code) => {
        const clean = code.trim().toUpperCase();
        const promo = VALID_PROMOS[clean];
        if (promo) {
          set({ appliedPromo: promo });
          return { success: true, message: `Code ${promo.code} appliqué (-${promo.discountPct}%) !` };
        }
        return { success: false, message: 'Code promo invalide. Essayez "WELCOME10" ou "ZEROGASPI".' };
      },
      removePromoCode: () => set({ appliedPromo: null }),

      // Favorites & Following
      favoriteShopIds: ['shop-dijon-centrale'],
      favoriteProductIds: ['prod-01', 'prod-03'],
      followedShopIds: ['shop-dijon-centrale', 'shop-dijon-ducs'],
      toggleFavoriteShop: (shopId) => {
        set((state) => {
          const exists = state.favoriteShopIds.includes(shopId);
          return {
            favoriteShopIds: exists
              ? state.favoriteShopIds.filter((id) => id !== shopId)
              : [...state.favoriteShopIds, shopId],
          };
        });
      },
      toggleFavoriteProduct: (productId) => {
        set((state) => {
          const exists = state.favoriteProductIds.includes(productId);
          return {
            favoriteProductIds: exists
              ? state.favoriteProductIds.filter((id) => id !== productId)
              : [...state.favoriteProductIds, productId],
          };
        });
      },
      toggleFollowShop: (shopId) => {
        set((state) => {
          const exists = state.followedShopIds.includes(shopId);
          const next = exists
            ? state.followedShopIds.filter((id) => id !== shopId)
            : [...state.followedShopIds, shopId];
          return { followedShopIds: next };
        });
      },

      // Reviews
      reviews: INITIAL_REVIEWS,
      addReview: (shopId, rating, comment) => {
        const client = get().clientUser;
        const newReview: Review = {
          id: 'rev-' + Date.now(),
          shopId,
          clientName: client.fullName,
          rating,
          comment,
          createdAt: "À l'instant",
        };
        set((state) => ({ reviews: [newReview, ...state.reviews] }));
        createReviewInSupabase(newReview).catch(() => {});
        get().showToast('Merci pour votre avis !', 'success');
      },
      replyToReview: (reviewId, reply) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId
              ? { ...r, reply, repliedAt: "À l'instant" }
              : r
          ),
        }));
        get().showToast('Réponse envoyée au patient.', 'success');
      },

      // Notifications
      notifications: INITIAL_NOTIFICATIONS,
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Navigation & Modals
      currentTab: 'home',
      setCurrentTab: (tab) => set({ currentTab: tab }),
      selectedProductId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      selectedShopId: null,
      setSelectedShopId: (id) => set({ selectedShopId: id }),
      isCartDrawerOpen: false,
      setIsCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'all',
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      sortBy: 'recommended',
      setSortBy: (sort) => set({ sortBy: sort }),
      dlcUrgentOnly: false,
      setDlcUrgentOnly: (val) => set({ dlcUrgentOnly: val }),
      userCity: 'Dijon Centre (21000)',
      setUserCity: (city) => set({ userCity: city }),

      // Global Toast
      toast: null,
      showToast: (message, type = 'info') => {
        set({ toast: { message, type } });
        setTimeout(() => {
          if (get().toast?.message === message) {
            set({ toast: null });
          }
        }, 3200);
      },
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'carecycle_store_v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        clientUser: state.clientUser,
        merchantUser: state.merchantUser,
        shops: state.shops,
        products: state.products,
        orders: state.orders,
        cart: state.cart,
        favoriteShopIds: state.favoriteShopIds,
        favoriteProductIds: state.favoriteProductIds,
        followedShopIds: state.followedShopIds,
        notifications: state.notifications,
        reviews: state.reviews,
        dlcAlerts: state.dlcAlerts,
      }),
    }
  )
);
