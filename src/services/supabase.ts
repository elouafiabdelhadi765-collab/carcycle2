import { createClient } from '@supabase/supabase-js';
import type { Shop, Product, Order, Review, ProductCategory, OrderStatus } from '../types';

const env =
  typeof import.meta !== 'undefined' && (import.meta as any).env
    ? (import.meta as any).env
    : typeof process !== 'undefined' && process.env
    ? process.env
    : {};

export const SUPABASE_URL =
  env.VITE_SUPABASE_URL ||
  env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://nfdwkmzyzrixtchbnulp.supabase.co';

export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  env.EXPO_PUBLIC_SUPABASE_KEY ||
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_sjEY8pYX0uYyfqE7jnMyJQ_MsXWp6f6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ─── Authentication API ───────────────────────────────────────────────────────
export async function signInWithSupabase(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata: {
    fullName: string;
    role: 'client' | 'merchant';
    phone?: string;
    shopName?: string;
    rppsNumber?: string;
  }
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: metadata.fullName,
          role: metadata.role,
          phone: metadata.phone,
          shop_name: metadata.shopName,
          rpps_number: metadata.rppsNumber,
        },
      },
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function signOutFromSupabase() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

export async function getSupabaseUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    return data?.user || null;
  } catch {
    return null;
  }
}

// ─── Health / Ping check ──────────────────────────────────────────────────────
export async function pingSupabase(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = performance.now();
  try {
    const { error } = await supabase.from('shops').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);
    if (error) {
      return { ok: false, latencyMs, error: error.message };
    }
    return { ok: true, latencyMs };
  } catch (err: any) {
    return { ok: false, latencyMs: Math.round(performance.now() - start), error: err?.message || 'Erreur réseau' };
  }
}

