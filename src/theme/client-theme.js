/**
 * CareCycle — Design System CLIENT
 * Source de vérité : design-systeme/CLIENT-MASTER.md
 *
 * Usage dans un écran client :
 *   import { C, FONT, FONT_SIZE, SPACE, RADIUS, SHADOW, ICON, LAYOUT, TEXT } from '../../theme/client-theme';
 *
 * Règles absolues :
 *   1. Ne jamais utiliser fontWeight avec une fontFamily custom (le poids est dans le nom)
 *   2. shadowColor toujours '#1A332B' (forest) — jamais '#000'
 *   3. Les prix sont toujours en C.text (#1F2E27) Bold — jamais en gold
 *   4. Le fond global est C.cream (#FAF6EF) — jamais une couleur vive (sauf onboarding)
 */

// ─── COULEURS ─────────────────────────────────────────────────────────────────

export const C = {
  // ── Couleurs principales (brand) ──
  forest:      '#1A332B', // Vert forêt profond — fond onboarding, headers, CTA principaux, onglet actif
  forestDark:  '#122620', // Pressed state sur fond forest
  forestLight: '#E8F0EC', // Fond léger forest (placeholders, badges subtils)
  gold:        '#C9A35C', // Or/Moutarde — accents premium, étoiles, bouton "+", liens "Voir tout"
  goldDark:    '#A8854A', // Pressed state sur gold
  goldLight:   '#FBF5E8', // Fond léger gold (badges promo, encadrés dorés)

  // ── Neutres / fonds ──
  cream:   '#FAF6EF', // Fond principal de TOUS les écrans (sauf onboarding)
  surface: '#FFFFFF', // Cartes, barres de recherche, modales, fiches produit

  // ── Texte ──
  text:       '#1F2E27', // Texte principal — titres, noms, PRIX (jamais gold pour les prix)
  textSecond: '#9C958C', // Texte secondaire — distances, temps, dates, sous-titres
  textOnDark: '#FFFFFF', // Texte sur fond forest (onboarding, bandeaux, CTAs)

  // ── Bordures & séparateurs ──
  border: '#ECE6DC', // Contours de cartes discrets, dividers (gris très clair chaud)

  // ── Sémantique ──
  danger:  '#D9534F', // Badges de notification, alertes panier, erreurs critiques
  success: '#1A332B', // = forest — badges "en stock", confirmations commande
  star:    '#C9A35C', // = gold — étoiles de notation (toutes les étoiles)

  // ── Icônes flottantes (sur photo) ──
  floatIconBg:    'rgba(255,255,255,0.85)', // Fond circulaire semi-transparent (retour, favoris)
  floatIconColor: '#1F2E27',               // Couleur icône sur fond flottant

  // ── Overlay photo catégories ──
  imgOverlay: 'rgba(26,51,43,0.70)', // Dégradé sombre bas des images catégories
};

// ─── TYPOGRAPHIE — familles ───────────────────────────────────────────────────

export const FONT = {
  // Plus Jakarta Sans : titres d'écran, noms de commerçants, logo
  headingXl: 'PlusJakartaSans_800ExtraBold', // ≥ 26px
  heading:   'PlusJakartaSans_700Bold',       // ≤ 25px

  // DM Sans : corps de texte, labels, boutons, navigation, formulaires
  body:         'DMSans_400Regular',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold:     'DMSans_700Bold',
};

// ─── TYPOGRAPHIE — tailles ────────────────────────────────────────────────────

export const FONT_SIZE = {
  display: 30,  // Logo, grands chiffres onboarding         (spec: 28–32)
  h1:      25,  // Titres écran : "Bonjour !", "Catégories" (spec: 24–26)
  h2:      19,  // Titres carte/section, noms commerçants   (spec: 18–20)
  bodyLg:  16,  // Descriptions longues, items de liste     (spec: 15–16)
  body:    14,  // Texte courant, métadonnées               (spec: 13–14)
  caption: 11,  // Labels nav, badges, timestamps           (spec: 11–12)
  tagline: 11,  // Taglines MAJUSCULES + letter-spacing     (spec: 11)
};

// ─── TYPOGRAPHIE — hauteurs de ligne ─────────────────────────────────────────

export const LINE_HEIGHT = {
  display: 38,
  h1:      33,
  h2:      27,
  bodyLg:  24,
  body:    21,
  caption: 16,
  tagline: 16,
};

// ─── STYLES DE TEXTE PRÊTS À L'EMPLOI ────────────────────────────────────────
// Objets de style combinables directement dans StyleSheet.create ou en style inline.

