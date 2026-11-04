# VendUp — Fiche technique Backend / API

Ce document décrit toutes les fonctionnalités backend nécessaires au fonctionnement de l'app VendUp (React Native / Expo), à destination du développeur backend. Le schéma de base de données de référence est `supabase/schema.sql` (PostgreSQL / Supabase). Si l'implémentation finale n'utilise pas Supabase directement, les endpoints ci-dessous doivent reproduire le même contrat (mêmes champs, mêmes règles).

## 1. Vue d'ensemble

Deux applications cohabitent dans le même client mobile, avec deux rôles distincts :

- **Commerçant** : gère sa boutique, ses produits, ses commandes, ses avis.
- **Client** : parcourt les boutiques/catégories, commande, suit ses commandes, laisse des avis.

Un compte = un rôle. Pas de bascule de rôle après inscription.

## 2. Authentification

### 2.1 Inscription commerçant
`POST /auth/signup/merchant`

| Champ | Type | Requis | Note |
|---|---|---|---|
| email | string | oui | unique |
| password | string | oui | min 8 caractères |
| shop_name | string | oui | nom de la boutique |
| phone | string | non | |

Effet attendu : crée un compte utilisateur (`auth.users`) + une ligne `shops` associée (`owner_id`) avec `name = shop_name`. Retourne une session (access token + refresh token).

### 2.2 Inscription client
`POST /auth/signup/client`

| Champ | Type | Requis | Note |
|---|---|---|---|
| email | string | oui | unique |
| password | string | oui | min 8 caractères |
| full_name | string | oui | |

Effet attendu : crée un compte utilisateur avec rôle `client` (pas de ligne `shops`). Retourne une session.

### 2.3 Connexion
`POST /auth/login`

| Champ | Type | Requis |
|---|---|---|
| email | string | oui |
| password | string | oui |

Réponse : session + `role` (`merchant` ou `client`) pour que le client mobile sache vers quelle navigation rediriger.

### 2.4 Déconnexion
`POST /auth/logout` — invalide la session côté serveur.

### 2.5 Session courante
`GET /auth/me` — retourne l'utilisateur connecté (id, email, role, et `shop_id` si commerçant).

### 2.6 Réinitialisation mot de passe (à prévoir, non encore présent côté UI)
`POST /auth/forgot-password` → envoie un email avec lien de reset.

**Stockage du rôle** : soit une colonne `role` dans une table `profiles` (recommandé), soit déduit par la présence d'une ligne dans `shops` (`owner_id`). Le client mobile a besoin de connaître le rôle dès la connexion pour rediriger vers `MerchantApp` ou `ClientApp`.

## 3. Boutiques (`shops`)

### 3.1 Récupérer ma boutique (commerçant connecté)
`GET /shops/me` → objet boutique complet (voir colonnes dans `schema.sql`).

### 3.2 Mettre à jour ma boutique
`PATCH /shops/me`
Body : tout ou partie de `{ name, description, category, address, phone, email, instagram, cover_url, avatar_url, hours, closed_today, instructions }`.
`hours` est un tableau de 7 objets `{ day, open, openTime, closeTime }`.

### 3.3 Lister les boutiques (côté client — découverte)
`GET /shops?category=&search=&near=lat,lng&page=`
Retourne une liste paginée de boutiques publiques (sans champs sensibles type email/téléphone si non publics — à clarifier avec le métier).

### 3.4 Détail d'une boutique (fiche commerçant côté client)
`GET /shops/:id` → boutique + ses produits disponibles + ses avis (ou endpoints séparés, voir §4 et §6).

### 3.5 Upload photo (cover / avatar)
`POST /shops/me/cover` et `POST /shops/me/avatar` — upload multipart, retourne l'URL publique (Supabase Storage bucket `shop-images` ou équivalent).

## 4. Produits (`products`)

### 4.1 Lister les produits de ma boutique (commerçant)
`GET /shops/me/products?filter=visible|hidden|promo&sort=&search=`

### 4.2 Lister les produits d'une boutique (client, lecture publique)
`GET /shops/:id/products` → uniquement les produits `available = true`.

### 4.3 Créer un produit
`POST /shops/me/products`
Body : `{ name, price, stock, image_url, category? }`
`image_url` est uploadée séparément (voir §4.5) puis référencée ici.

