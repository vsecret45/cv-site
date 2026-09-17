# Composition commerciale : contrôle LUMÉA LAB

## Causes vérifiées

- product-stage réservait une colonne texte centrée verticalement à côté d'une
  scène pouvant contenir un catalogue entier et plusieurs images : grand vide
  au-dessus de la copie, catalogue étroit et scène inclinée.
- Les cartes forçaient un ratio 3/4 même pour des images carrées ou paysage,
  avec object-fit:contain et un fond de cadre : bandes façon carte postale.
- Une copie vide produisait quand même un placement et pouvait réserver une colonne.
- Une fiche pouvait répéter son image dans la scène puis dans la galerie.

## Correction du moteur existant

Aucun champ SiteSpec ajouté. Les listes productIds permettent déjà des routines
et sélections ordonnées indépendantes des catégories ; les attributs peuvent
conserver le contenu d'un coffret.

Dans les compositions de scène, les blocs products sont rendus une fois dans
un emplacement pleine largeur, hors perspective. Le texte démarre en haut.
Les copies vides ne créent plus d'emplacement. Les photos de catalogue respectent
le ratio de l'asset, sans bordure ni padding ni masque hérité de la scène.
Les références média déjà présentes dans la sélection explicite de produits ne
sont pas répétées comme grands médias décoratifs dans la même scène.
Les petites sélections ne montrent pas de filtre global de catégories.
Le contraste des blocs catalogue sur surface ink est corrigé.

Le moteur conserve données, liens, sauvegarde et compositions existants.
Les anciens blocs image/table ne sont pas arbitrairement convertis en produits.

## Validation

33 tests unitaires réussis avant la dernière vérification complète.
Test navigateur de reproduction : scène spatiale avec catalogue, contrôlée à
1440, 900 et 390 px. Catalogue pleine largeur, sans rotation, sans cadre ajouté,
ratios conservés, aucune colonne de copie vide ni débordement d'image.

Essai réel LUMÉA LAB : cinq offres exactes, 49/42/55/29/105 EUR, formats fournis,
coffret avec contenu sérum/crème/nettoyant, parcours routines liés aux fiches.
Huit pages contrôlées à 1440 et 390 px : pas de débordement, une galerie par fiche,
liens produits actifs, absence de stock fictif. Captures après animations examinées.

Création/relecture : 160,6 s ; six images en parallèle : 84,7 à 91,4 s chacune.
Ce script de contrôle lance les images après relecture, contrairement au
préchauffage de l'application : ce n'est pas un comparatif de vitesse avant/après.
Les images sont illustratives. Aucun paiement, commande ou contact inventé.

Projet de contrôle séparé : tmp/kirby-perf/lumea-open.html. Son ouverture importe
une seule fois le projet et préserve les autres projets ainsi que ses éditions
ultérieures. Les modifications CSS bénéficient aussi aux catalogues existants.
