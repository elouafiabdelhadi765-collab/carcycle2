import { Colors } from '../theme/carecycle';

// Source unique pour le libelle et la couleur d'un statut de commande —
// utilisee par tous les ecrans commercant qui affichent un badge de statut
// (liste, detail, feuille de detail). Reste sur les 3 couleurs du systeme
// (primary/danger + un bleu neutre pour "en cours") plutot que d'inventer
// une palette par ecran : voir regle "pas de couleur hors palette" du
// theme carecycle.ts.
export const ORDER_STATUS = {
  new:       { label: 'Nouvelle',       color: Colors.primary },
  preparing: { label: 'En préparation', color: '#4A8FE0' },
  ready:     { label: 'Prête',          color: Colors.primary },
  completed: { label: 'Terminée',       color: Colors.primary },
  cancelled: { label: 'Annulée',        color: Colors.danger },
};

// bg : teinte alpha de la couleur de statut, convention deja utilisee partout
// dans l'app pour les badges (color + '18').
export function getOrderStatus(status) {
  const entry = ORDER_STATUS[status] ?? { label: status, color: Colors.textSecondary };
  return { ...entry, bg: entry.color + '18' };
}
