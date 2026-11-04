const VALIDATION_NOTICE = `⚠️ Document en cours de validation juridique — ces mentions sont provisoires et seront mises à jour avant le lancement commercial de CareCycle.\n\n`;

export const LEGAL_CONTENT = {
  cgv: {
    title: 'Conditions Générales de Vente',
    body: VALIDATION_NOTICE + `Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre les pharmacies et parapharmacies partenaires inscrites sur la plateforme CareCycle et les clients passant commande via l'application. En validant une commande, le client accepte sans réserve l'intégralité des présentes conditions.

Article 1 — Objet. CareCycle est une plateforme de lutte contre le gaspillage dans le secteur de la parapharmacie. Elle met en relation des pharmacies et parapharmacies partenaires avec des clients souhaitant acquérir des produits à date de péremption courte (DLC courte) à prix réduit. CareCycle agit en tant qu'intermédiaire technique et n'est pas partie au contrat de vente, qui se forme directement entre la pharmacie partenaire et le client.

Article 2 — Commandes. Toute commande passée via l'application est définitive dès sa confirmation par la pharmacie. Les produits proposés, leurs prix, leur disponibilité, leurs descriptions et leurs dates de péremption relèvent de la seule responsabilité de la pharmacie qui les publie. Les prix sont affichés en euros, toutes taxes comprises.

Article 3 — Paiement. Le règlement s'effectue via le paiement intégré à l'application. Les données bancaires sont traitées par un prestataire de paiement certifié PCI-DSS et ne sont jamais stockées par CareCycle ou par la pharmacie partenaire.

Article 4 — Retrait en pharmacie. CareCycle propose exclusivement le retrait en pharmacie (Click & Collect) — aucune livraison à domicile n'est proposée. Le client retire sa commande au comptoir de la pharmacie partenaire en présentant son code de retrait unique. En cas d'absence prolongée après la mise à disposition, la pharmacie peut annuler la commande.

Article 5 — Annulation et remboursement. Toute commande peut être annulée par le client tant qu'elle n'a pas été acceptée par la pharmacie. Une fois la préparation commencée, l'annulation n'est plus possible. Les produits à DLC courte ne sont ni repris ni remboursés une fois la commande retirée, sauf non-conformité avérée du produit.

Article 6 — Responsabilité. CareCycle ne saurait être tenue responsable de la qualité ou de la conformité des produits vendus par les pharmacies partenaires. Les produits commercialisés via CareCycle sont des produits de parapharmacie légalement commercialisables dont la date de péremption est proche mais non dépassée.

Article 7 — Litiges. Tout litige relatif à une commande doit être adressé en priorité à la pharmacie concernée ou au support CareCycle via l'application. À défaut de résolution amiable, le litige relève des tribunaux compétents.

Article 8 — Modification des CGV. CareCycle se réserve le droit de modifier les présentes CGV à tout moment. Les modifications entrent en vigueur dès leur publication dans l'application.`,
  },
  cgu: {
    title: "Conditions Générales d'Utilisation",
    body: VALIDATION_NOTICE + `Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles d'accès et d'usage de l'application CareCycle, destinée aux pharmacies partenaires et aux clients. L'utilisation de l'application implique l'acceptation pleine et entière des présentes CGU.

Article 1 — Accès au service. L'application CareCycle est accessible gratuitement à toute personne disposant d'un terminal compatible et d'une connexion internet. Certaines fonctionnalités, notamment la gestion des offres côté pharmacie, nécessitent la création d'un compte et la validation de l'établissement.

Article 2 — Compte utilisateur. Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion. Toute activité réalisée depuis un compte est présumée effectuée par son titulaire. En cas de suspicion d'utilisation frauduleuse, l'utilisateur doit en informer CareCycle sans délai.

Article 3 — Compte pharmacie. L'inscription en tant que pharmacie partenaire nécessite la fourniture d'informations exactes (raison sociale, numéro FINESS ou SIRET, adresse, coordonnées bancaires). CareCycle se réserve le droit de vérifier ces informations et de suspendre tout compte fournissant des données inexactes.

Article 4 — Comportement attendu. Les utilisateurs s'engagent à utiliser l'application conformément à sa destination anti-gaspillage, à ne pas publier de contenu illicite, et à respecter les autres utilisateurs ainsi que les pharmacies partenaires.

Article 5 — Contenu publié par les pharmacies. Les pharmacies sont seules responsables des photos, descriptions, prix et dates de péremption qu'elles publient. CareCycle se réserve le droit de retirer tout contenu non conforme aux présentes CGU ou à la réglementation pharmaceutique applicable.

Article 6 — Propriété intellectuelle. L'ensemble des éléments composant l'application (logo, charte graphique, code source, base de données) est la propriété exclusive de CareCycle et ne peut être reproduit sans autorisation préalable.

Article 7 — Disponibilité du service. CareCycle s'efforce d'assurer un accès continu à l'application mais ne garantit pas une disponibilité ininterrompue. Des interruptions peuvent survenir pour maintenance, mise à jour ou cas de force majeure.

Article 8 — Résiliation. CareCycle peut suspendre ou supprimer tout compte ne respectant pas les présentes CGU, après notification préalable sauf en cas de manquement grave nécessitant une action immédiate.

Article 9 — Droit applicable. Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux français.`,
  },
  privacy: {
    title: 'Politique de confidentialité',
    body: `Dernière mise à jour : juillet 2026. CareCycle attache une grande importance à la protection des données personnelles de ses utilisateurs, conformément au Règlement Général sur la Protection des Données (RGPD — règlement UE 2016/679) et à la loi Informatique et Libertés modifiée.

1. Données collectées.
   • Tous les utilisateurs : nom, prénom, adresse e-mail, numéro de téléphone, mot de passe (haché), photo de profil (facultative), historique et contenu des commandes, avis laissés, jeton de notification push, données de localisation lorsque l'utilisateur y consent (pour afficher les pharmacies à proximité), et photos prises via l'appareil (scan de QR code de retrait).
   • En cas de connexion via Google ou Facebook : nom, adresse e-mail et photo de profil transmis par ces services, dans la limite des autorisations accordées lors de la connexion.
   • Pharmacies et parapharmacies partenaires : raison sociale, numéro FINESS ou SIRET, adresse de l'établissement, photos et descriptions de produits (pouvant être générées ou retouchées avec assistance de l'IA à la demande du commerçant), ainsi que les coordonnées bancaires nécessaires au versement des ventes (nom du titulaire, IBAN, BIC) — ces coordonnées sont stockées avec un accès strictement restreint dans notre base de données à seule fin de procéder aux versements et ne sont jamais utilisées à d'autres fins ni transmises à des tiers hors obligation légale.

2. Finalités et base légale du traitement. Chaque traitement repose sur une base légale précise :
   • Exécution du contrat (article 6.1.b RGPD) : gestion du compte, mise en relation pharmacie/client, traitement et suivi des commandes, paiement, retrait en pharmacie, versement des ventes aux pharmacies partenaires.
   • Obligation légale (article 6.1.c) : conservation des factures et données comptables pour la durée légale.
   • Intérêt légitime (article 6.1.f) : amélioration du service (y compris l'assistance à la rédaction de fiches produit), prévention de la fraude, statistiques d'usage anonymisées.
   • Consentement (article 6.1.a) : géolocalisation, notifications push, connexion via Google/Facebook — retirable à tout moment dans les réglages de l'appareil ou du compte.
   Aucune donnée n'est vendue à des tiers à des fins commerciales.

3. Durée de conservation. Les données de compte sont conservées tant que le compte est actif, puis supprimées dans les 30 jours suivant une demande de suppression (voir point 7). Les données de facturation et bancaires sont conservées 10 ans conformément aux obligations comptables (article L123-22 du Code de commerce). Les données de géolocalisation ne sont jamais conservées au-delà de la session en cours.

4. Sous-traitants et destinataires des données. CareCycle fait appel aux sous-traitants suivants, chacun lié par un contrat de sous-traitance conforme à l'article 28 du RGPD :
   • Supabase (hébergement base de données, authentification, stockage des fichiers) — hébergement UE.
   • Stripe (traitement des paiements, certifié PCI-DSS) — CareCycle ne transmet jamais les données de carte bancaire ; les coordonnées bancaires des pharmacies (IBAN/BIC) sont en revanche stockées par CareCycle, comme précisé au point 1.
   • Resend (envoi des e-mails transactionnels : code de vérification, confirmation de commande, réinitialisation de mot de passe).
   • Expo / EAS (infrastructure technique de l'application mobile — notifications push, mise à jour de l'application).
   • Anthropic (génération assistée par IA des descriptions de produit, à la demande des pharmacies partenaires) et PhotoRoom (génération/retouche IA de visuels produit) — ces traitements ne portent que sur les photos et informations produit fournies par les pharmacies, jamais sur des données personnelles de clients.
   • Google et Meta (Facebook) — fournisseurs d'identité lorsque l'utilisateur choisit de se connecter via Google Sign-In ou Facebook Login.
   Les données nécessaires à l'exécution d'une commande (code de retrait, contenu du panier) sont partagées avec la pharmacie partenaire concernée.

5. Droits des utilisateurs. Conformément au RGPD, chaque utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de ses données, ainsi que du droit de définir des directives post-mortem. Ces droits peuvent être exercés à tout moment via les paramètres du compte ou en écrivant à privacy@carecycle.app. En cas de réponse insatisfaisante, chaque utilisateur peut introduire une réclamation auprès de la CNIL (www.cnil.fr).

6. Contact / Délégué à la protection des données (DPO). Pour toute question relative à vos données personnelles ou pour exercer vos droits : privacy@carecycle.app.

7. Suppression du compte. Pour supprimer définitivement votre compte, envoyez une demande à privacy@carecycle.app (ou support@carecycle.app) depuis l'adresse e-mail associée à votre compte. Votre profil, vos favoris et vos avis sont supprimés sous 30 jours. Les données que nous devons légalement conserver (factures, coordonnées bancaires, historique de commandes à des fins comptables) sont conservées pendant la durée légale requise (voir point 3), puis supprimées ou anonymisées.

8. Sécurité. CareCycle met en œuvre des mesures techniques et organisationnelles appropriées (chiffrement des données en transit via TLS/HTTPS, contrôle d'accès par rôle, authentification forte, restriction stricte de l'accès aux données bancaires au seul personnel autorisé et aux seules fins de versement) pour protéger les données contre tout accès non autorisé, avec une vigilance particulière sur les coordonnées bancaires des pharmacies partenaires.

9. Identifiants techniques. L'application utilise uniquement des identifiants techniques nécessaires à son fonctionnement (session, préférences, jeton de notification). Aucun traceur publicitaire tiers n'est utilisé.`,
  },
  legalNotice: {
    title: 'Mentions légales',
    body: VALIDATION_NOTICE + `Édition de l'application. L'application CareCycle est éditée par la société CareCycle SAS — informations d'immatriculation en cours de finalisation.

Mission. CareCycle est une plateforme dédiée à la lutte contre le gaspillage dans le secteur de la parapharmacie. Elle permet aux pharmacies et parapharmacies partenaires de valoriser leurs produits à DLC courte auprès de leurs clients via un système de Click & Collect.

Contact. Pour toute question relative à l'application : contact@carecycle.app

Support utilisateurs : support@carecycle.app

Protection des données : privacy@carecycle.app

Hébergement. L'application et les données associées sont hébergées par des prestataires d'hébergement cloud situés dans l'Union Européenne, garantissant la conformité avec la réglementation européenne en matière de protection des données personnelles.

Propriété intellectuelle. L'ensemble des contenus présents sur l'application CareCycle (textes, images, logos, icônes, structure) sont protégés par le droit de la propriété intellectuelle. Toute reproduction sans autorisation expresse de CareCycle est interdite.

Médiation. Conformément à la réglementation en vigueur, tout client consommateur peut recourir gratuitement à un médiateur de la consommation en cas de litige non résolu avec une pharmacie partenaire.`,
  },
};
