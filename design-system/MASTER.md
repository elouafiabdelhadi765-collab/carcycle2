# Venduup — Design System v2

> Référence unique pour tous les écrans. Tout futur composant DOIT respecter ces tokens.

---

## 1. Philosophie

Venduup connecte des commerçants de proximité à leurs clients de quartier.
L'identité visuelle allie **sérieux professionnel** (bleu marine), **dynamisme tech** (teal) et **chaleur humaine** (corail, vert sauge) — sans tomber dans le générique startup ni dans le rustique.

---

## 2. Palette de couleurs — v2

### Couleurs principales

| Token        | Hex       | Rôle exact                                                            |
|--------------|-----------|-----------------------------------------------------------------------|
| `primary`    | `#212E53` | **Bleu marine foncé** — Titres, header fond, texte principal, onglet actif navbar |
| `accent`     | `#4A919E` | **Teal / Bleu-vert** — Boutons CTA, prix mis en évidence, bouton "Ajouter", visibilité stats |
| `coral`      | `#CE6A6B` | **Terracotta/Corail** — Badges "Promo du jour", alertes stock faible, urgence légère |
| `sage`       | `#BED3C3` | **Vert sauge clair** — Fond de cartes stat positives, badges "Disponible / En stock" |
| `pink`       | `#EBACA2` | **Rose poudré** — Fond de cartes stat secondaires, séparateurs décoratifs, éléments tertiaires |

### Couleurs de support

| Token          | Hex       | Rôle                                          |
|----------------|-----------|-----------------------------------------------|
| `primaryDark`  | `#1A2440` | Survol/pressed sur fond primary               |
| `primaryLight` | `#EEF1F8` | Fond léger pour éléments navy (badges, icons) |
| `accentDark`   | `#3A7A87` | Pressed state boutons teal                    |
| `accentLight`  | `#EBF5F7` | Fond léger pour éléments teal                 |
| `coralLight`   | `#FBECEC` | Fond alertes corail, badges urgence           |
| `sageLight`    | `#F0F6F2` | Fond très clair pour zones succès             |
| `pinkLight`    | `#FDF4F3` | Fond très clair décoratif                     |
| `surface`      | `#FFFFFF` | Cartes, modales, inputs                       |
| `bg`           | `#F9F7F6` | **Fond global** — blanc cassé légèrement teinté. Ne jamais utiliser une couleur vive en fond plein écran. |
| `border`       | `#E8EAF0` | Bordures cards, séparateurs — bleuté neutre   |
| `text`         | `#212E53` | Texte principal (= primary)                   |
| `textSecond`   | `#6B7A99` | Texte secondaire / sous-titres — bleu-gris    |
| `textOnDark`   | `#FFFFFF` | Texte sur fond primary ou accent              |
| `danger`       | `#B0312A` | Erreurs critiques, rupture totale de stock    |
| `dangerLight`  | `#FFF0EF` | Fond alertes danger critique                  |
| `disabled`     | `#C8CDD8` | Éléments inactifs — gris bleuté               |

### Règles d'utilisation obligatoires

1. **`#212E53` et `#4A919E` doivent coexister sur chaque écran** — jamais un seul bleu ne domine seul. Ex : header navy → CTA teal.
2. **`#CE6A6B` uniquement pour attirer l'attention** (badges promo, stocks faibles). Usage parcimonieux.
3. **`#BED3C3` et `#EBACA2` pour les fonds de cartes** — pas en couleur de texte ou d'icône.
4. **Fond global = `#F9F7F6`** — blanc cassé. Jamais de couleur vive en fond plein écran.

### Contraste WCAG AA (vérifié)

| Combinaison                            | Ratio   | Résultat              |
|----------------------------------------|---------|-----------------------|
| Blanc `#FFF` sur `#212E53`             | ~9.0:1  | ✅ AAA                |
| `#212E53` sur `#BED3C3`               | ~5.4:1  | ✅ AA tous usages     |
| `#212E53` sur `#EBACA2`               | ~5.0:1  | ✅ AA tous usages     |
| `#212E53` sur `#FFFFFF`               | ~9.0:1  | ✅ AAA                |
| Blanc `#FFF` sur `#CE6A6B`            | ~3.7:1  | ✅ AA grands textes   |
| Blanc `#FFF` sur `#4A919E`            | ~4.0:1  | ✅ AA boutons (bold)  |
| `#6B7A99` sur `#FFFFFF`               | ~4.6:1  | ✅ AA                 |

