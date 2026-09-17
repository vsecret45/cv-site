# Générateur — performances et identité visuelle

17 septembre 2026. Corrections locales uniquement. CV, Flyer, clés et déploiement hors périmètre.

## Diagnostic mesuré avant les changements importants

Le parcours actif est `assets/kirby-site-editor.js` → `/api/kirby-site` → `lib/kirby-site-model.js`, puis rendu local et appels images. Le contenu et la structure sont produits dans la même décision IA ; il n’existe pas d’appel distinct de rédaction ou de génération HTML. Le HTML/CSS/JS est assemblé localement. Le parcours testé génère les images, sans recherche d’images externe.

- Un premier appel réel a pris 47,4 s, puis une réparation technique 32,2 s. Le modèle répétait une intention primaire ; le message de validation trop général ne lui permettait pas de situer l’erreur. Cet essai a échoué avant les images, après environ 80 s.
- Une image réelle, qualité inchangée, a demandé 89,7 s. Avec plusieurs vagues de médias, ces délais peuvent expliquer plusieurs minutes. Ce constat ne constitue pas une mesure rétrospective exacte des cinq minutes de la capture utilisateur.
- Validation et assemblage local sur le document de référence : 0,74 ms et 0,49 ms. Ils ne sont pas le goulot d’étranglement.
- Une erreur de transport lors de la relecture pouvait auparavant relancer inutilement la génération entière.

L’identité répétitive n’était pas causée par une palette brune injectée par le CSS hôte : le rendu est isolé. En revanche, le contrat interdisait une nouvelle création lorsqu’un site existait ; les nouveaux métiers étaient alors traités comme des modifications du même projet. Cela favorisait la conservation de l’ancienne identité. Les choix typographiques étaient réduits à trois familles, et les titres dépendaient de la largeur de l’écran plutôt que de leur colonne.

## Corrections

- Décision et relecture sémantique conservées. Les premières images démarrent pendant la relecture via un événement NDJSON `media_plan`. Seul le site approuvé est affiché.
- File commune limitée à quatre images simultanées ; les demandes en cours sont partagées entre préchargement et rendu final. Les médias inchangés sont réutilisés.
- Affichage du site dès sa validation, compteur compact pendant les médias. Chaque image remplace uniquement son emplacement : pas de rechargement de la page, du menu ou du formulaire en cours.
- Réparation réservée aux erreurs de contrat ; une panne du fournisseur ne déclenche plus une reconstruction complète. Les erreurs d’intention indiquent désormais les identifiants concernés. La validation finale d’un candidat approuvé n’est plus répétée sur le serveur.
- Durées `[kirby-perf]` côté serveur et navigateur : décision, réparation, relecture, validations, file d’images, fournisseur images, décodage, rendu DOM, copie et sauvegarde IndexedDB. Aucun secret ni contenu du brief dans ces logs.
- Historique et brief retirés de l’affichage. Le contexte reste transmis à OpenAI ; seule sa dernière réponse utile apparaît hors du site, avec la saisie de modification.
- Nouvelle création autorisée sur décision explicite du modèle, avec une nouvelle identité et un nouveau projet ; l’ancien reste sauvegardé. Une modification d’ambiance du même site conserve son contenu.
- Instructions générales sur le positionnement, les gestes/outils/matières des images et la place des produits ; aucun exemple métier codé en dur.
- Deux compositions supplémentaires (`object-stage`, `collection-grid`), familles typographiques supplémentaires, informations des blocs images conservées et titres proportionnés à leur colonne. Les paramètres du SiteSpec restent l’autorité artistique.

## Mesures après correction — appels OpenAI réels

| Étape / essai | Durée |
|---|---:|
| Studio céramique, décision complète de trois pages | 43,14 s |
| Validation du candidat | 3,48 ms |
| Relecture sémantique | 6,34 s |
| Structure approuvée disponible depuis le départ | **49,50 s** |
| Trois images simultanées, chacune | 91,39–93,72 s |
| Site avec les trois images, depuis le départ | **137,16 s** |
| Modification couleurs seules, décision + relecture | **4,62 s** |
| Nouveau projet vétérinaire, structure approuvée | 83,87 s |
| Nouveau projet laboratoire acoustique, structure approuvée | 90,50 s |

