# Correction restauration — 17 septembre 2026

## Cause reproduite avant modification

La section `#kirby-assistant` portait la classe `reveal-section` : opacité initiale 0, jusqu’à ce que l’IntersectionObserver du site voie 14 % de la section. Après restauration d’un long site dans une iframe ajustée à son contenu, ce seuil peut dépasser la hauteur de la fenêtre et devenir impossible à atteindre. Le projet était bien restauré, le formulaire masqué parce qu’un site existait, et le mode était `ready`, mais tout le conteneur restait invisible.

Reproduction sur `127.0.0.1:8002/#kirby-assistant`, navigateur isolé, avant/après sur le même projet : section de **6 271 px**, iframe présente, mode `ready`, opacité **0 avant / 1 après**. Une première restauration courte de 2 180 px n’avait pas déclenché le défaut : il dépend de la hauteur et de l’ordre d’initialisation.

Le stockage de Campus Pixel dans le Chrome personnel n’a pas pu être inspecté : l’inventaire disponible n’exposait aucun navigateur contrôlable. Aucune conclusion de perte de ce projet n’est tirée. Les vérifications de données ont été faites dans un navigateur de test indépendant, sans afficher de brief, image ou secret.

## Persistance et défauts annexes

- Avant correction : `localStorage['kirby-site-project-v1']` désigne le projet actif ; IndexedDB `kirby-sites-v1`, object store `projects`, conserve SiteSpec, conversation interne, historique et médias. Aucun usage de sessionStorage par ce parcours.
- Lecture localStorage non protégée au démarrage ; état restauré non normalisé hors SiteSpec ; pas de limite d’attente IndexedDB ; pas de marqueur d’interruption.
- Un nouveau projet pouvait devenir actif avant confirmation de sa sauvegarde.

## Correction limitée au cycle de restauration

- Retrait de `reveal-section` uniquement sur le Générateur, sans modifier l’animation des autres sections ni le design.
- Coque/formulaire rendus avant la lecture asynchrone ; accès au pointeur protégé, attente IndexedDB bornée et message/fallback en cas d’échec.
- Validation et normalisation du projet actif. Aucun parcours de la liste des autres projets.
- Point de récupération `last-valid:<identifiant actif>` enregistré atomiquement avec chaque sauvegarde valide. Copie compacte sans médias ; si utilisée, les médias manquants peuvent être régénérés. Les anciennes révisions ne sont récupérées que si elles appartiennent au même identifiant de site.
- Pointeur d’un nouveau projet changé après validation et sauvegarde réussie. Une sauvegarde invalide est rejetée avant écriture.
- Marqueur local `kirby-site-pending-v1`, limité à identifiant/date, avant appel IA. Après fermeture : message explicite et dernier état valide. Le serveur n’offre pas de job adressable permettant de reprendre une décision en cours : elle n’est donc pas prétendue reprise. Les médias manquants du SiteSpec déjà validé restent récupérables par le parcours existant.
- Page consultée mémorisée ; retour à l’accueil du même site si elle n’existe plus.

Fichiers : `index.html`, `site-preview.html` (version de ressource), `assets/kirby-site-editor.js`, `assets/kirby-site-store.js`, `tests/browser/kirby-site-restoration.cjs`, ce rapport. Aucun changement à CV, Flyer, API, direction artistique, modèles ou clés.

## Validation

Tests navigateur reproductibles, sans appel IA :

1. Site long restauré visible.
2. Fermeture réelle de l’onglet, réouverture sur le même origin et restauration.
3. Demande interrompue : message et site valide restauré.
4. Projet actif absent : formulaire, sans substitution d’un autre projet enregistré.
5. Première génération interrompue : formulaire et message.
6. Document principal corrompu : point de récupération du même projet.
7. Projet irrécupérable : formulaire et message, aucune suppression des données.
8. Écriture invalide rejetée, sauvegarde valide conservée.
9. Échec de sauvegarde d’une modification valide : ancien SiteSpec toujours présent après reload.
10. Stockage indisponible au démarrage : interface utilisable, pas d’écran vide.

Commande : `AGENT_BROWSER_CLI=<chemin installé du CLI> node tests/browser/kirby-site-restoration.cjs` ; URL par défaut port 8002, configurable via `KIRBY_TEST_URL`. Tests unitaires Générateur : 20 réussis. Vérifications syntaxiques et `git diff --check` réussies.

La fermeture testée est celle d’un onglet dans un contexte navigateur conservant IndexedDB ; aucun effacement volontaire de stockage ou changement de port ne peut restaurer des données désormais absentes. Aucune donnée utilisateur effacée, aucun push/déploiement.
