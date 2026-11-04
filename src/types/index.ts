// ─── Shared primitives ────────────────────────────────────────────────────────
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type ProductType = 'parapharmacie' | 'cosmetique' | 'complement';

// Taxonomie produit CareCycle — parapharmacie/cosmétique uniquement (hors médicaments sur ordonnance)
export type ProductCategory =
  | 'soins_visage'
  | 'soins_corps'
  | 'capillaire'
  | 'hygiene_bain'
  | 'hygiene_buccodentaire'
  | 'bebe_maternite'
  | 'complements_alimentaires'
  | 'materiel_medical'
  | 'premiers_secours'
  | 'dermocosmetique'
  | 'protection_solaire';

export type EstablishmentType = 'pharmacie' | 'parapharmacie' | 'bio' | 'makeup';
export type DLCAlertType = 'J-15' | 'J-7' | 'J-3';

// ─── Shop hours ───────────────────────────────────────────────────────────────
export interface ShopHours {
  day: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  shopId: string;
  shopName?: string;
  name: string;
  description: string;
  price: number;               // Prix remisé anti-gaspillage
  originalPrice: number;       // Prix public conseillé
  stock: number;
  category: ProductCategory;
  image: string;
  available: boolean;
  promo: boolean;
  promoPrice?: number | null;
  promoEndDate?: string | null;
  // CareCycle — anti-gaspillage parapharmaceutique
  dlcDate: string;             // format DD/MM/YYYY ou YYYY-MM-DD
  dlcDaysLeft?: number;        // jours restants calculés
  lotNumber: string;           // Numéro de lot fabricant
  eanCode: string;             // Code barre EAN-13
  cipCode: string;             // Code CIP pharma (7 chiffres)
  laboName: string;            // Laboratoire (ex: Avène, La Roche-Posay, Caudalie)
  maxDiscountPct: number;      // remise max autorisée par le labo (0–100)
  productType: ProductType;
  isDlcShort: boolean;         // flag urgence DLC
}

// ─── Order item ───────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string | null;
  laboName?: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderCode: string;           // Ex: CC-9284
  pickupCode: string;          // Code court affiché au client (ex: CC-9284)
  status: OrderStatus;
  shopId: string;
  shopName: string;
  shopAvatarUrl?: string;
  shopAddress?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  total: number;
  originalTotal?: number;
  savingsTotal?: number;
  itemsCount: number;
  items: OrderItem[];
  createdAt: string;
  pickedUpAt?: string | null;
  pickedUpBy?: string | null;
  notes?: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

// ─── Shop info ────────────────────────────────────────────────────────────────
export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  instagram?: string;
  website?: string;
  hours: ShopHours[];
  closedToday: boolean;
  instructions: string;        // Instructions de retrait au comptoir
  coverUrl: string;
  avatarUrl: string;
  active: boolean;
  rating: number;
  reviewCount: number;
  distance?: number;           // en km
  lat: number;
  lng: number;
  // CareCycle identification
  rppsNumber: string;          // Numéro RPPS du pharmacien titulaire (11 chiffres)
  arsAgreement: string;        // Agrément Agence Régionale de Santé
  establishmentType: EstablishmentType;
  pharmacistName: string;      // Dr. en Pharmacie responsable
  adminValidated: boolean;
  bankIban?: string;
  bankBic?: string;
  qrCode?: string;
}

// ─── DLC Alert ────────────────────────────────────────────────────────────────
export interface DLCAlert {
  id: string;
  shopId: string;
  productId: string;
  productName: string;
  laboName: string;
  dlcDate: string;
  daysRemaining: number;
  alertType: DLCAlertType;
  currentStock: number;
  price: number;
  originalPrice: number;
  currentDiscountPct: number;
  sentAt: string;
  acknowledged: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  shopId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: string | null;
  repliedAt?: string | null;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type UserRole = 'client' | 'merchant' | 'admin';

export interface AppNotification {
  id: string;
  recipientRole: UserRole;
  shopId?: string;
  type: 'order' | 'dlc' | 'review' | 'stock' | 'promo' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

// ─── Cart item ────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  shopId: string;
  shopName: string;
  shopAddress?: string;
  image: string;
  laboName?: string;
  dlcDate?: string;
  isDlcShort?: boolean;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: UserRole;
  shopId?: string | null;
  shopName?: string;
  rppsNumber?: string;
  avatarUrl?: string;
  ordersCount?: number;
  eurosSaved?: number;
  co2SavedKg?: number;
  productsRescued?: number;
}
