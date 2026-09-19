# Validation responsive du générateur

Chaque création ou modification de conception passe par `KirbySiteResponsive.validate`
avant son enregistrement et son affichage dans l'éditeur. Toutes les pages sont rendues
avec le renderer et la feuille de style réels, dans un iframe isolé, aux largeurs
390, 430, 768 et 1440 px. Une erreur empêche l'application de la nouvelle conception
et conserve le site précédent. Les réponses sans modification ne relancent pas cet audit.

Contrôles : débordement des blocs de texte, mots fragmentés dans les tableaux et
métriques, colonnes vides comprimant le contenu. Ce contrôle géométrique ne remplace
pas une appréciation visuelle du design. Il utilise les médias déjà disponibles et les
emplacements de dimensions réservées pour ceux qui sont encore en génération.

Les tableaux deviennent des lignes empilées lorsque leur conteneur mesure au plus
640 px. Les compositions asymétriques sans média dominant libèrent les colonnes
inoccupées ; à 850 px et moins, les rangées explicites sont supprimées pour empiler
les éléments sans conserver les rangées desktop.

## Régression navigateur

Avec le serveur local démarré et agent-browser installé :

```sh
AGENT_BROWSER_CLI=/chemin/agent-browser/bin/agent-browser.js npm run test:site-responsive
```

`KIRBY_TEST_URL` permet de remplacer `http://127.0.0.1:8001`.
`AGENT_BROWSER_SOCKET_DIR` permet de choisir un répertoire temporaire accessible.
Le test reproduit les informations padel des captures dans les 17 compositions,
vérifie les quatre largeurs, et injecte un défaut pour vérifier le refus du contrôle.
Il ne lit ni ne modifie les projets de l'utilisateur enregistrés dans son navigateur.
Captures et rapport sont produits dans `output/responsive/`.

Vérification du 19 septembre 2026 : les quatre largeurs passent ; les captures ont été
inspectées. Les 19 tests unitaires renderer, modèle et routage passent également.

## Incidents de génération corrigés

- La page principale charge désormais le moteur de composition avant le renderer ;
  l'audit responsive s'exécute ainsi aussi depuis l'éditeur, pas seulement l'aperçu.
- Un nouveau test remplace le même emplacement IndexedDB, sans historique de l'ancien
  site. La création n'archive plus un autre identifiant de projet.
- Référence `710111b1-c883-4eac-b0bd-4c451a5e7e4b` : le serveur a refusé un lien sur un
  bloc autre qu'image après une première réparation de destination. Le schéma envoyé
  au modèle distingue maintenant les blocs image des autres blocs (`target: null`),
  et les trois types de destinations avec leurs champs inutilisés obligatoirement
  vides. Ces contraintes s'appliquent à la génération et à la relecture. Le schéma
  des documents sauvegardés reste compatible. Les erreurs de destination précisent
  désormais la cible pour permettre une réparation ciblée.

Vérification réelle après correction : demande COMPTA DIRECT relancée dans l'onglet
utilisateur, run `6cdb384a-2a34-4b25-af34-59072d392253`. Validation du candidat au
premier essai, relecture réussie, réponse en 68,7 s, trois visuels générés avec succès.
L'interface a remplacé PULSE PADEL par COMPTA DIRECT dans le même emplacement.
Les 26 tests ciblés du contrat, du schéma fournisseur, du modèle et de la création
indépendante passent.

## Workflow des questions complémentaires

L'incident venait du chemin `clarify` : `KirbySiteContract.apply` conserve le site
existant (ou null), sans créer de maquette. Le modèle choisissait ce chemin à cause
d'informations opérationnelles absentes, alors que le brief permettait la création.
La correction précédente (« signale ... les seuls raccordements nécessaires »)
avait ensuite excessivement réduit les questions à une liste d'éléments à compléter.

La correction actuelle ne change ni le schéma, ni les compositions, ni le renderer :
pour un brief exploitable, la réponse est `create` avec un site complet ET les
questions complémentaires dans `decision.message`. L'éditeur existant enregistre
et affiche l'aperçu avant ce message. Répondre reste facultatif ; les réponses sont
transmises avec le site et la conversation pour une modification `edit` ciblée.
`clarify` reste disponible pour un brief réellement inexploitable ou une cible ambiguë.
Les garde-fous sur les faits inventés et les services non connectés sont conservés.

Régressions : `tests/unit/kirby-site-followup-workflow.test.js` vérifie la création
sans téléphone/adresse/horaires accompagnée de questions, puis l'enrichissement du
même site sans changement d'identité ni de design. Un second cas garde la clarification
pour un brief inexploitable. `tests/browser/kirby-site-followup-workflow.cjs` vérifie
l'aperçu visible avant les questions, la réponse, puis la persistance après rechargement
(API simulée). Aucun projet utilisateur n'est modifié par ces tests.

Validation réelle du workflow corrigé (19 septembre 2026) : un brief Atelier Lune
exploitable, sans téléphone/adresse/horaires, a produit `kind=create`, trois pages
et simultanément le message « Première maquette créée pour Atelier Lune. Questions
utiles pour la suite : quels sont l’adresse, les horaires, le téléphone ou le lien
de réservation à afficher quand ils seront prêts ? Quelle durée de séance, taille
de groupe et technique principale souhaitez-vous préciser pour les cours adultes
débutants ? ». La relecture a approuvé cette réponse. Test indépendant, sans modifier
le projet utilisateur. 28 tests unitaires ciblés et le test navigateur passent.

## Vérification avant production

Copie de livraison isolée basée sur `ee8ae35`, avec les corrections validées du
générateur, sans refonte. Les 66 tests unitaires site passent. Les tests navigateur
followup-workflow, new-project et responsive passent : première maquette visible,
questions complémentaires simultanées, réponses appliquées au même site, restauration
après rechargement, remplacement d'un test et 17 compositions à 390/430/768/1440 px.
La génération réelle Atelier Lune avec questions a été validée précédemment avec
le même module de génération. Les tests navigateur utilisent des réponses API
simulées pour exercer le parcours sans coût ni modification des projets utilisateur.
