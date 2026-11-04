import type { ProductCategory } from '../types';

export interface CategoryDef {
  id: ProductCategory;
  label: string;
  iconName: string;
  description: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
}

export const CARECYCLE_CATEGORIES: CategoryDef[] = [
  {
    id: 'soins_visage',
    label: 'Soins du visage',
    iconName: 'Sparkles',
    description: 'Sérums, crèmes hydratantes, nettoyants et soins anti-âge',
    bgGradient: 'from-emerald-900/80 to-teal-950',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-800',
  },
  {
    id: 'soins_corps',
    label: 'Soins du corps',
    iconName: 'Heart',
    description: 'Laits corporels, crèmes nourrissantes et huiles précieuses',
    bgGradient: 'from-cyan-900/80 to-slate-900',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    badgeText: 'text-cyan-800',
  },
  {
    id: 'capillaire',
    label: 'Soins capillaires',
    iconName: 'Scissors',
    description: 'Shampoings traitants, masques réparateurs et lotions antichute',
    bgGradient: 'from-purple-900/80 to-indigo-950',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeText: 'text-purple-800',
  },
  {
    id: 'hygiene_bain',
    label: 'Hygiène & Bain',
    iconName: 'Droplets',
    description: 'Gels lavants sans savon, huiles de douche et savons dermatologiques',
    bgGradient: 'from-blue-900/80 to-sky-950',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    badgeText: 'text-blue-800',
  },
  {
    id: 'hygiene_buccodentaire',
    label: 'Hygiène dentaire',
    iconName: 'Smile',
    description: 'Dentifrices blancheur, gencives sensibles et bains de bouche',
    bgGradient: 'from-teal-900/80 to-green-950',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    badgeText: 'text-teal-800',
  },
  {
    id: 'bebe_maternite',
    label: 'Bébé & Maternité',
    iconName: 'Baby',
    description: 'Liniments, crèmes de change, laits de toilette et soins post-partum',
    bgGradient: 'from-amber-900/80 to-stone-900',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-800',
  },
  {
    id: 'complements_alimentaires',
    label: 'Compléments',
    iconName: 'Leaf',
    description: 'Vitamines, probiotiques, magnésium et phytothérapie bio',
    bgGradient: 'from-lime-900/80 to-emerald-950',
    badgeBg: 'bg-lime-50 text-lime-800 border-lime-200',
    badgeText: 'text-lime-800',
  },
  {
    id: 'materiel_medical',
    label: 'Matériel médical',
    iconName: 'Activity',
    description: 'Thermomètres sans contact, tensiomètres et pansements techniques',
    bgGradient: 'from-slate-800 to-zinc-950',
    badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
    badgeText: 'text-slate-800',
  },
  {
    id: 'premiers_secours',
    label: 'Premiers secours',
    iconName: 'PlusCircle',
    description: 'Désinfectants, compresses stériles, pansements et gels cicatrisants',
    bgGradient: 'from-rose-900/80 to-red-950',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    badgeText: 'text-rose-800',
  },
  {
    id: 'dermocosmetique',
    label: 'Dermocosmétique',
    iconName: 'Star',
    description: 'Soins haute tolérance, peaux atopiques, acné et anti-rougeurs',
    bgGradient: 'from-stone-800 to-amber-950',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-800',
  },
  {
    id: 'protection_solaire',
    label: 'Protection solaire',
    iconName: 'Sun',
    description: 'Fluides invisibles SPF50+, crèmes minérales et après-soleil',
    bgGradient: 'from-amber-800/80 to-yellow-950',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    badgeText: 'text-amber-900',
  },
];

export const CATEGORY_MAP: Record<ProductCategory, string> = Object.fromEntries(
  CARECYCLE_CATEGORIES.map(c => [c.id, c.label])
) as Record<ProductCategory, string>;

export function getCategoryLabel(id: ProductCategory | string | null | undefined): string {
  if (!id) return '';
  return CATEGORY_MAP[id as ProductCategory] ?? id;
}
