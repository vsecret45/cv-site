# Parcours Prestations → Kirby → Contact : prototype local

## Existant observé

- Les trois packs de `prestations.html` pointent vers les liens Stripe existants.
- `index.html` utilise `assets/kirby-site-editor.js`, le contrat et le renderer de sites. Le moteur appelle `/api/kirby-site`.
- Les projets et leurs visuels sont stockés dans IndexedDB (`kirby-sites-v1`, magasin `projects`). La clé du projet actif est dans `localStorage['kirby-site-project-v1']`.
- `site-preview.html?project=…` relit ce stockage : auparavant, ce lien seul ne fonctionnait pas dans un autre navigateur et suivait les modifications du projet.
- Contact utilise le formulaire existant, puis `/api/contact` pour la sauvegarde Supabase et l’e-mail SMTP. Le brief générique était prérempli par `script.js`.

## Modifications

- Un lien « Essayer Kirby avec … » dans chaque pack ; liens et tarifs Stripe inchangés.
- Une seule action publique dans le panneau existant sous l’aperçu : « Je choisis ce site ». « Partager » a été retiré à la demande de l’utilisatrice. Aucun changement au moteur, au document généré ni à son renderer.
- Copie figée du site, des médias et de la conversation, identifiée par une empreinte SHA-256. Les modifications ultérieures restent indépendantes.
- Le lien d’aperçu recharge cette copie depuis le serveur local, même dans un autre profil de navigateur. Il ne régénère aucun visuel.
- Contact affiche le nom, l’aperçu et la formule explicitement transmise. La description devient « Besoin complémentaire ? », facultative. Le contexte complet est inclus dans le message transmis par le mécanisme existant et dans `selectedProject`.
- Une sélection absente ou invalide bloque l’envoi ; aucun remplacement par le dernier projet.

## Lancer et tester

Depuis la racine du dépôt :

```sh
SITE_JOURNEY_PROTOTYPE=1 PORT=8017 node server.js
```

- Accueil / Kirby : http://127.0.0.1:8017/index.html#kirby-assistant
- Arrivée Signature : http://127.0.0.1:8017/index.html?formule=Signature#kirby-assistant
- Prestations : http://127.0.0.1:8017/prestations.html#sites-web
- Contact direct : http://127.0.0.1:8017/contact.html

Le serveur du prototype est limité à `127.0.0.1`. Ses liens sont utilisables sur cet ordinateur tant que ce serveur tourne. Ce n’est pas encore un partage public à distance.

Dans ce mode uniquement, `/api/contact` écrit une demande locale et répond « Test local : demande enregistrée, aucun e-mail envoyé ». Ni Supabase ni SMTP ni Stripe ne sont appelés pour l’envoi. Les fichiers se trouvent dans `path.join(require('node:os').tmpdir(), 'sacreationweb-site-journey')` : `selection-….json` pour les versions et `request-….json` pour les demandes. Ce répertoire temporaire est hors dépôt. Il ne constitue pas un stockage de production.

## La Petite Planète : original récupéré et parcours validé

L’accès à Chrome a été activé. Le projet original `5f30014d-b1be-42bb-bdb7-5aec10409c58` a été lu depuis l’onglet déjà ouvert sur `sacreationweb.com`, puis transféré uniquement vers le serveur local par `postMessage`. Aucun nouveau site ni visuel n’a été généré.

La copie locale active utilise la clé `local-original-5f30014d-b1be-42bb-bdb7-5aec10409c58`. Les données du site, les 9 pages, les 9 médias et la conversation ont été comparés à la sauvegarde originale : égalité stricte. Le petit outil temporaire de transfert a été retiré après l’import.

Liens de test avec cette version réelle :

- Générateur : http://127.0.0.1:8017/index.html#kirby-assistant
- Aperçu partagé : http://127.0.0.1:8017/site-preview.html?project=selection-d2582d5001d9c8008ee940be95f21ca1230bf61992cfbfc4594a63d213cd68f2
- Contact sans formule : http://127.0.0.1:8017/contact.html?selection=selection-d2582d5001d9c8008ee940be95f21ca1230bf61992cfbfc4594a63d213cd68f2
- Contact depuis Signature : http://127.0.0.1:8017/contact.html?selection=selection-d2582d5001d9c8008ee940be95f21ca1230bf61992cfbfc4594a63d213cd68f2&formule=Signature

Contrôle dans Chrome : clic sur « Partager » et obtention du lien ; clic sur « Je choisis ce site » et affichage du Contact compact sans formule ; envoi d’une demande fictive locale et vérification du brief exact et des besoins complémentaires dans le fichier enregistré ; ouverture du lien partagé dans un nouvel onglet et vérification du rendu ; parcours Prestations → Signature → Essayer Kirby → sélection → Contact avec Signature.

## Vérifications

```sh
node --test tests/unit/site-journey-local.test.js
node --test tests/unit/kirby-site-contract.test.js tests/unit/kirby-site-renderer.test.js
```

Tests du parcours : copie immuable après une autre génération, récupération indépendante du stockage d’origine, contenu exact du message, formule Signature ou absence de formule, lien vers la bonne version, rejet d’une référence inconnue, absence de sélection pendant la préparation des visuels et Contact direct inchangé.

Les tests automatisés utilisent une fixture nommée « Atelier ». Le test manuel dans Chrome utilise la véritable « La Petite Planète », importée sans modification. Les 18 tests techniques passent et le contrôle visuel du formulaire contextualisé et de l’aperçu partagé est effectué.

Aucun push, aucun déploiement. Les fichiers déjà modifiés avant cette intervention sont conservés ; seuls le branchement du prototype et sa liaison à 127.0.0.1 ont été ajoutés dans `server.js`.

## Retrait de Partager — 18 septembre 2026

Le bouton, le champ de copie et la logique de partage public ont été supprimés. Les références de version, la sauvegarde figée, le brief, la formule et le lien d’aperçu interne restent inchangés. Les vérifications précédentes de partage ci-dessus décrivent le test historique avant ce retrait.

Préalable de production identifié : `/api/site-selection` est actuellement monté uniquement par `server.js` en mode prototype local. Il n’existe pas encore de fonction Vercel ni de stockage durable distant pour ces sauvegardes. Déployer ce prototype tel quel rendrait la sélection inopérante en production.