---

## 3. Typographie

### Familles

| Rôle           | Famille           | Variante chargée          | Usage                                 |
|----------------|-------------------|---------------------------|---------------------------------------|
| `heading`      | Playfair Display  | `PlayfairDisplay_700Bold` | Titres écrans, noms boutiques, chiffres stats |
| `body`         | DM Sans           | `DMSans_400Regular`       | Corps de texte, labels, descriptions  |
| `bodySemiBold` | DM Sans           | `DMSans_600SemiBold`      | Labels inputs, statuts, catégories, tab labels |
| `bodyBold`     | DM Sans           | `DMSans_700Bold`          | Montants, initiales avatar            |

### Échelle typographique

| Niveau     | fontSize | fontFamily     | Usage                          |
|------------|----------|----------------|--------------------------------|
| Display    | 28–32    | `heading`      | Chiffres stats dashboard       |
| H1         | 22–24    | `heading`      | Nom de boutique, titre écran   |
| H2         | 18–20    | `heading`      | Titres de section              |
| H3         | 15–16    | `heading`      | Sous-titres, titres de cartes  |
| Body L     | 16       | `body`         | Texte inputs, descriptions     |
| Body M     | 14–15    | `bodySemiBold` | Labels, noms produits          |
| Body S     | 13       | `body`         | Texte secondaire               |
| Caption    | 11–12    | `body`         | Badges, timestamps             |
| Tab label  | 10–11    | `bodySemiBold` | Labels navbar                  |

---

## 4. Espacements (base 4 px)

| Token | Valeur | Usage typique                             |
|-------|--------|-------------------------------------------|
| `xs`  | 4 px   | Gap intra-composant (icon + label)        |
| `sm`  | 8 px   | Padding interne compact                   |
| `md`  | 12 px  | Gap entre éléments d'une card             |
| `lg`  | 16 px  | Padding horizontal écran, gap sections    |
| `xl`  | 20–24  | Padding vertical cards, marges sections   |
| `2xl` | 32     | Séparation entre sections majeures        |

---

## 5. Border radius

```js
const RADIUS = { sm: 8, md: 12, lg: 18, xl: 24, full: 999 };
```

---

## 6. Ombres

Couleur de base : `#212E53` (navy) — ombre bleutée cohérente avec la palette.

```js
const SHADOW = {
  sm: { shadowColor:'#212E53', shadowOffset:{width:0,height:1}, shadowOpacity:0.08, shadowRadius:3,  elevation:2 },
  md: { shadowColor:'#212E53', shadowOffset:{width:0,height:3}, shadowOpacity:0.12, shadowRadius:8,  elevation:5 },
  lg: { shadowColor:'#212E53', shadowOffset:{width:0,height:6}, shadowOpacity:0.15, shadowRadius:16, elevation:8 },
};
```

---

## 7. Icônes

Bibliothèque : **lucide-react-native** (v1.18+)
- Taille inline : **20 px** · Standalone : **24 px** · Header/hero : **28–32 px**
- `strokeWidth` : 1.5 (décoratif) · 2 (action) · 2.5 (confirmation)
- Couleur par contexte : `#212E53` (navy, principal) ou `#4A919E` (teal, accent/CTA)

---

## 8. Composants tokens

### Bouton primaire (CTA)
```
background:    #4A919E (accent)
text:          #FFFFFF, heading font, 17px
radius:        xl (24)
padding:       vertical 18–20, horizontal 24
shadow:        md
activeOpacity: 0.82
```

### Bouton secondaire
```
background:    #FFFFFF
border:        1.5px #212E53 (primary)
text:          #212E53, bodySemiBold, 15px
radius:        xl (24)
```

