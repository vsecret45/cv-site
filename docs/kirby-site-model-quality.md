# Compréhension et relecture du site

La configuration locale demande gpt-5.5. Avant ce changement, le raisonnement
était low par défaut et la propriété model renvoyée par Kirby ne représentait
que le modèle demandé, pas une confirmation du fournisseur.

Changements limités à Kirby Site :
- Raisonnement medium par défaut, surcharge explicite existante respectée.
- La relecture reçoit candidateSite après application effective de la décision,
  en plus du site source, de la demande, de la conversation et des opérations.
- Contrôle explicite des exigences, des parcours, des données et des contradictions
  sur le résultat complet. Une correction reste appliquée au site source.
- modelCalls distingue requestedModel et returnedModel pour chaque appel, sans
  clé ni contenu privé. Le navigateur les inclut dans ses diagnostics existants.

Aucune nouvelle architecture, aucun template sectoriel, aucun changement des
prix, médias ou sites sauvegardés. Les délais existants restent bornés ; medium
peut augmenter la durée. Il n'est pas démontré que ce paramètre seul améliore
systématiquement le design.

31 tests unitaires passent. Le test de relecture vérifie le document résultant,
la conservation du source et la distinction modèle demandé/modèle reçu.

Limite : cette relecture porte sur le SiteSpec et les médias prévus. Elle ne voit
ni capture du site rendu ni images finales générées ; ce n'est pas une validation
visuelle automatique. Les compositions disponibles restent celles du moteur.

Validation réelle : après modification du réglage explicite dans .env (low vers medium, uniquement Kirby), les deux appels confirment gpt-5.5-2026-04-23 avec medium. Catalogue quatre lots validé : 63,5 s hors images. Test navigateur catalogue complet réussi après redémarrage. Aucune amélioration visuelle universelle ne peut être déduite de cet essai.
