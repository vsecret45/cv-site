# Kirby Générateur — implémentation et validation locale

16 septembre 2026. Aucun push, aucun déploiement, aucune modification de clé.

## Chaîne d’autorité

Le nouveau parcours de `index.html` utilise exclusivement `/api/kirby-site` :

1. OpenAI reçoit le SiteSpec courant complet, la conversation et les identifiants sélectionnés dans l’aperçu.
2. Il produit une création, des opérations de modification, une réponse ou une clarification structurées.
3. Une relecture OpenAI vérifie les répétitions sémantiques, la fidélité à la demande, les destinations et la conservation du contenu non ciblé. Elle approuve sans réémettre le document ou fournit une décision corrigée. Aucune déduplication éditoriale n’est exécutée par regex locale.
4. Le contrat vérifie structure, références, identifiants, couleurs, destinations sûres et révision. Une erreur technique est renvoyée au modèle pour correction bornée ; aucun template de secours ne remplace sa décision.
5. Les opérations s’appliquent sur une copie, atomiquement. Une erreur conserve le site précédent. Le navigateur revalide la décision avant sauvegarde et rendu.
6. Chaque page est rendue séparément par `site-preview.html?project=…&page=…`. Les liens interpages ne deviennent pas des ancres de l’accueil.

## Diff fonctionnel

| Avant | Maintenant |
|---|---|
| Ancien parcours partagé, filtres et décisions locales avant/après le modèle | Parcours Générateur isolé, contexte complet et décisions structurées |
| Pages descriptives rabattues vers une page unique | Contenu, sections et chemin propres à chaque page dans l’aperçu |
| Reconstructions globales possibles lors d’une modification | Opérations identifiées, baseRevision, déplacement sans réécriture et annulation |
| Descriptions artistiques réinterprétées | Enums exécutables pour composition, profondeur, surface, mouvement, image et palette |
| Cinq compositions globales | Huit assemblages de hero, six de contenu et une pile simple, sélectionnés par le modèle |
| Compléments/CTA pouvant être ajoutés localement | Seuls les contenus structurés sont rendus ; relecture sémantique par OpenAI |
| Deux emplacements médias dominants | Assets explicites et placements multiples, avec blocs graphiques/tableaux/métriques |

Le module `kirby-composition-engine.js` reprend sélectivement les géométries du commit `f55b8df`. Il ne reçoit ni brief, ni métier, ni seed. Aucun `resolvePlan`, hash, choix aléatoire, alias de secours ou réinsertion automatique des anciennes sections n’a été repris. Tous les slots fournis sont conservés une seule fois. Le responsive réorganise les contenus sans les cacher.

## Fichiers de cette intervention

- `api/kirby-site.js` : endpoint séparé, erreurs, limites de transport.
- `lib/kirby-site-model.js` : contexte, décisions, relecture, réparation technique, médias.
- `assets/kirby-site-contract.js` : SiteSpec, schémas stricts, références, transactions et signature média.
- `assets/kirby-site-editor.js` : conversation, sélection, annulation, application, médias progressifs.
- `assets/kirby-site-store.js` : sauvegarde IndexedDB indépendante.
- `assets/kirby-site-renderer.js` : pages, liens, blocs et paramètres visuels.
- `kirby-composition-engine.js` : assemblages visuels récupérés sélectivement.
- `assets/kirby-site.css` : styles exclusivement `ks-*` et aperçu isolé.
- `site-preview.html`, `assets/kirby-site-preview.js` : document d’aperçu multipage et sélection.
- `index.html` : activation explicite du nouveau parcours et chargement de ses modules.
- `script.js` : deux gardes désactivant les anciens gestionnaires Générateur sur cette entrée uniquement.
- `server.js` : import et branchement de `/api/kirby-site` uniquement. Les autres différences déjà présentes, notamment le choix de port, précèdent cette intervention.
- `vercel.json` : durée maximale de la seule nouvelle fonction, sans modification des fonctions existantes.
- `tests/fixtures/kirby-site.cjs` et trois fichiers `tests/unit/kirby-site-*.test.js` : contrat, contexte, revue, atomicité, destinations et rendu.

`api/kirby.js`, `style.css`, les modules/API de Kirby CV et de Kirby Flyer, les fichiers `.env` et les clés n’ont pas été modifiés. Les autres changements déjà présents dans le dépôt ont été conservés.

## Vérifications réelles

Tests effectués via le serveur local sur le port 8001, OpenAI avec la configuration existante, Chrome et agent-browser. Aucun métier de ces essais n’a été ajouté au code de compréhension.

### Atelier de maquettes tactiles pour musées

Création réelle de quatre pages et deux médias originaux. Vérifications des SiteSpec avant/après :

