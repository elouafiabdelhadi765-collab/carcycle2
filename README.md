# CareCycle — Anti-Gaspillage en Pharmacie & Parapharmacie

Plateforme web réactive dédiée à la valorisation des invendus et produits à date courte (DLC) des pharmacies et parapharmacies d'officine (Dijon et métropole).

## Fonctionnalités Principales

### 🌿 Espace Patient / Client
- **Découverte Anti-Gaspillage** : Explorer les soins du visage, corps, capillaires, solaires, compléments alimentaires et bébé/maternité à dates courtes (J-15, J-7, J-3) remisés de -30% à -70%.
- **Recherche & Filtres Avancés** : Filtrage par rayon, laboratoire (Avène, La Roche-Posay, Caudalie, Bioderma, Nuxe...), discount minimum et urgence DLC.
- **Fiches Officines Partenaires** : Consultation des pharmacies titulaires, agrément ARS, numéro RPPS, horaires d'ouverture hebdomadaires et avis vérifiés.
- **Panier Groupé & Click & Collect** : Réservation instantanée par officine, application de codes promotionnels (`WELCOME10`, `ZEROGASPI`), estimation du CO₂ économisé.
- **Pass Retrait Sécurisé** : Génération immédiate d'un code de retrait (#CC-XXXX) et d'un QR Code à présenter au comptoir de la pharmacie.
- **Suivi d'Impact Écologique** : Compteur personnel des euros économisés, kg de CO₂ évités et produits sauvés de la destruction.

### 🩺 Espace Pharmacien / Officine
- **Tableau de Bord KPI** : Chiffre d'affaires revalorisé, commandes du jour, alertes DLC urgentes et impact environnemental en direct.
- **Validation Retrait Comptoir** : Saisie du code patient ou scan pour valider la délivrance en moins de 10 secondes avec horodatage et signature du praticien.
- **Gestionnaire d’Urgence DLC** : Alertes automatiques aux paliers J-15, J-7 et J-3 avec application en un clic de remises incitatives autorisées.
- **Gestion du Catalogue & Stock** : Ajout et mise à jour des soins avec codes CIP pharma (7 chiffres), codes EAN-13, numéros de lot et stocks restants.
- **Affiche Comptoir A4 Imprimable** : Génération de l'affiche officielle CareCycle avec QR Code pour inviter les patients de l'officine à suivre les invendus.
- **Paramètres de l'Officine** : Configuration des numéros RPPS, agréments ARS, horaires d'ouverture et coordonnées de reversement bancaire.

## Architecture & Technologies
- **Frontend** : React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti
- **Build System** : Vite avec support ESM natif (`npm run dev` sur le port 3000, `npm run build`)
- **State Management** : Zustand avec persistance `localStorage`
