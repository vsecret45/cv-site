# Temps total — lot de cinq images, 17 septembre 2026

## Diagnostic avant modification

Le code n’exécutait pas cinq images séquentiellement : il avait **deux limites à quatre** (file des appels et workers de consommation), et le préchargement ne lançait que quatre médias. Le cinquième devait attendre la fin d’une première image. Avec des images à ~96 s, cette deuxième vague pouvait ajouter presque un temps d’image complet.

La décision du SiteSpec précède les images. Le préchargement démarre après validation technique du candidat, pendant la relecture sémantique ; celle-ci n’attend aucune image. Les sauvegardes suivent les réponses et sont attendues avant de confirmer leur disponibilité. Le décodage JSON et la validation n’expliquent pas les minutes observées.

Dans les captures Voltline : décision et relecture cumulées **59,071 s**, dont relecture **8,772 s** ; un appel image **95,851 s**, suivi de **0,266 s** de lecture/décodage. L’utilisateur mesure un total d’environ **245 s**. Les captures Campus Pixel affichent d’autres durées : elles ne sont pas attribuées à Voltline. Les cinq durées individuelles de Voltline ne sont pas disponibles dans les fichiers de logs accessibles ; elles ne sont donc pas inventées.

Aucun retry automatique dans l’appel fournisseur d’image lui-même. Une promesse de préchargement rejetée était cependant retirée du cache et pouvait être redemandée lors du rendu validé. Côté texte, une réparation technique est autorisée ; les pannes de transport ne relancent pas une reconstruction.

## Changements, sans toucher au design

- Limite commune de **six** pour la file, le préchargement et les workers. Les cinq visuels indépendants partent dans une seule vague, sans parallélisme illimité.
- Une image préchargée en échec reste mémorisée jusqu’à la fin du lot : pas de retry implicite. La relance explicite existante reste disponible.
- Logs corrélés par `runId`, et par `assetId` pour chaque image : attente en file, début, fin, `ai_image`, `image_read_decode`, nombre de tentatives, `image_batch`, `generation_total`.
- Horodatages serveur `startedAt` / `at` pour vérifier le chevauchement. Les totaux de lot et de parcours sont dans la console navigateur ; les durées fournisseur sont également dans le terminal Node. Le total navigateur couvre la demande initiale jusqu’au dernier média sauvegardé, sans additionner les durées parallèles.
- Qualité, résolution, modèle, format, nombre d’images et instructions artistiques inchangés. Aucun changement CV/Flyer, clé ou déploiement.

## Mesures réelles et limites de comparaison

Un premier nouvel essai Voltline a échoué **avant les images** : décision 54,346 s, réparation 37,819 s, validation rejetée à nouveau pour intention primaire dupliquée ; total **92,180 s**. Il n’est pas compté comme un succès. Cela confirme une autre source de retard : les réparations du SiteSpec généré. Elles ne sont pas masquées, et les validations restent en place.

Le second essai, studio de céramique avec trois pages et exactement cinq images, conserve tous ses temps, y compris une réparation de lien invalide. Ce n’est pas une réexécution à l’identique du projet utilisateur Voltline : les écarts de contenu et la variabilité fournisseur empêchent d’attribuer tout l’écart de temps au correctif.

Traces : `tmp/kirby-perf/five-images-timings.json`, `five-images-failed-timings.json`. Le test réel utilise le module serveur actualisé directement ; le navigateur vérifie séparément la file réelle de l’éditeur avec des réponses retardées contrôlées.

## Vérifications

- Navigateur : cinq appels démarrent avant toute fin d’image ; aucun doublon entre préchargement et réponse finale ; cinq mesures individuelles, un lot et un total corrélés.
- Navigateur, image en échec : pas de seconde requête implicite ; total marqué en échec.
- Dix scénarios de restauration et de transactions toujours réussis.
- 21 tests unitaires réussis, dont cinq appels images indépendants simultanés, paramètres qualité/résolution conservés et absence de retry fournisseur.

Fichiers fonctionnels touchés : `assets/kirby-site-editor.js`, `lib/kirby-site-timing.js`, `lib/kirby-site-model.js` (métadonnées de mesure seulement), `index.html` (version du script éditeur). Tests : `tests/browser/kirby-site-image-batch.cjs`, `tests/unit/kirby-site-model.test.js`.

Redémarrer le serveur Node puis recharger la page pour charger aussi les nouveaux logs serveur. Les images du projet utilisateur ne sont ni remplacées ni relancées par ces tests.

## Résultat final de l’essai complet

| Étape | Voltline utilisateur, avant | Essai cinq images après |
|---|---:|---:|
| Décision + éventuelle réparation + relecture | 59,071 s | 93,597 s |
| Décision initiale | non isolée dans les captures | 51,243 s |
| Réparation technique | non déterminable sur les captures | 37,569 s (lien invalide) |
| Relecture sémantique | 8,772 s | 4,751 s, en parallèle des images |
| Image 1 — ensemble | non attribuable | 86,698 s |
| Image 2 — pièce Méridien | non attribuable | 91,801 s |
| Image 3 — pièce Anse | non attribuable | 120,673 s |
| Image 4 — pièce Nord | non attribuable | 80,947 s |
| Image 5 — fabrication | non attribuable | 105,524 s |
| Lecture/décodage images | 0,266 s pour le visuel visible | 0,008 à 0,262 s par image |
| Lot images, temps écoulé et non somme | non mesuré séparément | **120,868 s** |
| Total depuis le lancement, tous médias reçus et fichier de test sauvegardé | **environ 245 s** | **209,705 s (3 min 30)** |

La capture permet d’identifier un appel image Voltline de 95,851 s, mais pas de l’associer avec certitude à un numéro dans le lot. Les cinq images du nouvel essai sont parties en 7 ms, chacune en une seule tentative. Le lot recouvre les 4,751 s de relecture : il ne faut pas les additionner au total.

**L’objectif de 1–2 minutes complètes n’est pas atteint.** Le blocage local du cinquième visuel est corrigé, mais le nouvel essai comporte 37,569 s de réparation et une image à 120,673 s. La référence utilisateur et le nouveau test ne sont pas identiques : ne pas présenter la différence de 35 s comme une preuve de gain contrôlé. Même sans la réparation, cet essai resterait au-dessus de deux minutes. Les retards restants sont du côté des réponses IA, pas du décodage ou du rendu. Aucune qualité ni validation n’a été sacrifiée pour masquer cela.
