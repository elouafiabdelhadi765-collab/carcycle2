// ─── CareCycle Design Tokens — source de vérité unique ─────────────────────
// Identité bicolore extraite du logo texte de l'accueil (AccueilClient.jsx) :
// "Care" = primary (vert profond), "Cycle" = accent (jaune/or).
//
// RÈGLES D'USAGE :
// - primary  : couleur DOMINANTE — boutons primaires, navbar/tab actif, titres
//   forts, headers, éléments de marque, fonds sombres (primaryDark).
// - accent   : couleur d'ACCENTUATION UNIQUEMENT — badges de réduction/%,
//   highlights ("Dernière chance"), étoiles d'avis, gamification (impact,
//   économies), micro-accents. JAMAIS en grande surface (pas de fond plein
//   écran, pas de gros bouton plein). JAMAIS en texte sur fond clair/crème
//   (contraste insuffisant, échoue AA) — uniquement sur fond vert foncé
//   (primary/primaryDark) ou en fond de badge avec texte foncé dessus.
// - success  : DÉRIVÉ de primary (le vert EST la couleur de succès du produit).
// - warning  : DÉRIVÉ de accent (le jaune EST la couleur d'alerte/urgence).
// - danger   : seule 3e couleur vive tolérée (rouge), car sémantiquement
//   indispensable et jamais utilisée comme couleur de marque.
// - Zéro autre couleur vive dans l'app. Tout écran qui a besoin d'une couleur
//   doit piocher dans ce fichier, jamais définir son propre hex local.

import type { TextStyle, ViewStyle } from 'react-native';

// ── Familles Inter ────────────────────────────────────────────────────────────
export const Font = {
  regular:   'Inter_400Regular',
  medium:    'Inter_500Medium',
  semibold:  'Inter_600SemiBold',
  bold:      'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

// ── Couleurs ──────────────────────────────────────────────────────────────────
export const Colors = {
  // ── Marque (source de vérité = logo accueil) ────────────────────────────────
  primary:       '#005C52',   // vert profond — "Care" du logo
  primaryDark:   '#00443D',   // fonds sombres (écrans succès, overlays scanner)
  primaryLight:  '#E0F0E4',   // fonds pastel, chips, icônes légères sur fond clair
  accent:        '#FFC940',   // jaune/or — "Cycle" du logo. Accent UNIQUEMENT, voir règles ci-dessus.
  accentLight:   '#FFF5D6',   // fond de badge (texte foncé dessus, jamais l'inverse)

  // ── Neutres ───────────────────────────────────────────────────────────────
  bg:            '#FAF7F2',   // fond app crème chaud
  surface:       '#FFFFFF',
  textPrimary:   '#1E2A28',
  textSecondary: '#6B7573',
  textDisabled:  '#B8B4AD',
  textOnPrimary: '#FFFFFF',
  textOnPrimaryMuted: 'rgba(255,255,255,0.68)',
  placeholder:   '#B8B4AD',   // = textDisabled, alias sémantique pour les inputs
  border:        '#ECE7DF',
  overlay:       'rgba(0,0,0,0.45)',

  // ── Sémantiques dérivées (pas de couleur vive indépendante) ────────────────
  success:       '#005C52',   // = primary
  successLight:  '#E0F0E4',   // = primaryLight
  warning:       '#FFC940',   // = accent
  warningLight:  '#FFF5D6',   // = accentLight
  danger:        '#D9534F',   // seule 3e couleur vive tolérée (voir note en tête de fichier)
  dangerLight:   '#FDE8E4',

  // ── Aliases legacy (backward-compat pour fichiers non encore migrés) ───────
  forest:        '#005C52',
  forestDark:    '#00443D',
  forestLight:   '#E0F0E4',
  gold:          '#FFC940',
  goldLight:     '#FFF5D6',
  background:    '#FAF7F2',
  text:          '#1E2A28',
  textSecond:    '#6B7573',
  textOnDark:    '#FFFFFF',
  borderFocus:   '#005C52',
  successBorder: '#A3D4B8',
  warningBorder: '#FCE29B',
  dangerBorder:  '#F2A5A5',
  neutral:       '#6B7280',
  neutralLight:  '#F3F4F6',
  neutralBorder: '#D1D5DB',
  dlcUrgent:     '#D9534F',   // = danger
  dlcWarning:    '#FFC940',   // = accent/warning
  dlcYellow:     '#FFC940',   // = accent/warning
} as const;

// ── Espacements ───────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  s:  8,  sm: 8,
  m:  12, md: 12,
  l:  16, lg: 16,
  xl: 24,
  xxl:32,
} as const;