// ─── Shops ────────────────────────────────────────────────────────────────────
export async function fetchShopsFromSupabase(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase.from('shops').select('*');
    if (error || !data || data.length === 0) return [];

    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      description: s.description || '',
      category: s.category || 'Pharmacie',
      address: s.address || '',
      city: 'Dijon',
      postalCode: '21000',
      phone: s.phone || '',
      email: s.email || '',
      hours: Array.isArray(s.hours) ? s.hours : [],
      closedToday: s.closed_today ?? false,
      instructions: s.instructions || 'Retrait au comptoir prioritaire.',
      coverUrl: s.cover_url || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80',
      avatarUrl: s.avatar_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=80',
      active: s.active ?? true,
      rating: 4.8,
      reviewCount: 42,
      lat: s.lat ?? 47.322,
      lng: s.lng ?? 5.041,
      rppsNumber: s.rpps_number || '10004928192',
      arsAgreement: s.ars_agreement || 'ARS-BFC-21-0492',
      establishmentType: s.establishment_type || 'pharmacie',
      pharmacistName: s.pharmacist_name || 'Dr. Pharmacien Titulaire',
      adminValidated: true,
      qrCode: s.qr_code,
    }));
  } catch {
    return [];
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) return [];

    return data.map((p: any) => ({
      id: p.id,
      shopId: p.shop_id,
      shopName: p.shop_name,
      name: p.name,
      description: p.description || '',
      price: Number(p.price) || 0,
      originalPrice: Number(p.original_price) || Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      category: (p.category as ProductCategory) || 'soins_visage',
      image: p.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      available: p.available ?? true,
      promo: p.is_promo ?? true,
      promoPrice: p.promo_price ? Number(p.promo_price) : null,
      dlcDate: p.dlc_date || '15/06/2026',
      dlcDaysLeft: p.dlc_days_left ?? 14,
      lotNumber: p.lot_number || 'LOT-2026',
      eanCode: p.ean_code || '',
      cipCode: p.cip_code || '',
      laboName: p.labo_name || 'Laboratoire Partenaire',
      maxDiscountPct: p.max_discount_pct || 60,
      productType: p.product_type || 'parapharmacie',
      isDlcShort: p.is_dlc_short ?? true,
    }));
  } catch {
    return [];
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  try {
    const { data, error } = await supabase.from('orders').select('*, order_items(*)');
    if (error || !data || data.length === 0) return [];

    return data.map((o: any) => ({
      id: o.id,
      orderCode: o.order_code || o.pickup_code || `CC-${o.id.slice(0, 4).toUpperCase()}`,
      pickupCode: o.pickup_code || `CC-${o.id.slice(0, 4).toUpperCase()}`,
      status: (o.status as OrderStatus) || 'new',
      shopId: o.shop_id,
      shopName: o.shop_name || 'Pharmacie',
      shopAddress: o.shop_address || 'Dijon',
      clientName: o.client_name || 'Client',
      clientPhone: o.client_phone || '',
      clientEmail: o.client_email,
      total: Number(o.total) || 0,
      itemsCount: Array.isArray(o.order_items) ? o.order_items.length : 1,
      items: (o.order_items || []).map((it: any) => ({
        id: it.id,
        productId: it.product_id,
        name: it.name || 'Soin anti-gaspillage',
        qty: it.qty || 1,
        price: Number(it.price) || 0,
        image: it.image || null,
        laboName: it.labo_name,
      })),
      createdAt: o.created_at || new Date().toISOString(),
      pickedUpAt: o.picked_up_at,
      pickedUpBy: o.picked_up_by,
      notes: o.notes,
      paymentStatus: o.payment_status || 'paid',
    }));
  } catch {
    return [];
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export async function fetchReviewsFromSupabase(): Promise<Review[]> {
  try {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error || !data || data.length === 0) return [];

    return data.map((r: any) => ({
      id: r.id,
      shopId: r.shop_id,
      clientName: r.client_name || 'Patient',
      rating: r.rating || 5,
      comment: r.comment || '',
      createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : 'Récemment',
      reply: r.reply,
      repliedAt: r.replied_at,
    }));
  } catch {
    return [];
  }
}

// ─── Mutations (Write to Supabase with non-blocking resilience) ───────────────
export async function createOrderInSupabase(order: Order): Promise<boolean> {
  try {
    const { error: orderError } = await supabase.from('orders').insert({
      id: order.id,
      order_code: order.orderCode,
      pickup_code: order.pickupCode,
      status: order.status,
      shop_id: order.shopId,
      client_name: order.clientName,
      client_phone: order.clientPhone,
      total: order.total,
      created_at: order.createdAt,
      payment_status: order.paymentStatus,
      notes: order.notes,
    });

    if (orderError) {
      console.warn('Supabase order insert notice (RLS or schema):', orderError.message);
      return false;
    }

    if (order.items && order.items.length > 0) {
      const itemsToInsert = order.items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
      }));
      await supabase.from('order_items').insert(itemsToInsert);
    }
    return true;
  } catch (err) {
    console.warn('createOrderInSupabase catch:', err);
    return false;
  }
}

export async function updateOrderStatusInSupabase(
  orderId: string,
  status: OrderStatus,
  pickedUpBy?: string
): Promise<boolean> {
  try {
    const updatePayload: Record<string, any> = { status };
    if (status === 'completed') {
      updatePayload.picked_up_at = new Date().toISOString();
      if (pickedUpBy) updatePayload.picked_up_by = pickedUpBy;
    }
    const { error } = await supabase.from('orders').update(updatePayload).eq('id', orderId);
    return !error;
  } catch {
    return false;
  }
}

