-- ============================================
-- SEED DIJON — VendUp Test Data
-- ============================================
--
-- Schema reel verifie avant generation (connexion directe Postgres, pas de
-- supposition) :
--
--   public.shops
--     - owner_id  : NOT NULL, UNIQUE, FOREIGN KEY -> auth.users(id) ON DELETE CASCADE
--       => une boutique = un proprietaire distinct. Ce script cree donc 15
--          comptes auth.users dedies (section 0) puisqu'il n'existe pas assez
--          de comptes libres en base pour les 15 boutiques de test.
--     - cover_url (PAS cover_image), lat/lng (PAS latitude/longitude),
--       active (PAS is_active), hours (jsonb, tableau de 7 jours).
--     - PAS de colonnes rating / reviews_count / is_open / closing_time
--       (l'app cote client gere deja leur absence avec un fallback, voir
--       DiscoverScreen.jsx : '—' / 0 / ligne masquee).
--
--   public.products
--     - shop_id NOT NULL, FOREIGN KEY -> shops(id) ON DELETE CASCADE
--     - available (PAS is_active), CHECK price >= 0, CHECK stock >= 0
--     - PAS de table "promotions" : la promo est directement portee par
--       is_promo / promo_price / promo_end_date sur products.
--
--   auth.users : aucun trigger sur cette table dans ce projet -> insertion
--     directe sans risque de cascade applicative. instance_id / aud / role
--     repris a l'identique des comptes existants ('00000000-...-0000',
--     'authenticated', 'authenticated').
--
-- A executer tel quel dans l'editeur SQL Supabase (role postgres /
-- service_role, memes droits que la connexion utilisee pour inspecter le
-- schema). Les 15 comptes auth.users et les 15 boutiques utilisent des UUID
-- fixes (idempotent via ON CONFLICT DO NOTHING) ; les produits utilisent
-- gen_random_uuid() et seront donc dupliques si ce script est rejoue.
--
-- NB images produits : seules les 8 URL Unsplash par categorie ont ete
-- fournies/verifiees ; faute de pouvoir naviguer le web pour valider 75 URL
-- individuelles, les produits reutilisent la photo Unsplash de leur
-- categorie plutot que d'inventer des ID de photo non verifies.

BEGIN;