// ── Rayons ────────────────────────────────────────────────────────────────────
export const Radius = {
  s:  8,  sm: 8,
  m:  12, md: 12,
  l:  16, lg: 16,
  xl: 20,
  xxl:24,
  pill: 999,
} as const;

// ── Échelle typographique (Inter) ─────────────────────────────────────────────
export const Type = {
  display:  { fontFamily: Font.extrabold, fontSize: 28, lineHeight: 34, color: Colors.textPrimary } satisfies TextStyle,
  h1:       { fontFamily: Font.extrabold, fontSize: 22, lineHeight: 28, color: Colors.textPrimary } satisfies TextStyle,
  h2:       { fontFamily: Font.bold,      fontSize: 18, lineHeight: 24, color: Colors.textPrimary } satisfies TextStyle,
  body:     { fontFamily: Font.regular,   fontSize: 15, lineHeight: 22, color: Colors.textPrimary } satisfies TextStyle,
  bodyBold: { fontFamily: Font.semibold,  fontSize: 15, lineHeight: 22, color: Colors.textPrimary } satisfies TextStyle,
  caption:  { fontFamily: Font.medium,    fontSize: 13, lineHeight: 18, color: Colors.textSecondary } satisfies TextStyle,
  tiny:     { fontFamily: Font.medium,    fontSize: 11, lineHeight: 14, color: Colors.textSecondary } satisfies TextStyle,
  price:    { fontFamily: Font.extrabold, fontSize: 18, lineHeight: 22, color: Colors.primary } satisfies TextStyle,
} as const;

// ── Typography (alias legacy, maintenant sur Inter) ───────────────────────────
export const Typography = {
  h1: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28, lineHeight: 36, color: Colors.textPrimary,
  } satisfies TextStyle,
  h2: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22, lineHeight: 30, color: Colors.textPrimary,
  } satisfies TextStyle,
  h3: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18, lineHeight: 26, color: Colors.textPrimary,
  } satisfies TextStyle,
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15, lineHeight: 22, color: Colors.textPrimary,
  } satisfies TextStyle,
  bodySemiBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15, lineHeight: 22, color: Colors.textPrimary,
  } satisfies TextStyle,
  bodyBold: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15, lineHeight: 22, color: Colors.textPrimary,
  } satisfies TextStyle,
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13, lineHeight: 18, color: Colors.textPrimary,
  } satisfies TextStyle,
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11, lineHeight: 16, color: Colors.textSecondary,
  } satisfies TextStyle,
} as const;

// ── Élévation (style contours, ombres réservées au flottant) ─────────────────
// none     : aucune séparation — fonds identiques, contraste par l'espace seul.
// subtle   : bordure fine 1px quasi-invisible — remplace l'ombre de carte par
//            défaut (style Apple/Linear/Stripe). C'est le cas d'usage normal
//            pour toute carte/liste posée sur le fond app.
// floating : ombre douce, réservée aux éléments qui flottent VRAIMENT
//            au-dessus du contenu (badge panier, FAB, modales, bottom sheets).
//            Jamais sur une carte simplement posée dans une liste.
export const Elevation = {
  none: {} satisfies ViewStyle,
  subtle: {
    borderWidth: 1,
    borderColor: 'rgba(30,42,40,0.07)',
  } satisfies ViewStyle,
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  } satisfies ViewStyle,
} as const;

// ── Ombres (legacy — préférer Elevation ci-dessus pour tout nouveau code) ─────
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } satisfies ViewStyle,
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  } satisfies ViewStyle,
  fab: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  } satisfies ViewStyle,
  button: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  } satisfies ViewStyle,
} as const;