export const TEXT = {
  display:  { fontFamily: FONT.headingXl,    fontSize: FONT_SIZE.display, lineHeight: LINE_HEIGHT.display, color: C.text },
  h1:       { fontFamily: FONT.heading,      fontSize: FONT_SIZE.h1,      lineHeight: LINE_HEIGHT.h1,      color: C.text },
  h2:       { fontFamily: FONT.heading,      fontSize: FONT_SIZE.h2,      lineHeight: LINE_HEIGHT.h2,      color: C.text },
  bodyLg:   { fontFamily: FONT.body,         fontSize: FONT_SIZE.bodyLg,  lineHeight: LINE_HEIGHT.bodyLg,  color: C.text },
  body:     { fontFamily: FONT.body,         fontSize: FONT_SIZE.body,    lineHeight: LINE_HEIGHT.body,    color: C.text },
  bodySec:  { fontFamily: FONT.body,         fontSize: FONT_SIZE.body,    lineHeight: LINE_HEIGHT.body,    color: C.textSecond },
  bodySm:   { fontFamily: FONT.body,         fontSize: FONT_SIZE.caption, lineHeight: LINE_HEIGHT.caption, color: C.textSecond },
  label:    { fontFamily: FONT.bodySemiBold, fontSize: FONT_SIZE.body,    lineHeight: LINE_HEIGHT.body,    color: C.text },
  labelSm:  { fontFamily: FONT.bodySemiBold, fontSize: FONT_SIZE.caption, lineHeight: LINE_HEIGHT.caption, color: C.text },
  caption:  { fontFamily: FONT.body,         fontSize: FONT_SIZE.caption, lineHeight: LINE_HEIGHT.caption, color: C.textSecond },
  // Tagline : MAJUSCULES avec letterSpacing — pour taglines de marque et labels de section
  tagline:  { fontFamily: FONT.bodySemiBold, fontSize: FONT_SIZE.tagline, lineHeight: LINE_HEIGHT.tagline, color: C.gold, letterSpacing: 1.5, textTransform: 'uppercase' },
  // Texte sur fond sombre (onboarding, bandeaux forest)
  onDark:   { fontFamily: FONT.body,         fontSize: FONT_SIZE.body,    lineHeight: LINE_HEIGHT.body,    color: C.textOnDark },
  h1OnDark: { fontFamily: FONT.heading,      fontSize: FONT_SIZE.h1,      lineHeight: LINE_HEIGHT.h1,      color: C.textOnDark },
  h2OnDark: { fontFamily: FONT.heading,      fontSize: FONT_SIZE.h2,      lineHeight: LINE_HEIGHT.h2,      color: C.textOnDark },
  // Prix — TOUJOURS C.text (#1F2E27) Bold, JAMAIS gold (le gold est réservé aux accents/badges)
  price:    { fontFamily: FONT.bodyBold,     fontSize: FONT_SIZE.h2,      lineHeight: LINE_HEIGHT.h2,      color: C.text },
  priceLg:  { fontFamily: FONT.heading,      fontSize: FONT_SIZE.h1,      lineHeight: LINE_HEIGHT.h1,      color: C.text },
};

// ─── ESPACEMENTS (base 4 px) ──────────────────────────────────────────────────

export const SPACE = {
  xs:  4,   // Espacement interne minimal, gap icône-texte
  sm:  8,   // Entre éléments proches, gap interne compact
  md:  12,  // Padding interne des petites cartes
  lg:  16,  // Padding horizontal des écrans (marges latérales), padding des cartes
  xl:  24,  // Entre sections
  xxl: 32,  // Marges de respiration majeures (onboarding, grands headers)
};

// ─── RAYONS DE BORDURE ────────────────────────────────────────────────────────

export const RADIUS = {
  sm:   8,   // Badges, chips, petits éléments UI
  md:   16,  // Cartes produit, boutons, champs de saisie
  lg:   20,  // Grandes cartes (bandeaux promo, cartes commerçant, images catégories)
  xl:   24,  // Modales, feuilles du bas, overlap cover → carte blanche
  pill: 999, // Barre de recherche, boutons pill, steppers de quantité
  // "radius-circle" du spec (50%) → en React Native, utiliser 999 avec width === height
};

// ─── OMBRES ───────────────────────────────────────────────────────────────────
// Principe : douces, diffuses, teintées forest (#1A332B) — jamais gris/noir pur

export const SHADOW = {
  // Cartes sur fond crème (commerçants, produits, sections)
  soft: {
    shadowColor:   '#1A332B',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius:  12,
    elevation:     3,
  },
  // Bandeaux promo, barres de recherche, éléments flottants
  medium: {
    shadowColor:   '#1A332B',
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius:  16,
    elevation:     5,
  },
  // Bottom navigation bar (ombre vers le haut)
  nav: {
    shadowColor:   '#1A332B',
    shadowOffset:  { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius:  8,
    elevation:     8,
  },
};

// ─── ICONOGRAPHIE ─────────────────────────────────────────────────────────────

export const ICON = {
  // strokeWidth selon le contexte (outline fin — jamais filled sauf nav active)
  stroke:       1.6, // Standard décoratif
  strokeAction: 2.0, // Boutons d'action, navigation
  strokeStrong: 2.5, // Validation, confirmation

  // Tailles standard
  sm:   16, // Inline dans le texte, labels
  md:   20, // Inline standard, chips
  lg:   24, // Header, tab bar, cartes
  xl:   32, // Éléments hero, titres de section
  hero: 56, // Empty states, onboarding

  // Couleurs par contexte
  primary:  C.forest,       // Navigation, actions principales
  accent:   C.gold,         // Étoiles, bouton "+", liens actifs
  muted:    C.textSecond,   // Icônes secondaires, inactives
  onDark:   C.textOnDark,   // Icônes sur fond forest
};

// ─── LAYOUT ───────────────────────────────────────────────────────────────────

export const LAYOUT = {
  screenPaddingH: SPACE.lg,  // = 16 — marges latérales standard des écrans
  headerHeight:   60,         // Hauteur header (spec: 56–64)
  tabBarContent:  56,         // Hauteur contenu tab bar (hors insets safe area)
  cardGap:        SPACE.md,   // = 12 — gap entre cartes en grille 2 colonnes
  coverHeight:    220,        // Hauteur image de couverture fiche commerçant
  logoSize:       64,         // Diamètre du logo commerçant circulaire
  logoOverlap:    32,         // Pixels de logo au-dessus de la carte blanche
};

// ─── EXPORT PAR DÉFAUT (accès groupé) ────────────────────────────────────────

const ClientTheme = {
  C,
  FONT,
  FONT_SIZE,
  LINE_HEIGHT,
  TEXT,
  SPACE,
  RADIUS,
  SHADOW,
  ICON,
  LAYOUT,
};

export default ClientTheme;