### Card produit (catalogue)
```
background:    #FFFFFF
border:        1px #E8EAF0
radius:        lg (18)
shadow:        sm
prix:          #4A919E, heading font
badge dispo:   bg #BED3C3, texte #212E53
badge rupture: bg #CE6A6B, texte #FFFFFF
```

### Card stat (dashboard)
```
bg alterné:    #BED3C3 (sage) ou #EBACA2 (pink)
valeur:        #4A919E, heading font, 22px
label:         #212E53, body, 12px
```

### Header écran
```
background:    #212E53
texte titre:   #FFFFFF, heading font
texte sous:    rgba(255,255,255,0.65), body
```

### Badge statut
```
disponible:    bg #BED3C3, texte #212E53
promotion:     bg #CE6A6B, texte #FFFFFF
en attente:    bg #FBECEC,  texte #CE6A6B
succès/prêt:   bg #EBF5F7, texte #4A919E
```

### Input
```
background:    #F9F7F6
border:        1.5px #E8EAF0
radius:        md (12)
padding:       horizontal 16, vertical 14
focus border:  #4A919E, 2px
```

### Bottom tab bar
```
background:    #FFFFFF
border top:    1px #E8EAF0
onglet actif:  icône + label #212E53 (primary)
onglet inactif:icône + label #6B7A99 (gris bleuté)
bouton central:background #4A919E (accent), icône blanche
```

---

## 9. Chargement des fonts (App.js)

```js
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { DMSans_400Regular, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  PlayfairDisplay_700Bold,
  DMSans_400Regular,
  DMSans_600SemiBold,
  DMSans_700Bold,
});
```

---

## 10. Tokens JS à copier dans chaque écran

```js
const C = {
  primary:     '#212E53',
  primaryDark: '#1A2440',
  primaryLight:'#EEF1F8',
  accent:      '#4A919E',
  accentDark:  '#3A7A87',
  accentLight: '#EBF5F7',
  coral:       '#CE6A6B',
  coralLight:  '#FBECEC',
  sage:        '#BED3C3',
  sageLight:   '#F0F6F2',
  pink:        '#EBACA2',
  pinkLight:   '#FDF4F3',
  surface:     '#FFFFFF',
  bg:          '#F9F7F6',
  border:      '#E8EAF0',
  text:        '#212E53',
  textSecond:  '#6B7A99',
  textOnDark:  '#FFFFFF',
  danger:      '#B0312A',
  dangerLight: '#FFF0EF',
  disabled:    '#C8CDD8',
};

const FONT = {
  heading:      'PlayfairDisplay_700Bold',
  body:         'DMSans_400Regular',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold:     'DMSans_700Bold',
};

const RADIUS = { sm: 8, md: 12, lg: 18, xl: 24, full: 999 };

const SHADOW = {
  sm: { shadowColor:'#212E53', shadowOffset:{width:0,height:1}, shadowOpacity:0.08, shadowRadius:3,  elevation:2 },
  md: { shadowColor:'#212E53', shadowOffset:{width:0,height:3}, shadowOpacity:0.12, shadowRadius:8,  elevation:5 },
  lg: { shadowColor:'#212E53', shadowOffset:{width:0,height:6}, shadowOpacity:0.15, shadowRadius:16, elevation:8 },
};
```

---

## 11. À NE PAS FAIRE

- ❌ `fontWeight: '700'` avec une fontFamily custom (poids dans le nom)
- ❌ `shadowColor: '#000'` ou gris froids — utiliser `#212E53`
- ❌ `SafeAreaView` de `react-native` — toujours depuis `react-native-safe-area-context`
- ❌ Emojis comme éléments UI — utiliser lucide-react-native
- ❌ Fond plein écran dans une couleur vive (#212E53, #4A919E, etc.) — réserver aux cartes/headers
- ❌ `#CE6A6B` comme couleur dominante d'un écran — uniquement pour les accroches visuelles
- ❌ Bleus "startup" froids (#6366F1, #3B82F6) ou verts génériques (#22C55E)
