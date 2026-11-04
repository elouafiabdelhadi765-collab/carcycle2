// ─── Design system harmonisé — icônes (Lucide uniquement) ───
// Source unique pour la taille et l'épaisseur de trait des icônes. Ne
// jamais écrire size/strokeWidth en dur — passer par ces tokens.

export const IconSize = {
  inline: 16,   // a cote d'un libelle de champ, dans une ligne de texte
  standard: 20, // usage par defaut (header, boutons, lignes de liste)
  emphasis: 24, // mise en avant (KPI, actions principales)
  feature: 32,  // illustrative (carte produit, mise en avant ponctuelle)
  empty: 40,    // etats vides
} as const;

export type IconSizeKey = keyof typeof IconSize;

export const IconStroke = {
  default: 2,        // quasi toutes les icones
  illustration: 1.5, // exception : etats vides + placeholders image
} as const;

export type IconStrokeKey = keyof typeof IconStroke;