1. Raccourcir l’accueil : une seule section conservée ; les trois pages de détail, médias, design et navigation restent identiques.
2. Déplacer le déroulé vers « Préparer un projet » : section déplacée intacte, au bon emplacement, sans réécriture.
3. Retirer uniquement la photo de l’accueil : texte et boutons conservés, médias des autres pages inchangés.
4. Passer d’une ambiance lumineuse éditoriale à une ambiance technologique nocturne : toutes les chaînes de contenu, blocs, liens et identités de pages sont conservés ; seuls les choix artistiques/compositions changent.
5. Raccourcir « le premier bouton de l’accueil » : seul son libellé change ; sa destination reste identique. Annuler restaure exactement le document précédent, hors incrément de révision.

Navigation réellement cliquée vers Méthode : URL distincte et uniquement ses propres sections. Rechargement : quatre pages et deux médias restaurés. Panne réseau simulée : aucun changement du SiteSpec sauvegardé. Mobile 390 px : pas de débordement horizontal, sept blocs de la page détaillée présents et aucun masqué.

### Atelier itinérant de reliure

Monopage réel de deux sections, sans image ni glass. Une première génération comportait deux conversions équivalentes. Cette observation a conduit à ajouter la relecture OpenAI. Le nouvel essai complet avec relecture conserve un seul CTA de conversion dans le corps, plus un lien utile vers les formats. Pas de suppression de CTA par règle de chaînes.

### Coordination des répétitions musicales

Monopage réel, tableau de répétitions, métriques et graphique. Glass, perspective et panneaux superposés pilotés par les champs structurés ; aucune image générée. Un seul CTA de contact. Les trois panneaux restent présents sur mobile, sans débordement.

Les deux créations avec relecture ont pris environ 43 s et 35 s lors du test, hors médias (aucun demandé). Ces durées sont des mesures ponctuelles, pas une garantie.

### Ambiguïté

Une demande sans cible identifiable, « Change ce truc, tu vois lequel. », a produit `clarify` et une question ; le SiteSpec est resté identique. Les demandes précises précédentes n’ont pas été bloquées localement.

## Tests automatisés

- `node --test tests/unit/kirby-site-*.test.js` : 15 tests propres au nouveau parcours, tous réussis.
- `node --test tests/unit/*.test.js` : 678 tests réussis, aucun échec, sur la suite complète relancée après intégration.
- Vérifications de syntaxe des modules et `git diff --check`.
- Les anciens tests CV sont exécutés sans modification de leur code.

Les captures et SiteSpec de test sont conservés sous `tmp/kirby-site-verification/`. Ils servent de preuves locales, pas de templates de génération.

## Performance et limites restantes

Le texte et la navigation s’affichent avant les médias. Deux générations d’images peuvent travailler en parallèle ; les requêtes identiques en cours sont partagées, et les résultats obsolètes sont ignorés. Une modification de palette ne régénère pas une image dont l’asset est inchangé : seul un changement d’asset décidé par le modèle invalide son cache. La relecture ajoute un appel dépendant, assumé pour la qualité ; elle peut approuver sans réémettre tout le SiteSpec.

Le contexte n’est pas tronqué silencieusement : les limites de taille et de conversation sont explicites. Un projet dépassant ces limites est refusé sans altérer le document ; un mécanisme de contexte plus vaste reste à concevoir si nécessaire.

L’aperçu est sauvegardé dans le navigateur, pas publié comme un site autonome. Ses URLs nécessitent le projet dans ce navigateur. Aucun export/hébergement des sites générés ni migration des anciennes propositions vers ce nouveau contrat n’est ajouté ici.

La 3D est une composition CSS en perspective, pas une scène WebGL. La qualité artistique et la déduplication sémantique restent des décisions de modèle à éprouver sur d’autres demandes ; les tests ne prouvent pas une compréhension parfaite de tous les métiers. Safari/Firefox, la durabilité du stockage privé et la plateforme Vercel ne sont pas validés par ces essais Chrome locaux.

La séparation future des clés reste à faire, comme convenu. Aucun déploiement n’a été lancé.

## Correction après essai utilisateur sur le port 8000

Le premier rapport testait le serveur 8001, alors que le serveur 8000 resté actif ne connaissait pas `/api/kirby-site` (GET 404, POST 405). Une ancienne règle `display:none` de la coque masquait en outre le statut du nouveau générateur tant qu’aucune proposition n’existait. Cela donnait l’impression que le bouton ne faisait rien.

Correction : redémarrage du serveur 8000 sur le code actuel ; règle CSS limitée au nouveau Générateur pour afficher progression, clarification et erreur dès la première demande ; bouton « Kirby travaille… », défilement vers le résultat et erreur lisible lorsque le serveur retourne du texte au lieu de JSON. Cache des deux assets modifiés renouvelé dans index.html.

Régression reproduite dans Chrome sur 8000 : erreur 405 simulée désormais visible (`display:block`), bouton réactivé après échec ; appel réel du brief d’architecture intérieure lancé ensuite avec progression visible. Aucun changement CV/Flyer ni de clé.

Résultat réel sur 8000 : proposition reçue et iframe d’aperçu affichée ; les médias sont générés progressivement après le site. Le test a également nécessité une réparation technique par le modèle, ce qui a allongé son traitement.

