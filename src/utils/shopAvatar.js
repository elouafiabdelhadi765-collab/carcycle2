// Avatar "premium" pour une boutique sans photo : initiales + couleur
// deterministes derivees du nom, pour que chaque pharmacie soit visuellement
// distincte (contrairement a une icone generique partagee par toutes).

// Palette sobre "boutique premium" — volontairement distincte du vert de
// marque (Colors.primary) pour ne pas etre confondue avec le chrome de l'app.
const PALETTE = [
  '#0F5C4A', // teal profond
  '#8B5A2B', // terracotta
  '#4A5568', // ardoise
  '#7C5295', // prune
  '#B7791F', // ocre
  '#2C5282', // marine
  '#9B5B4B', // argile
  '#556B2F', // olive
];

// Mots vides a ignorer pour ne pas faire ressortir "PH" sur toutes les
// pharmacies (la quasi-totalite des noms demo commencent par "Pharmacie").
const STOPWORDS = new Set(['pharmacie', 'parapharmacie', 'ma', 'le', 'la', 'les', 'du', 'de', 'des', "l'"]);

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function getShopInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/).filter((w) => w.length > 0);
  const meaningful = words.filter((w) => !STOPWORDS.has(w.toLowerCase()));

  if (meaningful.length >= 2) {
    return (meaningful[0][0] + meaningful[1][0]).toUpperCase();
  }
  if (meaningful.length === 1) {
    return meaningful[0].slice(0, 2).toUpperCase();
  }
  // Repli : tous les mots sont des mots vides (ex. "Ma Pharmacie")
  return words.length > 0 ? words[0].slice(0, 2).toUpperCase() : '?';
}

export function getShopAvatarColor(name) {
  if (!name) return PALETTE[0];
  return PALETTE[hashString(name) % PALETTE.length];
}
