# NOVA — catalogue et reprise après échec

17 septembre 2026. Modification limitée au générateur Site, sans déploiement ni changement de clés/CV/Flyer.

## Diagnostic observé

La capture de l'utilisateur ne contient pas le détail serveur : la cause exacte de ses deux échecs ne peut pas en être déduite. La conservation de l'ancien site est le comportement transactionnel voulu.

Reproduction réelle de NOVA depuis un SiteSpec existant : premier appel bloqué par `duplicate primary intent` entre introduction et grille d'une même collection. Réparation réussie, total 75,78 s. Après extension catalogue, autre blocage `misplaced primary intent` entre collection et fiche. Réparation réussie, total 117,55 s. Ces contraintes confondaient répétition de contenu et étapes complémentaires d'un parcours produit.

Le validateur conserve les références d'intention et leur page de référence, mais ne limite plus leur participation à une seule section/page. La relecture OpenAI reste responsable de la répétition sémantique. Validation des identifiants, références, liens sûrs, révisions et transactions conservée.

Les erreurs API renvoient une référence corrélée aux logs et un code borné, sans transmettre les détails fournisseur. La demande en attente/échouée reste disponible après reload, séparée du SiteSpec et liée au projet actif. Une réussite efface ce brouillon. Les autres projets ne sont pas sélectionnés comme repli.

## Extension réutilisant le système existant

Catalogue nullable : catégories hiérarchiques, produits, offres, options, prix en unités mineures (centimes), prix promotionnel distinct, devise, unité/lot, quantité par lot, SKU/stock inconnus null, disponibilité inconnue, références aux assets, attributs, livraison, sources textuelles et indicateur de démonstration.

Opérations atomiques put/remove_product et put/remove_category. Blocs products référencent le catalogue, avec catégorie optionnelle et filtre de soldes dynamique. Les fiches utilisent les pages cibles existantes. Sélecteurs d'options, prix, promotions et disponibilité proviennent des offres ; les cartes mènent aux fiches. Les fichiers v1 sans catalogue restent acceptés et ne sont pas réécrits lors de leur lecture.

Les offres groupées peuvent porter plusieurs options seulement sans SKU/stock spécifique ; des données de variante précises nécessitent une combinaison explicite. Aucun paiement, commande, réservation de stock ou indicateur de ventes ajouté.

## Vérifications

- 28 tests unitaires : validation de promotions/lots, références, transaction, conservation des anciens documents, palette, collections soldées dynamiques, codes d'erreur non sensibles, tests existants.
- 10 scénarios navigateur de restauration existants réussis.
- Navigateur NOVA isolé : six cartes, prix initial/remisé Noa, navigation vers fiche, sélection taille 42, absence de stock inventé, largeurs 1200/390 px sans débordement, reload, panne conservant catalogue et texte de relance.
- Appels OpenAI réels : Alba à 79 € en 5,47 s sur le catalogue nettoyé, pages/design/assets inchangés ; Alma à -20 % en 7,45 s conserve 169 € et produit 135,20 €, pages inchangées. Ces changements de test ne sont pas appliqués au projet livré.
- Les sept images ont été générées via le pipeline existant à qualité inchangée. Cet essai a séparé diagnostic, normalisation et images : il ne constitue pas une mesure de vitesse de génération standard.

## Projet livré

`tmp/kirby-perf/nova-state.json` contient NOVA aux prix et variantes demandés avec sept médias. `tmp/kirby-perf/nova-open.html` importe dans le navigateur un projet dédié et le sélectionne, sans effacer l'ancien projet. S'il a déjà été importé, ce lien réouvre sa version sauvegardée sans écraser les modifications ultérieures.

## Limites explicites

Les photos NOVA sont des illustrations générées, pas des photographies des pièces réelles. L'import de fichiers/photos et leur provenance applicative persistante restent à implémenter : sources contient ici des extraits de texte, pas une preuve automatique. Les garanties de fidélité sont fondées sur instructions, relecture et tests, pas sur une extraction indépendante de toute donnée commerciale.

Pas de panier connecté, de paiement, de gestionnaire de commandes ni de statistiques de ventes. Les anciennes pages ne sont pas automatiquement converties en catalogue. Le serveur Node déjà lancé doit être redémarré pour charger le nouveau contrat et les nouvelles instructions.