## Restauration de la présentation du Générateur

Après comparaison avec les captures utilisateur, l’écran de chargement existant est réutilisé (classes de l’anneau, barre animée et chronomètre), sans réactiver l’ancien pipeline de compréhension. Les gros panneaux clairs de statut/conversation/édition sont supprimés ; l’historique est repliable et le champ de modification reprend une présentation sombre.

L’aperçu de la page courante reste masqué jusqu’à la disponibilité de ses médias. Les médias de cette page sont prioritaires ; les autres continuent en arrière-plan. En cas d’échec, un message et « Réessayer les visuels » remplacent l’attente indéfinie. Le voile des compositions immersives suit maintenant la surface réellement choisie : une surface ink n’utilise plus le voile canvas opposé au texte.

Contrôles Chrome : anneau visible, compteur actif, conversation et composer masqués pendant génération ; erreur réseau toujours visible ; panne média simulée avec iframe masquée puis réessai réussi (iframe visible, aucun média manquant) ; projet photographique réel rechargé avec ses images et contraste inspecté. Les 15 tests ciblés réussissent. Les fichiers servis sur 8002 correspondent aux corrections locales. Aucun changement de l’API, de clé, de CV ou de Flyer pour cette restauration visuelle.

## Ajustements UX du 17 septembre

La grille des huit services est déplacée d’index.html vers prestations.html, avec destinations conservées ou reliées aux rubriques existantes. Les trois accès de création restent sur l’accueil. Un lien Accueil est ajouté au Générateur et à la présentation de cv.html ; aucune logique CV/Flyer n’est modifiée.

L’éditeur conserve le sélecteur de page et un lien Aperçu ouvrant site-preview.html dans un onglet autonome. Annuler, Effacer la sélection (uniquement si sélection active) et Nouveau projet sont regroupés dans Projet. Nouveau projet demande confirmation et conserve l’ancien projet en IndexedDB.

La hauteur de l’iframe suit le contenu via ResizeObserver/postMessage, avec contrôle origine/source/projet. Les unités de hauteur du rendu embarqué suivent le viewport parent pour éviter une croissance circulaire. Les bordures sont incluses dans la hauteur, les ancres sont relayées au défilement parent, et la conversation n’a plus de scroll interne. Le menu est placé au-dessus de l’iframe malgré les anciennes règles de superposition de la coque.

Vérifications Chrome sur 8002 avec un projet de contrôle isolé, sans appel IA : six sections longues puis une page courte indépendante ; débordement vertical interne mesuré à zéro ; largeur mobile 390 px sans débordement horizontal ; sélection, ouverture réelle du menu et désélection ; confirmation annulée conservant le projet ; acceptation via événement DOM créant un nouvel identifiant avec ancien projet conservé ; aperçu ouvert réellement dans un onglet sans éditeur ; huit services présents et ancres de destination existantes. Les 15 tests ciblés contrat/modèle/rendu et les contrôles de syntaxe passent ; git diff --check passe.

Une instruction générale sur le parcours client concret est ajoutée uniquement au prompt du Générateur, sans exemple sectoriel ni changement de schéma. Elle nécessite un redémarrage du processus Node existant pour être chargée ; aucun nouvel appel OpenAI n’a été effectué pour cette correction UX. Aucun push ni déploiement.

## Simplification après retour sur la seconde maquette

Suppression de la barre au-dessus du rendu : les commandes existantes restent disponibles dans « Options du site », replié sous le site, avec la conversation. L’iframe est sans bordure ni arrondis ajoutés par l’éditeur. Dans l’aperçu autonome, « × Retour à Kirby » ferme l’onglet lorsqu’autorisé par le navigateur, sinon rejoint l’accueil du Générateur. Aucun changement du contenu ou de la navigation générés.

Le pool média passe de deux à quatre requêtes concurrentes, en gardant la priorité de la page courante, le cache par signature, le modèle et la qualité existants. Aucun appel réel de génération n’a été lancé pour chronométrer ce changement : le gain de durée reste à mesurer et dépend du fournisseur. Aucune réduction de contenu ou de validation sémantique.

Les bandes de médias vertical-narrative utilisent les colonnes effectivement occupées ; une image unique ne reste plus dans le premier tiers d’une grille vide. Une composition story-chapters sans colonne de texte utilise toute la largeur. L’espacement airy reste distinct mais passe de 10 à 6 rem maximum sur ordinateur.

Contrôles navigateur sur 8002, projet de test isolé : iframe premier élément visible, options repliées, débordement interne zéro ; changement vers la page détail ; ouverture réelle de l’aperçu sans éditeur puis fermeture de son onglet via le bouton ; image unique mesurée à 1152 px dans une bande de 1152 px. Les 15 tests ciblés passent et git diff --check est propre. Fichiers de cette correction : index.html (cache), assets/kirby-site-editor.js, assets/kirby-site-preview.js, assets/kirby-site.css et ce rapport. Aucun changement CV/Flyer/API/clé, aucun déploiement.