Les deux derniers essais ont été lancés en parallèle avec le site précédent comme contexte et sans générer de nouvelles images. Ils ont bien produit deux créations indépendantes : blanc/vert et typographie humaniste/géométrique pour le premier ; bleu nuit/cyan et typographie sans/géométrique pour le second. La création céramique utilisait blanc/menthe et humaniste/display. Ce sont des observations, pas des associations sectorielles imposées.

L’objectif d’une minute n’est **pas garanti**, et le site entièrement illustré reste au-delà dans cet essai. Aucun modèle, niveau de qualité ou nombre d’images demandé n’a été réduit. Ces essais ne permettent pas de calculer un pourcentage de gain fiable par rapport à la capture de cinq minutes.

## Vérifications

- `node --test tests/unit/kirby-site-*.test.js` : contrat, transactions, contexte exact, conservation lors des modifications, compositions, destinations, flux progressif et panne de relecture.
- Appel réel « vert sauge, blanc et touches dorées » : seule opération `set_design` ; égalité exacte des pages, liens, assets, intentions et projet avant/après.
- Navigateur isolé : flux réseau simulé avec médias retardés pour vérifier le comportement progressif ; trois appels images, sans doublons ; compteur actif ; menu et brouillon de saisie conservés à leur arrivée ; historique absent.
- Navigateur avec le véritable site céramique et ses trois images : navigation propre au site vers `/collection`, rendu desktop inspecté, largeur mobile 390 px sans débordement horizontal ni scroll interne de l’iframe.
- Rendu DOM observé : environ 2–11 ms ; sauvegarde IndexedDB du site illustré : 8,6 ms. Les délais IA dominent nettement.

Traces locales : `tmp/kirby-perf/optimized-timings.json`, `media-baseline.json`, `variety-veterinaire.json`, `variety-laboratoire.json`, `browser-console.txt`. Les données de référence et le test optimisé n’ont pas tous deux abouti : ne pas les présenter comme un benchmark contrôlé avant/après.

## Fichiers concernés et limites

`lib/kirby-site-timing.js`, `lib/kirby-site-model.js`, `api/kirby-site.js`, `assets/kirby-site-{contract,editor,preview,renderer,store}.js`, `assets/kirby-site.css`, `kirby-composition-engine.js`, tests unitaires Générateur. Dans `index.html` et `site-preview.html`, actualisation des versions des ressources Générateur. Aucun changement supplémentaire aux fichiers partagés `script.js`, `server.js`, `style.css`, `vercel.json`, ni aux modules CV/Flyer pendant cette optimisation ; les différences préexistantes restent présentes dans le dépôt.

Le préchargement peut produire jusqu’à quatre médias candidats devenus inutiles si la relecture change leur direction. La concurrence est bornée mais ne supprime pas ce coût éventuel. Le système conserve JPEG et une profondeur CSS/pseudo-3D : il ne prétend pas fournir des détourages transparents ou une scène 3D réelle. Les nouvelles polices utilisent les familles disponibles sur la machine, avec replis.

Un nouveau rendu joaillerie et ses images doivent encore être jugés visuellement ; les tests de variété ne prouvent pas à eux seuls sa qualité artistique. Le renderer actuel fournit des destinations et boutons de navigation, mais un lien « Panier » n’est pas une preuve de panier transactionnel ou de backend marchand. Aucun backend de commerce n’a été ajouté dans cette correction.

Redémarrer le serveur Node local pour charger le nouveau module API, puis recharger la page. Les appels IA réels ci-dessus utilisent directement le module actualisé ; le serveur déjà lancé sur 8002 peut conserver l’ancienne version en mémoire. Aucun push ni déploiement effectué.
