/**
 * Format a numeric price to French locale string: "6,90 €"
 * Handles null/undefined safely.
 */
export function formatPrice(value) {
  if (value == null || isNaN(Number(value))) return '—';
  return Number(value).toFixed(2).replace('.', ',') + ' €';
}

/**
 * Format a discount percent badge: "-30%"
 * Returns null if no discount applies.
 */
export function formatDiscount(price, originalPrice) {
  if (!originalPrice || !price || originalPrice <= price) return null;
  const pct = Math.round((1 - price / originalPrice) * 100);
  return pct > 0 ? `-${pct}%` : null;
}

/**
 * Format an ISO date to "JJ/MM" (for DLC expiry on cards).
 */
export function formatDLC(iso) {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (m) return `${m[3]}/${m[2]}`;
  return iso;
}

/**
 * Format an ISO date to full "JJ/MM/AAAA".
 */
export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

/**
 * Format distance in meters to "120 m" or "1,2 km".
 */
export function formatDistance(km) {
  if (km == null) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace('.', ',')} km`;
}

/**
 * Haversine distance in km between two [lat, lng] pairs.
 */
export function haversineKm(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
