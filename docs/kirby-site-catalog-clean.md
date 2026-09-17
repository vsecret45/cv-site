# Catalogue : présentation commerciale allégée

## Audit avant modification

Aucun champ ajouté au SiteSpec : catalog, catégories, produits, offres, options,
prix initial/remisé, unité/lot, quantité du lot, disponibilité et médias existent.
Les transactions, la sauvegarde, le multipage et les identifiants sont réutilisés.

Le serveur local sur 8002 avait démarré le 17 septembre à 15:26:49, avant la
modification du modèle à 17:42:56. Son module serveur est chargé au démarrage ;
recharger le navigateur ne suffit pas. Redémarrage local effectué dans cette session.
Cette observation n'établit pas à elle seule la cause de chaque ancienne capture.

## Changements

- Résolution d'une contradiction dans les consignes : collection-grid utilise
  products pour le catalogue, et non des blocs image avec caractéristiques répétées.
- Cartes : média, nom, groupe de prix unique, lien discret. Les variantes,
  descriptions et disponibilités restent dans la fiche.
- Un lot affiche son prix et sa quantité ensemble ; aucun calcul unitaire ajouté.
  Une promotion conserve le prix initial barré. Aucun stock n'est fabriqué.
- Le bloc catalogue occupe la largeur de sa grille et ne reçoit plus le panneau
  décoratif avec ombre/verre. Les images des cartes ont un format comparable.
- Consignes et relecture OpenAI : pas de cours sur les lots, commentaires techniques,
  fausses pages de demande, prix dupliqués ou phrases expliquant la navigation.
- Direction photo guidée par le brief et les couleurs réelles, sans palette
  orange/beige imposée ni template sectoriel.

## Validation

30 tests unitaires réussis. Test navigateur NOVA réussi : catégories, navigation
vers les fiches, tailles, prix barré, absence de stock inventé, mobile/desktop,
rechargement et conservation du catalogue/brief après erreur de requête.
Capture examinée : /private/tmp/nova-collection.png.

Essai réel OpenAI sur quatre lots MINI STUDIO PRO : prix 270/240/330/180 EUR,
quantités 6/8/6/10, disponibilité fournie conservée, stock numérique inconnu,
cartes products et fiches dédiées, sans tableaux de calcul ni prix dupliqués.
Premier essai : 38,1 s hors images ; quelques phrases de remplissage ont conduit
à préciser les consignes et refaire l'essai. Aucune nouvelle image générée.

## Portée

Les anciens blocs éditoriaux sauvegardés ne sont pas convertis arbitrairement
par le renderer. Une demande de refonte à Kirby peut les migrer vers le catalogue
avec leurs données et médias. Les nouvelles consignes ne régénèrent pas les
anciennes images automatiquement. La diversité des futures images n'a pas été
validée par une nouvelle génération d'images dans cette session.

Second essai réel : 38,4 s hors images, assertions réussies. Les introductions
catalogue et fiches sont maintenant vides ; les noms ne sont plus répétés dans
les titres de section des fiches. Catalogue quatre produits et données exactes.