export async function createProductInSupabase(product: Product): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').insert({
      id: product.id,
      shop_id: product.shopId,
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      stock: product.stock,
      category: product.category,
      image_url: product.image,
      available: product.available,
      is_promo: product.promo,
      dlc_date: product.dlcDate,
      lot_number: product.lotNumber,
      ean_code: product.eanCode,
      cip_code: product.cipCode,
      labo_name: product.laboName,
      max_discount_pct: product.maxDiscountPct,
      product_type: product.productType,
      is_dlc_short: product.isDlcShort,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function updateProductInSupabase(productId: string, changes: Partial<Product>): Promise<boolean> {
  try {
    const payload: Record<string, any> = {};
    if (changes.name !== undefined) payload.name = changes.name;
    if (changes.price !== undefined) payload.price = changes.price;
    if (changes.stock !== undefined) payload.stock = changes.stock;
    if (changes.available !== undefined) payload.available = changes.available;
    if (changes.dlcDate !== undefined) payload.dlc_date = changes.dlcDate;

    const { error } = await supabase.from('products').update(payload).eq('id', productId);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteProductInSupabase(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    return !error;
  } catch {
    return false;
  }
}

export async function createReviewInSupabase(review: Review): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').insert({
      id: review.id,
      shop_id: review.shopId,
      client_name: review.clientName,
      rating: review.rating,
      comment: review.comment,
    });
    return !error;
  } catch {
    return false;
  }
}

// ─── Developer & Admin Inspector APIs ─────────────────────────────────────────
export async function fetchRawTable(tableName: string, limit = 50): Promise<{ data: any[] | null; error?: string }> {
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(limit);
    if (error) return { data: null, error: error.message };
    return { data: data || [] };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Erreur requête table' };
  }
}

export async function getTableStats(): Promise<Record<string, { count: number; error?: string }>> {
  const tables = ['shops', 'products', 'orders', 'reviews', 'notifications'];
  const results: Record<string, { count: number; error?: string }> = {};

  await Promise.all(
    tables.map(async (table) => {
      try {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
          results[table] = { count: 0, error: error.message };
        } else {
          results[table] = { count: count ?? 0 };
        }
      } catch (err: any) {
        results[table] = { count: 0, error: err?.message };
      }
    })
  );

  return results;
}

export async function seedInitialDataToSupabase(
  shops: Shop[],
  products: Product[],
  reviews: Review[]
): Promise<{ success: boolean; shopsCount: number; productsCount: number; errors: string[] }> {
  const errors: string[] = [];
  let sCount = 0;
  let pCount = 0;

  // Insert shops
  for (const s of shops) {
    try {
      const { error } = await supabase.from('shops').upsert({
        id: s.id,
        name: s.name,
        description: s.description,
        category: s.category,
        address: s.address,
        phone: s.phone,
        email: s.email,
        hours: s.hours,
        closed_today: s.closedToday,
        instructions: s.instructions,
        cover_url: s.coverUrl,
        avatar_url: s.avatarUrl,
        active: s.active,
        rpps_number: s.rppsNumber,
        ars_agreement: s.arsAgreement,
        establishment_type: s.establishmentType,
        pharmacist_name: s.pharmacistName,
      });
      if (error) errors.push(`Shop ${s.name}: ${error.message}`);
      else sCount++;
    } catch (e: any) {
      errors.push(`Shop ${s.name}: ${e?.message}`);
    }
  }

  // Insert products
  for (const p of products) {
    try {
      const { error } = await supabase.from('products').upsert({
        id: p.id,
        shop_id: p.shopId,
        name: p.name,
        description: p.description,
        price: p.price,
        original_price: p.originalPrice,
        stock: p.stock,
        category: p.category,
        image_url: p.image,
        available: p.available,
        is_promo: p.promo,
        dlc_date: p.dlcDate,
        lot_number: p.lotNumber,
        ean_code: p.eanCode,
        cip_code: p.cipCode,
        labo_name: p.laboName,
        max_discount_pct: p.maxDiscountPct,
        product_type: p.productType,
        is_dlc_short: p.isDlcShort,
      });
      if (error) errors.push(`Product ${p.name}: ${error.message}`);
      else pCount++;
    } catch (e: any) {
      errors.push(`Product ${p.name}: ${e?.message}`);
    }
  }

  return {
    success: errors.length === 0,
    shopsCount: sCount,
    productsCount: pCount,
    errors,
  };
}