-- ============================================
-- 0. COMPTES PROPRIETAIRES (auth.users)
-- ============================================
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  is_sso_user, is_anonymous, created_at, updated_at
) VALUES
  ('b0000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.boulangerie-du-palais@venduup-seed.fr', crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.au-pain-dore@venduup-seed.fr',         crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.maison-lefort@venduup-seed.fr',        crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.epicerie-des-halles@venduup-seed.fr',  crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.epicerie-fine@venduup-seed.fr',        crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.saveurs-de-bourgogne@venduup-seed.fr', crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.primeur-du-marche@venduup-seed.fr',    crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.boucherie-gauthier@venduup-seed.fr',   crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.la-bonne-viande@venduup-seed.fr',      crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.cave-a-fromages@venduup-seed.fr',      crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.fromagerie-bourguignonne@venduup-seed.fr', crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.cave-des-ducs@venduup-seed.fr',        crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.cellier-dijonnais@venduup-seed.fr',    crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.poissonnerie-de-la-mer@venduup-seed.fr', crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now()),
  ('b0000000-0000-4000-8000-000000000015', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed.traiteur-duclos@venduup-seed.fr',      crypt('seed-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 1. MAGASINS (15 boutiques, rayon ~800m autour de Dijon centre 47.3220 / 5.0415)
-- ============================================
INSERT INTO shops (
  id, owner_id, name, description, category, address, phone,
  cover_url, avatar_url, hours, closed_today, lat, lng, active, plan
) VALUES
  (
    'c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001',
    'Boulangerie du Palais', 'Boulangerie artisanale au levain naturel, pains et viennoiseries maison.', 'Boulangerie',
    '5 rue du Palais, Dijon 21000', '03 80 11 22 01',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    '[{"day":"Lundi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Mardi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Mercredi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Jeudi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Vendredi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Samedi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Dimanche","open":true,"openTime":"07:00","closeTime":"13:00"}]'::jsonb,
    false, 47.3233, 5.0422, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002',
    'Au Pain Doré', 'Fournil traditionnel, cuisson au feu de bois, specialites de viennoiserie.', 'Boulangerie',
    '12 rue Musette, Dijon 21000', '03 80 11 22 02',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    '[{"day":"Lundi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Mardi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Mercredi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Jeudi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Vendredi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Samedi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Dimanche","open":true,"openTime":"07:00","closeTime":"13:00"}]'::jsonb,
    false, 47.3233, 5.0449, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003',
    'Maison Lefort', 'Boulangerie-patisserie familiale depuis trois generations.', 'Boulangerie',
    '27 rue Berbisey, Dijon 21000', '03 80 11 22 03',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    '[{"day":"Lundi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Mardi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Mercredi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Jeudi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Vendredi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Samedi","open":true,"openTime":"07:00","closeTime":"19:30"},{"day":"Dimanche","open":true,"openTime":"07:00","closeTime":"13:00"}]'::jsonb,
    false, 47.3213, 5.0474, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000004',
    'Épicerie des Halles', 'Epicerie fine de quartier, produits regionaux et specialites bourguignonnes.', 'Épicerie',
    '3 rue Quentin, Dijon 21000', '03 80 11 22 04',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    '[{"day":"Lundi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Mardi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Mercredi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Jeudi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Vendredi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Samedi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Dimanche","open":false,"openTime":"08:30","closeTime":"19:30"}]'::jsonb,
    false, 47.3179, 5.0466, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000005',
    'L''Épicerie Fine', 'Selection d''epicerie fine francaise et internationale.', 'Épicerie',
    '18 rue Bossuet, Dijon 21000', '03 80 11 22 05',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    '[{"day":"Lundi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Mardi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Mercredi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Jeudi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Vendredi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Samedi","open":true,"openTime":"08:30","closeTime":"19:30"},{"day":"Dimanche","open":false,"openTime":"08:30","closeTime":"19:30"}]'::jsonb,
    false, 47.3153, 5.0415, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000006',
    'Les Saveurs de Bourgogne', 'Fruits et legumes frais, circuits courts et producteurs locaux.', 'Primeur',
    '9 place Émile Zola, Dijon 21000', '03 80 11 22 06',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
    '[{"day":"Lundi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Dimanche","open":true,"openTime":"08:00","closeTime":"13:00"}]'::jsonb,
    false, 47.3172, 5.0355, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000007',
    'Primeur du Marché', 'Etal de fruits et legumes de saison face au marche des Halles.', 'Primeur',
    '2 place François Rude, Dijon 21000', '03 80 11 22 07',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
    '[{"day":"Lundi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"07:30","closeTime":"19:00"},{"day":"Dimanche","open":true,"openTime":"08:00","closeTime":"13:00"}]'::jsonb,
    false, 47.3211, 5.0343, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000008',
    'Boucherie Gauthier', 'Boucherie artisanale, viandes locales et conseils de preparation.', 'Boucherie',
    '14 rue Chabot-Charny, Dijon 21000', '03 80 11 22 08',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    '[{"day":"Lundi","open":false,"openTime":"08:00","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Dimanche","open":true,"openTime":"08:00","closeTime":"12:30"}]'::jsonb,
    false, 47.3238, 5.0369, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000009',
    'La Bonne Viande', 'Boucherie-charcuterie, viandes maturees et specialites bourguignonnes.', 'Boucherie',
    '21 rue Berlier, Dijon 21000', '03 80 11 22 09',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    '[{"day":"Lundi","open":false,"openTime":"08:00","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"08:00","closeTime":"19:00"},{"day":"Dimanche","open":true,"openTime":"08:00","closeTime":"12:30"}]'::jsonb,
    false, 47.3241, 5.0404, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000010',
    'La Cave à Fromages', 'Fromagerie artisanale, affinage en cave et AOP de Bourgogne.', 'Fromagerie',
    '6 rue Vannerie, Dijon 21000', '03 80 11 22 10',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800',
    '[{"day":"Lundi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Dimanche","open":false,"openTime":"09:00","closeTime":"19:00"}]'::jsonb,
    false, 47.3226, 5.0424, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000011',
    'Fromagerie Bourguignonne', 'Plateau de fromages a la coupe, conseils d''accord mets-fromages.', 'Fromagerie',
    '11 rue Verrerie, Dijon 21000', '03 80 11 22 11',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800',
    '[{"day":"Lundi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Dimanche","open":false,"openTime":"09:00","closeTime":"19:00"}]'::jsonb,
    false, 47.3263, 5.0432, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000012', 'b0000000-0000-4000-8000-000000000012',
    'Cave des Ducs', 'Cave a vins de Bourgogne, conseils et degustations sur demande.', 'Cave à vin',
    '4 rue de la Préfecture, Dijon 21000', '03 80 11 22 12',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    '[{"day":"Lundi","open":false,"openTime":"10:00","closeTime":"19:30"},{"day":"Mardi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Mercredi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Jeudi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Vendredi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Samedi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Dimanche","open":false,"openTime":"10:00","closeTime":"19:30"}]'::jsonb,
    false, 47.3235, 5.0498, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000013',
    'Le Cellier Dijonnais', 'Cave a vins et spiritueux, grands crus et cremants de Bourgogne.', 'Cave à vin',
    '16 rue Piron, Dijon 21000', '03 80 11 22 13',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    '[{"day":"Lundi","open":false,"openTime":"10:00","closeTime":"19:30"},{"day":"Mardi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Mercredi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Jeudi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Vendredi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Samedi","open":true,"openTime":"10:00","closeTime":"19:30"},{"day":"Dimanche","open":false,"openTime":"10:00","closeTime":"19:30"}]'::jsonb,
    false, 47.3198, 5.0448, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000014',
    'Poissonnerie de la Mer', 'Poissons et coquillages frais, arrivage quotidien.', 'Poissonnerie',
    '8 rue des Forges, Dijon 21000', '03 80 11 22 14',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
    '[{"day":"Lundi","open":false,"openTime":"07:00","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"07:00","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"07:00","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"07:00","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"07:00","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"07:00","closeTime":"19:00"},{"day":"Dimanche","open":true,"openTime":"07:00","closeTime":"13:00"}]'::jsonb,
    false, 47.3214, 5.0390, true, 'basic'
  ),
  (
    'c0000000-0000-4000-8000-000000000015', 'b0000000-0000-4000-8000-000000000015',
    'Traiteur Duclos', 'Plats cuisines maison, specialites bourguignonnes a emporter.', 'Traiteur',
    '23 rue Auguste Comte, Dijon 21000', '03 80 11 22 15',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    '[{"day":"Lundi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Mardi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Mercredi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Jeudi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Vendredi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Samedi","open":true,"openTime":"09:00","closeTime":"19:00"},{"day":"Dimanche","open":true,"openTime":"09:00","closeTime":"13:00"}]'::jsonb,
    false, 47.3248, 5.0366, true, 'basic'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. PRODUITS (5 par magasin, dont 2 en promo, image reprise de la photo
--    Unsplash de categorie faute d'ID individuels verifies)
-- ============================================

-- -- Boulangerie du Palais --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Baguette tradition', 1.20, 40, true, 'Pain', 'Baguette a l''ancienne, croute craquante et mie alveolee.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', true, 0.90, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000001', 'Pain de campagne', 2.80, 18, true, 'Pain', 'Pain au levain naturel, cuit au feu de bois.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000001', 'Croissant', 1.30, 30, true, 'Viennoiserie', 'Pur beurre, feuilletage maison.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', true, 0.95, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000001', 'Pain au chocolat', 1.40, 28, true, 'Viennoiserie', 'Deux barres de chocolat noir, pate feuilletee.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000001', 'Brioche', 4.50, 12, true, 'Viennoiserie', 'Brioche moelleuse au beurre, faconnage maison.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null);

-- -- Au Pain Doré --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000002', 'Baguette tradition', 1.20, 35, true, 'Pain', 'Baguette a l''ancienne, croute craquante et mie alveolee.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000002', 'Croissant', 1.30, 26, true, 'Viennoiserie', 'Pur beurre, cuisson au feu de bois.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', true, 0.95, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000002', 'Pain au chocolat', 1.40, 24, true, 'Viennoiserie', 'Deux barres de chocolat noir, pate feuilletee.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', true, 1.05, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000002', 'Brioche', 4.50, 10, true, 'Viennoiserie', 'Brioche moelleuse au beurre et aux oeufs frais.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000002', 'Fougasse', 3.20, 14, true, 'Pain', 'Fougasse aux herbes de Provence, fournil au feu de bois.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null);

-- -- Maison Lefort --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000003', 'Pain de campagne', 2.80, 16, true, 'Pain', 'Pain au levain naturel, recette familiale.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', true, 1.95, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000003', 'Croissant', 1.30, 22, true, 'Viennoiserie', 'Pur beurre, feuilletage maison.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000003', 'Pain au chocolat', 1.40, 20, true, 'Viennoiserie', 'Deux barres de chocolat noir, pate feuilletee.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000003', 'Brioche', 4.50, 9, true, 'Viennoiserie', 'Brioche moelleuse, recette de trois generations.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', true, 3.20, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000003', 'Fougasse', 3.20, 11, true, 'Pain', 'Fougasse aux herbes de Provence.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', false, null, null);

-- -- Épicerie des Halles --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000004', 'Moutarde de Dijon', 4.50, 30, true, 'Épicerie', 'Moutarde forte de Dijon, pot en gres.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', true, 3.20, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000004', 'Confiture', 5.20, 20, true, 'Épicerie', 'Confiture artisanale, fruits de Bourgogne.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000004', 'Huile d''olive', 9.90, 15, true, 'Épicerie', 'Huile d''olive vierge extra, premiere pression a froid.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', true, 6.90, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000004', 'Pâtes artisanales', 6.50, 18, true, 'Épicerie', 'Pates artisanales sechees lentement.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000004', 'Vinaigre de Bourgogne', 7.80, 12, true, 'Épicerie', 'Vinaigre de vin de Bourgogne, vieilli en fut de chene.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', false, null, null);

-- -- L'Épicerie Fine --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000005', 'Moutarde de Dijon', 4.50, 26, true, 'Épicerie', 'Moutarde forte de Dijon, pot en gres.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000005', 'Confiture', 5.20, 17, true, 'Épicerie', 'Confiture artisanale, fruits de Bourgogne.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', true, 3.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000005', 'Pâtes artisanales', 6.50, 16, true, 'Épicerie', 'Pates artisanales sechees lentement.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', true, 4.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000005', 'Vinaigre de Bourgogne', 7.80, 10, true, 'Épicerie', 'Vinaigre de vin de Bourgogne, vieilli en fut de chene.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000005', 'Huile d''olive', 9.90, 13, true, 'Épicerie', 'Huile d''olive vierge extra, premiere pression a froid.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', false, null, null);

-- -- Les Saveurs de Bourgogne --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000006', 'Tomates cerises (500g)', 3.20, 22, true, 'Fruits et légumes', 'Tomates cerises gorgees de soleil, circuit court.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', true, 2.20, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000006', 'Salade', 1.50, 25, true, 'Fruits et légumes', 'Salade fraiche du producteur.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000006', 'Fraises (barquette)', 3.50, 18, true, 'Fruits et légumes', 'Fraises de saison, barquette de 250g.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', true, 2.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000006', 'Pommes de terre (1kg)', 2.40, 30, true, 'Fruits et légumes', 'Pommes de terre de Bourgogne, sac de 1kg.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000006', 'Courgettes', 2.10, 20, true, 'Fruits et légumes', 'Courgettes fraiches du producteur local.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', false, null, null);

-- -- Primeur du Marché --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000007', 'Salade', 1.50, 24, true, 'Fruits et légumes', 'Salade fraiche du producteur.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000007', 'Fraises (barquette)', 3.50, 16, true, 'Fruits et légumes', 'Fraises de saison, barquette de 250g.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000007', 'Pommes de terre (1kg)', 2.40, 28, true, 'Fruits et légumes', 'Pommes de terre de Bourgogne, sac de 1kg.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', true, 1.70, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000007', 'Courgettes', 2.10, 19, true, 'Fruits et légumes', 'Courgettes fraiches du producteur local.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', true, 1.40, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000007', 'Melon', 3.80, 15, true, 'Fruits et légumes', 'Melon charentais bien mur.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', false, null, null);

-- -- Boucherie Gauthier --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000008', 'Entrecôte (200g)', 16.00, 14, true, 'Viande', 'Entrecote de boeuf maturee, origine locale.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', true, 12.00, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000008', 'Poulet fermier (entier)', 14.50, 10, true, 'Viande', 'Poulet fermier label rouge, eleve en plein air.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000008', 'Côtes d''agneau', 17.50, 12, true, 'Viande', 'Cotes d''agneau francais, a griller.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000008', 'Saucisses artisanales', 7.90, 20, true, 'Viande', 'Saucisses pur porc, recette maison.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', true, 5.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000008', 'Merguez', 6.50, 22, true, 'Viande', 'Merguez epicees, pur boeuf et agneau.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', false, null, null);

-- -- La Bonne Viande --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000009', 'Poulet fermier (entier)', 14.50, 9, true, 'Viande', 'Poulet fermier label rouge, eleve en plein air.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', true, 10.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000009', 'Côtes d''agneau', 17.50, 11, true, 'Viande', 'Cotes d''agneau francais, a griller.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', true, 12.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000009', 'Saucisses artisanales', 7.90, 18, true, 'Viande', 'Saucisses pur porc, recette maison.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000009', 'Merguez', 6.50, 20, true, 'Viande', 'Merguez epicees, pur boeuf et agneau.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000009', 'Entrecôte (200g)', 16.00, 13, true, 'Viande', 'Entrecote de boeuf maturee, origine locale.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', false, null, null);

-- -- La Cave à Fromages --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000010', 'Époisses', 8.50, 14, true, 'Fromage', 'Epoisses AOP, affinage en cave.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', true, 6.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000010', 'Comté 18 mois', 7.20, 16, true, 'Fromage', 'Comte affine 18 mois, note de noisette.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000010', 'Brie de Meaux', 6.50, 15, true, 'Fromage', 'Brie de Meaux AOP, a la coupe.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', true, 4.90, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000010', 'Chèvre frais', 4.20, 20, true, 'Fromage', 'Fromage de chevre frais, producteur local.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000010', 'Munster', 5.80, 12, true, 'Fromage', 'Munster fermier, croute lavee.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', false, null, null);

-- -- Fromagerie Bourguignonne --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000011', 'Comté 18 mois', 7.20, 17, true, 'Fromage', 'Comte affine 18 mois, note de noisette.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', true, 5.20, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000011', 'Chèvre frais', 4.20, 18, true, 'Fromage', 'Fromage de chevre frais, producteur local.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', true, 2.90, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000011', 'Munster', 5.80, 11, true, 'Fromage', 'Munster fermier, croute lavee.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000011', 'Époisses', 8.50, 13, true, 'Fromage', 'Epoisses AOP, affinage en cave.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000011', 'Brie de Meaux', 6.50, 14, true, 'Fromage', 'Brie de Meaux AOP, a la coupe.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800', false, null, null);

-- -- Cave des Ducs --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000012', 'Bourgogne Pinot Noir', 18.00, 24, true, 'Vin', 'Bourgogne rouge, Pinot Noir, appellation regionale.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', true, 13.00, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000012', 'Chablis', 22.00, 18, true, 'Vin', 'Chablis AOP, blanc sec et mineral.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000012', 'Gevrey-Chambertin', 38.00, 8, true, 'Vin', 'Gevrey-Chambertin, grand vin de garde.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', true, 28.00, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000012', 'Crémant de Bourgogne', 14.50, 20, true, 'Vin', 'Cremant de Bourgogne, methode traditionnelle.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000012', 'Mâcon blanc', 11.90, 22, true, 'Vin', 'Macon blanc, chardonnay rond et fruite.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', false, null, null);

-- -- Le Cellier Dijonnais --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000013', 'Chablis', 22.00, 16, true, 'Vin', 'Chablis AOP, blanc sec et mineral.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', true, 16.00, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000013', 'Crémant de Bourgogne', 14.50, 19, true, 'Vin', 'Cremant de Bourgogne, methode traditionnelle.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', true, 10.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000013', 'Mâcon blanc', 11.90, 21, true, 'Vin', 'Macon blanc, chardonnay rond et fruite.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000013', 'Bourgogne Pinot Noir', 18.00, 23, true, 'Vin', 'Bourgogne rouge, Pinot Noir, appellation regionale.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000013', 'Gevrey-Chambertin', 38.00, 7, true, 'Vin', 'Gevrey-Chambertin, grand vin de garde.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', false, null, null);

-- -- Poissonnerie de la Mer --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000014', 'Saumon frais (tranche)', 9.50, 16, true, 'Poisson', 'Saumon frais, tranche a la demande.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800', true, 6.90, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000014', 'Crevettes (500g)', 12.00, 14, true, 'Poisson', 'Crevettes roses cuites, calibre moyen.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000014', 'Dorade royale', 16.50, 10, true, 'Poisson', 'Dorade royale entiere, pechee du jour.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800', true, 12.00, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000014', 'Moules (1kg)', 6.90, 18, true, 'Poisson', 'Moules de bouchot, filet de 1kg.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000014', 'Saint-Jacques', 21.00, 8, true, 'Poisson', 'Noix de Saint-Jacques fraiches.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800', false, null, null);

-- -- Traiteur Duclos --
INSERT INTO products (shop_id, name, price, stock, available, category, description, image_url, is_promo, promo_price, promo_end_date) VALUES
  ('c0000000-0000-4000-8000-000000000015', 'Boeuf bourguignon (300g)', 12.00, 15, true, 'Traiteur', 'Boeuf bourguignon mijote, portion individuelle.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', true, 9.00, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000015', 'Quiche lorraine (part)', 4.50, 20, true, 'Traiteur', 'Quiche lorraine maison, part individuelle.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000015', 'Plateau charcuterie', 15.50, 9, true, 'Traiteur', 'Plateau de charcuterie pour 2 personnes.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', true, 11.50, now() + interval '7 days'),
  ('c0000000-0000-4000-8000-000000000015', 'Gratin dauphinois (portion)', 5.20, 17, true, 'Traiteur', 'Gratin dauphinois maison, portion individuelle.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', false, null, null),
  ('c0000000-0000-4000-8000-000000000015', 'Tarte aux légumes', 6.80, 12, true, 'Traiteur', 'Tarte aux legumes de saison.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', false, null, null);

COMMIT;

-- ============================================
-- 3. VÉRIFICATION
-- ============================================
SELECT
  s.name as magasin,
  COUNT(p.id) as nb_produits,
  COUNT(CASE WHEN p.is_promo = true THEN 1 END) as nb_promos
FROM shops s
LEFT JOIN products p ON p.shop_id = s.id
WHERE s.active = true
GROUP BY s.name
ORDER BY s.name;
