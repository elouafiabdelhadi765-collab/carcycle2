// ─── Design system harmonisé (inspiré Too Good To Go) — 1 famille, 6 échelles, 3 graisses ───
// Source unique pour toute nouvelle valeur de police. Ne jamais écrire de
// fontSize/fontFamily/lineHeight en dur dans un style — passer par ces
// tokens (ou par AppText via la prop `scale`, voir components/ui/AppText.tsx).
//
// Remplace progressivement DMSans_* et les graisses Inter_500Medium /
// Inter_800ExtraBold (bannies, sauf le wordmark "CareCycle" qui reste en
// PlusJakartaSans_800ExtraBold — seule exception de marque tolérée).

export const FontFamily = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  logo: 'PlusJakartaSans_800ExtraBold', // wordmark uniquement
} as const;

export const FontSize = {
  caption: 12,
  body: 14,
  bodyLarge: 16,
  title: 20,
  headline: 24,
  display: 40,
} as const;

export const LineHeight = {
  caption: 16,
  body: 20,
  bodyLarge: 22,
  title: 26,
  headline: 30,
  display: 46,
} as const;

export type TypographyScale = keyof typeof FontSize;
export type TypographyWeight = 'regular' | 'semibold' | 'bold';

// Graisse par defaut de chaque echelle quand `weight` n'est pas precise —
// evite de repeter le meme choix partout, tout en restant surchargeable
// au cas par cas (voir AppText: prop `weight`).
export const DefaultWeight: Record<TypographyScale, TypographyWeight> = {
  caption: 'regular',
  body: 'regular',
  bodyLarge: 'semibold',
  title: 'semibold',
  headline: 'bold',
  display: 'bold',
};

// Helper pour les rares endroits qui ne passent pas par AppText (StyleSheet
// direct) — garde une seule source de verite meme hors composant. Exemple :
// title: { ...textStyle('title') } ou { ...textStyle('body', 'bold') }.
export function textStyle(scale: TypographyScale, weight?: TypographyWeight) {
  return {
    fontFamily: FontFamily[weight ?? DefaultWeight[scale]],
    fontSize: FontSize[scale],
    lineHeight: LineHeight[scale],
  };
}