### 4.4 Modifier un produit
`PATCH /products/:id` (vérifier que le produit appartient à la boutique de l'utilisateur connecté)
Body : champs partiels, dont `available` (toggle visibilité).

### 4.5 Upload photo produit
`POST /products/:id/photo` (ou un endpoint générique d'upload avant création) — multipart, retourne l'URL. Source : caméra ou galerie côté app (déjà implémenté avec `expo-image-picker`).

### 4.6 Supprimer un produit
`DELETE /products/:id`

## 5. Catégories (découverte client)

`GET /categories` → liste statique ou en base : `{ id, label, image_url, shop_count }`. Actuellement mocké en dur côté app (`src/data/categories.js`) — à terme, peut rester une table de référence simple sans CRUD (gérée par l'équipe produit, pas par les commerçants).

## 6. Commandes (`orders` / `order_items`)

### 6.1 Créer une commande (client — checkout panier)
`POST /orders`
Body :
```json
{
  "shop_id": "uuid",
  "items": [
    { "product_id": "uuid", "qty": 2 }
  ]
}
```
Règles métier **importantes** :
- Le serveur recalcule `price` et `total` à partir des produits en base (ne jamais faire confiance au prix envoyé par le client).
- Vérifier `stock >= qty` pour chaque ligne, décrémenter le stock de façon atomique (transaction). Si stock insuffisant → erreur 409 avec le détail des produits en rupture.
- `client_name` / `client_phone` proviennent du profil utilisateur connecté (pas saisis librement).
- Statut initial : `new`.
- Si le panier contient des produits de plusieurs boutiques (cas géré côté UI — `PanierScreen` groupe par commerçant), créer **une commande par boutique**.
- Déclenche la création d'une notification (`type: order`) pour le commerçant concerné.

### 6.2 Lister mes commandes (commerçant)
`GET /shops/me/orders?status=new|preparing|ready|cancelled`

### 6.3 Lister mes commandes (client)
`GET /clients/me/orders`

### 6.4 Détail d'une commande
`GET /orders/:id` → commande + `order_items`. Accessible au commerçant propriétaire de la boutique ou au client qui l'a passée.

### 6.5 Changer le statut (commerçant)
`PATCH /orders/:id/status`
Body : `{ "status": "preparing" | "ready" | "cancelled" }`
Transitions valides uniquement : `new → preparing → ready`, ou `new|preparing → cancelled`. Rejeter toute autre transition (400).
Si `cancelled` : restaurer le stock des produits de la commande.

## 7. Avis (`reviews`)

### 7.1 Lister les avis d'une boutique (public)
`GET /shops/:id/reviews`

### 7.2 Laisser un avis (client)
`POST /shops/:id/reviews`
Body : `{ rating: 1-5, comment: string }`
Règle à valider avec le métier : limiter à un avis par client par boutique, et/ou exiger une commande livrée préalable.

### 7.3 Répondre à un avis (commerçant)
`PATCH /reviews/:id/reply`
Body : `{ reply: string }` — uniquement si la review appartient à une boutique du commerçant connecté.

## 8. Notifications (commerçant uniquement)

### 8.1 Lister mes notifications
`GET /shops/me/notifications`

### 8.2 Marquer comme lue
`PATCH /notifications/:id` → `{ read: true }`

### 8.3 Tout marquer comme lu
`POST /shops/me/notifications/mark-all-read`

Notifications générées automatiquement par le serveur sur :
- nouvelle commande (`type: order`)
- nouvel avis (`type: review`)
- stock épuisé après une commande (`type: stock`)

## 9. Panier

Le panier reste **géré côté client** (persisté en local via `AsyncStorage`), pas d'API serveur nécessaire — sauf si une synchronisation multi-appareil est souhaitée plus tard (`GET/PUT /clients/me/cart`).

## 10. Règles transverses

- **Autorisation** : chaque endpoint de mutation (POST/PATCH/DELETE) doit vérifier que la ressource appartient bien à l'utilisateur connecté (boutique du commerçant, ou commande/avis du client). Voir policies RLS dans `supabase/schema.sql` pour la logique exacte attendue si Supabase est utilisé directement.
- **Pagination** : toutes les listes potentiellement longues (`shops`, `products`, `orders`, `reviews`) doivent accepter `page` / `limit` ou curseur.
- **Erreurs** : format JSON cohérent, ex. `{ "error": { "code": "OUT_OF_STOCK", "message": "..." } }`.
- **Dates** : ISO 8601 UTC partout.
- **Montants** : nombres décimaux (pas de centimes entiers), arrondis à 2 décimales.
- **Images** : stockage via Supabase Storage (ou équivalent S3) ; l'app envoie le fichier directement (caméra/galerie), jamais une URL externe arbitraire en production.

## 11. Correspondance avec le code app existant

| Fonction côté app | Fichier | Endpoint(s) concerné(s) |
|---|---|---|
| `AppDataContext.addProduct/updateProduct/toggleProductAvailability/deleteProduct` | `context/AppDataContext.js` | §4 |
| `AppDataContext.updateShopInfo` | idem | §3.2 |
| `AppDataContext.updateOrderStatus/addOrder` | idem | §6.1, §6.5 |
| `AppDataContext.replyToReview` | idem | §7.3 |
| `AppDataContext.markNotificationRead/markAllNotificationsRead` | idem | §8.2, §8.3 |
| `CartContext.*` | `context/CartContext.js` | §9 (local uniquement) |
| Checkout (`PanierScreen.handleValidate`) | `src/screens/client/PanierScreen.jsx` | §6.1 |
| Capture photo produit | `src/screens/merchant/AddProductScreen.jsx` | §4.5 |

Ces fonctions sont aujourd'hui branchées sur `AsyncStorage` local (`lib/storage.js`) — la migration consiste à les faire pointer vers les endpoints/ci-dessus (ou directement vers Supabase via `src/services/supabase.ts`).
