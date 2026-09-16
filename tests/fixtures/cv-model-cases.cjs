// Synthetic documents only; deliberately different vocabulary and structures.
module.exports = [
    {
        id: 'administration-combined-headings',
        source: `Nora Exemple\nnora@example.test\nAssistante de gestion\nPARCOURS\n2021–2024 : Assistante de gestion, Atelier Saphir, Dijon\nGestion des courriers et commandes fournisseurs.\nFORMATION\nBTS Gestion de la PME — Lycée Delta — 2018\nBaccalauréat professionnel Gestion-Administration — Lycée Epsilon — 2016\nACTIVITÉS / CENTRES D'INTÉRÊT\nRandonnée, cuisine, natation, voyages\nLANGUES\nFrançais : langue maternelle ; Anglais : intermédiaire ; Italien : notions`,
        counts: { experience: 1, education: 2, activities: 4, languages: 3 },
        includes: ['2018', '2016', 'Saphir', 'natation'],
    },
    {
        id: 'craft-unfamiliar-certifications',
        source: `Maël Exemple | mael@example.test\nLuthier d'archets\nAtelier Boréal (2019–2022) — Restauration d'archets anciens, relevés dimensionnels.\nAtelier Héliotrope (depuis 2023) — Réglage de la cambrure et reméchage.\nQualifications :\n2017 — Brevet des métiers d'art, facture instrumentale — Institut Zéphyr\n2020 — CQP opérateur de finition — Centre Azur\nPratiques personnelles : cyanotype ; observation ornithologique.\nExpression : Breton, usage familial ; Français, courant.`,
        counts: { experience: 2, education: 2, activities: 2, languages: 2 },
        includes: ['Boréal', 'Héliotrope', '2017', '2020', 'Breton', 'cyanotype'],
    },
    {
        id: 'academic-english',
        language: 'en',
        source: `Leila Example\nResearch software engineer\nAppointments\n2022–2025 | North Estuary Lab | Research software engineer\nMaintained reproducible ocean circulation pipelines.\n2018–2021 | South Ridge Institute | Research assistant\nPrepared sediment datasets.\nEducation\nMSc Scientific Computing, Westmere University, 2018\nBSc Earth Sciences, Eastmere College, 2016\nSelected contributions\nTidal Atlas — open research dataset, 2024; DOI 10.0000/example\nBeyond work: bookbinding and chamber choir.\nLanguages: English (native), Swedish (reading knowledge).`,
        counts: { experience: 2, education: 2, activities: 2, languages: 2 },
        includes: ['North Estuary', 'South Ridge', 'Tidal Atlas', '10.0000/example', 'Swedish', 'reading knowledge'],
    },
    {
        id: 'narrative-with-references',
        kind: 'narrative',
        source: `Je m'appelle Sam Exemple. Je vise un poste de médiateur scientifique. J'ai été préparateur de commandes chez Colis Vert de 2019 à 2021. Depuis avril 2024, je suis médiateur au Planétarium Indigo. Dans ce poste, j'anime les séances et j'entretiens les dispositifs. J'ai suivi le DU Médiation des sciences à l'université Rivage en 2023 et obtenu mon bac au lycée Cèdre en 2018. Entre les deux emplois, j'ai fait une pause personnelle : ne la détaille pas. Je pratique la reliure. Je parle français couramment et portugais avec un niveau A2. Ne m'invente ni permis ni expérience de vente.`,
        counts: { experience: 2, education: 2, activities: 1, languages: 2 },
        includes: ['Colis Vert', 'Planétarium Indigo', '2023', '2018', 'reliure', 'A2'],
    },
];
