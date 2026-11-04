import { ShoppingBag, Star, AlertTriangle, Bell } from 'lucide-react-native';
import { Colors } from '../theme/carecycle';

// Partagé entre l'aperçu notifications de l'accueil et l'écran complet, pour
// que les deux ne divergent jamais (icônes, couleurs, destination du tap).
const NOTIF_ICONS  = { order: ShoppingBag, review: Star, stock: AlertTriangle };
const NOTIF_COLORS = { order: Colors.accent, review: Colors.primary, stock: Colors.danger };

export function getNotificationIcon(type) {
  return NOTIF_ICONS[type] ?? Bell;
}

export function getNotificationColor(type) {
  return NOTIF_COLORS[type] ?? Colors.textSecondary;
}

// Ecran/params vers lesquels naviguer au tap sur une notification commerçant,
// selon son type. `products` (liste déjà chargée du store) permet, pour une
// alerte stock, d'ouvrir directement la fiche du produit concerné plutôt que
// la liste générale — sinon repli sur la liste. Retourne null si aucune
// destination pertinente.
export function getNotificationRoute(item, products = []) {
  switch (item.type) {
    case 'order':
      return item.relatedId ? { screen: 'DetailCommande', params: { orderId: item.relatedId } } : null;
    case 'review':
      return { screen: 'MerchantReviews' };
    case 'stock': {
      const product = item.relatedId ? products.find(p => p.id === item.relatedId) : null;
      return product
        ? { screen: 'GestionProduit', params: { mode: 'edit', product } }
        : { screen: 'MerchantProducts' };
    }
    default:
      return null;
  }
}
