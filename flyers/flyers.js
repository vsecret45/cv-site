(function () {
  'use strict';

  const FORMATS = {
    a4: {
      label: 'A4 · 210 × 297 mm · 300 dpi', width: 2480, height: 3508, pdf: 'a4', mm: [210, 297], supportType: 'flyer',
    },
    a5: {
      label: 'A5 · 148 × 210 mm · 300 dpi', width: 1748, height: 2480, pdf: 'a5', mm: [148, 210], supportType: 'flyer',
    },
    'instagram-square': {
      label: 'Instagram · 1080 × 1080 px', width: 1080, height: 1080, supportType: 'flyer',
    },
    story: { label: 'Story · 1080 × 1920 px', width: 1080, height: 1920, supportType: 'flyer' },
    facebook: { label: 'Facebook · 1200 × 630 px', width: 1200, height: 630, supportType: 'flyer' },
    linkedin: { label: 'LinkedIn · 1200 × 627 px', width: 1200, height: 627, supportType: 'flyer' },
    'business-card': {
      label: 'Carte de visite · 85 × 55 mm · aperçu recto',
      width: 1004,
      height: 650,
      pdf: [85, 55],
      mm: [85, 55],
      supportType: 'business-card',
    },
  };

  const LAYOUTS = new Set([
    'classic-frame',
    'poster-cut',
    'editorial-impact',
    'cinematic-split',
    'kinetic-grid',
    'luxury-focus',
    'event-pulse',
  ]);

  const DECORS = new Set([
    'velvet-glow',
    'paper-white',
    'classic-frame',
    'velvet-folds',
    'burgundy-panels',
    'champagne-spotlight',
    'night-constellation',
    'marble-veins',
    'gallery-window',
    'geometric-blocks',
  ]);

  const DECOR_ALIASES = Object.freeze({
    'burgundy-halo': 'burgundy-panels',
    'champagne-lines': 'gallery-window',
    'midnight-arches': 'night-constellation',
    'minimal-soft': 'paper-white',
    'art-deco-sun': 'geometric-blocks',
  });

  const PALETTE_PRESETS = Object.freeze({
    'velours-night': {
      palette: {
        background: '#0a0000', surface: '#2b0e14', ink: '#f4ede4', muted: '#d8cfc4', accent: '#c9a14a', accentInk: '#0a0000',
      },
    },
    'soft-burgundy': {
      palette: {
        background: '#2b0e14', surface: '#4a1424', ink: '#f4ede4', muted: '#d8cfc4', accent: '#d8c089', accentInk: '#0a0000',
      },
    },
    'champagne-light': {
      palette: {
        background: '#f4ede4', surface: '#fff9f1', ink: '#2b0e14', muted: '#6f5b59', accent: '#8b1538', accentInk: '#fff9f1',
      },
    },
    'midnight-blue': {
      palette: {
        background: '#07101f', surface: '#111b2e', ink: '#f4ede4', muted: '#c8c1ba', accent: '#c9a14a', accentInk: '#07101f',
      },
    },
    'paper-white': {
      palette: {
        background: '#ffffff', surface: '#f3f1ec', ink: '#181a1f', muted: '#5d626b', accent: '#8b1538', accentInk: '#ffffff',
      },
    },
    'studio-neutral': {
      palette: {
        background: '#eef1f4', surface: '#ffffff', ink: '#17202b', muted: '#53606d', accent: '#24527a', accentInk: '#ffffff',
      },
    },
  });

  const DESIGN_MODELS = Object.freeze({
    'classic-elegant': {
      layout: 'classic-frame', typography: 'editorial', decor: 'classic-frame', palettePreset: 'champagne-light',
    },
    'velours-signature': {
      layout: 'poster-cut', typography: 'editorial', decor: 'velvet-folds', palettePreset: 'velours-night',
    },
    'burgundy-refined': {
      layout: 'luxury-focus', typography: 'editorial', decor: 'burgundy-panels', palettePreset: 'soft-burgundy',
    },
    'art-deco-gold': {
      layout: 'kinetic-grid', typography: 'geometric', decor: 'geometric-blocks', palettePreset: 'velours-night',
    },
    'midnight-professional': {
      layout: 'cinematic-split', typography: 'human', decor: 'night-constellation', palettePreset: 'midnight-blue',
    },
    'minimal-contemporary': {
      layout: 'editorial-impact', typography: 'modern', decor: 'gallery-window', palettePreset: 'champagne-light',
    },
    'classic-simple': {
      layout: 'poster-cut', typography: 'human', decor: 'paper-white', palettePreset: 'paper-white',
    },
    'classic-burgundy': {
      layout: 'luxury-focus', typography: 'editorial', decor: 'champagne-spotlight', palettePreset: 'soft-burgundy',
    },
    'classic-night': {
      layout: 'event-pulse', typography: 'human', decor: 'velvet-glow', palettePreset: 'midnight-blue',
    },
    'geometric-studio': {
      layout: 'poster-cut', typography: 'modern', decor: 'marble-veins', palettePreset: 'studio-neutral',
    },
  });

  const STORAGE_KEY = 'sacreationweb.flyerDraft.v1';
  const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
  const BRIEF_MAX_LENGTH = 2400;
  const SUPABASE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/+esm';
  const FIELD_LIMITS = Object.freeze({
    activity: 160,
    eyebrow: 48,
    headline: 72,
    supporting: 150,
    offer: 64,
    cta: 42,
    disclaimer: 100,
    detailLabel: 24,
    detailValue: 52,
    imagePrompt: 900,
    negativePrompt: 400,
    phone: 32,
    email: 96,
    website: 96,
    address: 100,
    qrValue: 300,
    variant: 300,
  });
  let flyerAuthClientPromise = null;

  const DEFAULT_SPEC = {
    briefUnderstanding: {
      activity: '', audience: [], objective: '', offer: '', tone: [], mandatoryFacts: [], unknowns: [],
    },
    artDirection: {
      concept: 'Impact publicitaire contemporain',
      layout: 'poster-cut',
      visualStyle: 'Sculptural, précis et lumineux',
      imagePrompt: '',
      negativePrompt: 'text, typography, letters, numbers, logo, watermark, QR code',
      focalPoint: 'center',
      palette: {
        background: '#f4efe5',
        surface: '#ffffff',
        ink: '#10151f',
        muted: '#5f6673',
        accent: '#ff5a36',
        accentInk: '#0b0f16',
      },
      typography: { display: 'Space Grotesk', body: 'Manrope' },
    },
    copy: {
      eyebrow: 'NOUVELLE CAMPAGNE',
      headline: 'Une idée forte mérite un vrai impact.',
      supporting: 'Décrivez votre projet : Kirby composera un flyer pensé pour votre métier et votre public.',
      offer: 'Lancement prochainement',
      cta: 'Faites-vous remarquer',
      details: [
        { label: 'Format', value: 'Prêt à diffuser' },
        { label: 'Création', value: 'Modifiable' },
        { label: 'Export', value: 'HD + PDF' },
      ],
      disclaimer: 'Conception assistée par Kirby IA',
    },
    contact: {
      phone: '', email: '', website: 'sacreationweb.com', address: '', qrValue: '',
    },
  };

  const EXAMPLE_SPECS = Object.freeze({
    'sa-creation-web': {
      supportType: 'business-card', format: 'business-card', typography: 'modern', decor: 'none',
      imageUrl: 'assets/sa-creation-web-logo.svg',
      brief: 'Carte de visite SA Création Web. Site sacreationweb.com. Sites web, CV et lettres, flyers et cartes de visite. Ambiance bleu nuit, argent et touches dorées. Conserver les coordonnées et le QR code lors des changements de fond.',
      spec: {
        briefUnderstanding: {activity:'SA Création Web',audience:['Professionnels','Particuliers'],objective:'Visite du site',offer:'Création avec Kirby IA',tone:['élégant','lisible'],mandatoryFacts:['sacreationweb.com'],unknowns:[]},
        artDirection: {concept:'SA Création Web',layout:'editorial-impact',visualStyle:'Bleu nuit, argent, accents dorés discrets',imagePrompt:'Fond bleu nuit élégant, halos argentés et touches dorées très discrètes, espace libre pour les textes, sans lettres ni logo',negativePrompt:'text, typography, logo, watermark, QR code',focalPoint:'right',palette:{background:'#060810',surface:'#101725',ink:'#f3f5fa',muted:'#bac5d8',accent:'#e3c994',accentInk:'#060810'},typography:{display:'Space Grotesk',body:'Manrope'}},
        copy:{eyebrow:'SA CRÉATION WEB',headline:'Votre projet prend forme.',supporting:'Sites • CV • Flyers',offer:'Vos idées, accompagnées par Kirby IA.',cta:'Découvrez nos services',details:[{label:'Sites web',value:'Présentez votre activité.'},{label:'CV & lettres',value:'Mettez votre parcours en valeur.'},{label:'Flyers & cartes',value:'Faites connaître votre projet.'}],disclaimer:''},
        contact:{phone:'',email:'',website:'sacreationweb.com',address:'',qrValue:'https://www.sacreationweb.com'}
      }
    },
    beauty: {
      supportType: 'flyer',
      format: 'instagram-square',
      typography: 'editorial',
      decor: 'gallery-window',
      brief: 'Publication carrée pour Maison Éclat, un institut de beauté chaleureux. Mettre en avant un soin découverte à 49 €, une peau lumineuse et une réservation simple.',
      spec: {
        briefUnderstanding: {
          activity: 'Maison Éclat', audience: ['Adultes recherchant un soin premium'], objective: 'Réservation', offer: 'Soin découverte à 49 €', tone: ['élégant', 'sensoriel'], mandatoryFacts: [], unknowns: [],
        },
        artDirection: {
          concept: 'Lumière sculptée', layout: 'luxury-focus', visualStyle: 'Éditorial beauté, doux et contemporain', imagePrompt: 'Gros plan beauté lumineux, peau naturelle, lumière dorée, décor minimal ivoire et terracotta, photographie éditoriale premium, sans texte', negativePrompt: 'text, typography, letters, numbers, logo, watermark, QR code, stock photo, dated advertising', focalPoint: 'right',
          palette: { background: '#f5e5df', surface: '#fff8f3', ink: '#3d2722', muted: '#765d55', accent: '#b47b54', accentInk: '#160c08' },
          typography: { display: 'Playfair Display', body: 'Manrope' },
        },
        copy: {
          eyebrow: 'MAISON ÉCLAT', headline: 'Révélez votre lumière.', supporting: 'Un rituel visage précis, doux et pensé pour votre peau.', offer: 'Soin découverte · 49 €', cta: 'Réserver un soin', details: [{ label: 'Durée', value: '60 minutes' }, { label: 'Lieu', value: 'Lyon 2e' }, { label: 'Conseil', value: 'Diagnostic inclus' }], disclaimer: 'Sur réservation · selon disponibilités',
        },
        contact: { phone: '04 72 00 00 00', email: 'bonjour@maison-eclat.fr', website: 'maison-eclat.fr', address: 'Lyon 2e', qrValue: '' },
      },
    },
    sport: {
      supportType: 'flyer',
      format: 'story',
      typography: 'geometric',
      decor: 'night-constellation',
      brief: 'Story pour Lina Coaching, coaching sportif individuel avec bilan gratuit. Univers énergique, moderne et précis, vert électrique sur fond sombre.',
      spec: {
        briefUnderstanding: {
          activity: 'Lina Coaching', audience: ['Adultes souhaitant progresser durablement'], objective: 'Demande de bilan', offer: 'Bilan gratuit', tone: ['énergique', 'direct'], mandatoryFacts: [], unknowns: [],
        },
        artDirection: {
          concept: 'Énergie cadrée', layout: 'event-pulse', visualStyle: 'Sport premium, contraste franc, mouvement maîtrisé', imagePrompt: 'Portrait athlétique crédible en plein effort, salle de sport contemporaine sombre, lumière verte directionnelle, photographie de campagne premium, sans texte', negativePrompt: 'text, typography, letters, numbers, logo, watermark, QR code, generic fitness stock photo, exaggerated muscles', focalPoint: 'right',
          palette: { background: '#0b120d', surface: '#142018', ink: '#f7f5ee', muted: '#b8c3b9', accent: '#65ff40', accentInk: '#061006' },
          typography: { display: 'Space Grotesk', body: 'Manrope' },
        },
        copy: {
          eyebrow: 'LINA COACHING', headline: 'Ton rythme. Tes progrès.', supporting: 'Un plan personnel, des repères clairs et un suivi qui tient dans la durée.', offer: 'Bilan de départ offert', cta: 'Réserver mon bilan', details: [{ label: 'Format', value: 'Individuel' }, { label: 'Suivi', value: 'Chaque semaine' }, { label: 'Option', value: 'À distance' }], disclaimer: 'Programme adapté au niveau et aux objectifs.',
        },
        contact: { phone: '06 00 00 00 00', email: 'lina@coaching.fr', website: 'lina-coaching.fr', address: 'Lyon & à distance', qrValue: '' },
      },
    },
    'accounting-card': {
      supportType: 'business-card',
      format: 'business-card',
      typography: 'human',
      decor: 'velvet-glow',
      brief: 'Carte de visite recto pour Nova Compta, cabinet comptable pour indépendants et petites entreprises. Identité bleu nuit et or, professionnelle, claire et rassurante.',
      spec: {
        briefUnderstanding: {
          activity: 'Nova Compta', audience: ['Indépendants', 'Petites entreprises'], objective: 'Prise de contact', offer: 'Premier échange', tone: ['professionnel', 'rassurant'], mandatoryFacts: [], unknowns: [],
        },
        artDirection: {
          concept: 'Boussole financière', layout: 'editorial-impact', visualStyle: 'Identité sobre, précise et contemporaine', imagePrompt: 'Objet abstrait en verre bleu nuit et métal doré, lumière studio premium, espace négatif, image de marque financière contemporaine, sans texte', negativePrompt: 'text, typography, letters, numbers, logo, watermark, QR code, calculator, coins, generic office stock photo', focalPoint: 'right',
          palette: { background: '#07192f', surface: '#eef2f5', ink: '#f8f2e7', muted: '#b8c3ce', accent: '#d2a746', accentInk: '#151006' },
          typography: { display: 'DM Sans', body: 'DM Sans' },
        },
        copy: {
          eyebrow: 'NOVA COMPTA', headline: 'Votre activité, pilotée avec clarté.', supporting: 'Comptabilité · fiscalité · pilotage', offer: 'Premier échange', cta: 'Parlons de votre projet', details: [{ label: 'Conseil', value: 'Création & gestion' }, { label: 'Compta', value: 'TVA & déclarations' }, { label: 'Pilotage', value: 'Des repères clairs' }], disclaimer: 'Brouillon recto modifiable',
        },
        contact: { phone: '04 72 00 00 00', email: 'contact@nova-compta.fr', website: 'nova-compta.fr', address: 'Lyon', qrValue: '' },
      },
    },
  });

  const requestedExample = new URLSearchParams(window.location.search).get('example');
  const exampleKey = Object.prototype.hasOwnProperty.call(EXAMPLE_SPECS, requestedExample) ? requestedExample : '';
  const draftKey = exampleKey ? `${STORAGE_KEY}.example.${exampleKey}` : STORAGE_KEY;

  const state = {
    spec: clone(DEFAULT_SPEC),
    supportType: 'flyer',
    format: 'a4',
    decor: 'velvet-glow',
    imageUrl: '',
    imageOrigin: '',
    imageFit: 'cover',
    imagePositionX: 50,
    imagePositionY: 50,
    imageSize: 100,
    imageBlend: 20,
    activeObjectUrl: '',
    imageChangeSerial: 0,
    imagePending: null,
    requestSerial: 0,
    inFlight: null,
    lastFailedAction: null,
    dirty: false,
    generated: false,
    previewIsFullscreen: false,
  };

  const els = {};

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    cacheElements();
    configurePreviewFullscreen();
    bindEvents();
    const restored = await restoreDraft();
    if (exampleKey && !restored) loadStaticExample(exampleKey);
    if (exampleKey) {
      els.draftState.textContent = exampleKey === 'sa-creation-web' ? 'Carte SA Création Web · version modifiable séparée' : 'Démonstration séparée · textes et tarifs fictifs';
      document.title = 'Exemple Kirby Flyers · Démonstration';
    }
    renderAll();
    updateBriefCount();
    if (!exampleKey && window.KirbyWorkspace) {
      try {
        const client=await initializeFlyerAuthClient(AbortSignal.timeout(5000));
        const {data}=await client.auth.getSession();KirbyWorkspace.setOwner(data?.session?.user?.id);
        client.auth.onAuthStateChange((_event,session)=>KirbyWorkspace.setOwner(session?.user?.id));
      } catch (_) { /* Local editing remains available offline. */ }
      await KirbyWorkspace.register({kind:'Flyer / carte', title:()=>state.spec?.copy?.headline || 'Ma création', snapshot:draftSnapshot, thumbnail:async()=>{const c=await renderExportCanvas();const t=document.createElement('canvas');t.width=240;t.height=Math.round(c.height/c.width*240);t.getContext('2d').drawImage(c,0,0,t.width,t.height);return t.toDataURL('image/jpeg',.7);},
        busy:()=>Boolean(state.inFlight || state.imagePending), restore:async saved=>{applyDraft(saved);renderAll();updateBriefCount();await saveDraft();}});
      const button=document.createElement('button'); button.type='button'; button.textContent='Aperçu avant impression';
      button.addEventListener('click', previewPrint); document.querySelector('.workspace-tools').append(button);
    }
  }

  function cacheElements() {
    const ids = [
      'flyerBriefForm', 'flyerBrief', 'flyerFormat', 'briefCount', 'generateConceptButton',
      'supportTypeFlyer', 'supportTypeBusinessCard', 'generationFeedback', 'generationStatus',
      'generationDetail', 'retryButton', 'flyerAuthLink',
      'flyerEditor', 'draftState', 'flyerEyebrow', 'flyerHeadline', 'flyerSupporting',
      'flyerOffer', 'flyerCta', 'flyerDisclaimer', 'detailLabel1', 'detailValue1',
      'detailLabel2', 'detailValue2', 'detailLabel3', 'detailValue3', 'flyerLayout',
      'flyerTypography', 'flyerDecor', 'flyerDesignModels', 'designModelsLegend', 'designModelsHint',
      'colorBackground', 'colorSurface', 'colorInk', 'colorAccent',
      'variantInstruction', 'regenerateConceptButton', 'generateImageButton',
      'variantStatus', 'variantAuthLink', 'cancelVariantButton',
      'flyerImageUpload', 'removeImageButton', 'imageCredit', 'flyerPhone', 'flyerEmail',
      'flyerWebsite', 'flyerAddress', 'flyerQrValue', 'formatLabel', 'previewFormatName', 'fitPreviewButton',
      'zoomPreviewButton', 'previewDisplayActions', 'previewFullscreen', 'exitFullscreenButton',
      'previewFullscreenStatus', 'previewStage', 'flyerCanvas', 'flyerImage', 'previewEyebrow',
      'previewHeadline', 'previewSupporting', 'previewOffer', 'previewDetails', 'previewCta',
      'previewContact', 'previewPhone', 'previewEmail', 'previewWebsite', 'previewAddress',
      'previewQr', 'previewDisclaimer', 'exportPngButton', 'exportPdfButton', 'exportCardSheetButton', 'exportStatus',
    ];

    ids.forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    els.flyerBriefForm.addEventListener('submit', (event) => {
      event.preventDefault();
      generateSpec(false);
    });

    els.flyerBrief.addEventListener('input', () => {
      els.flyerBrief.value = limitText(els.flyerBrief.value, BRIEF_MAX_LENGTH, false);
      updateBriefCount();
      markDirty();
    });

    [els.supportTypeFlyer, els.supportTypeBusinessCard].forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) setSupportType(radio.value);
      });
    });

    els.flyerFormat.addEventListener('change', () => {
      state.format = FORMATS[els.flyerFormat.value] ? els.flyerFormat.value : 'a4';
      state.supportType = FORMATS[state.format].supportType;
      renderAll();
      markDirty();
    });

    document.querySelectorAll('[data-bind]').forEach((input) => {
      input.addEventListener('input', () => {
        const value = limitText(input.value, fieldLimitForPath(input.dataset.bind), false);
        if (input.value !== value) input.value = value;
        setPath(state.spec, input.dataset.bind, value);
        if (input === els.flyerLayout) state.spec.artDirection.layout = normalizeLayout(input.value);
        if (input === els.flyerWebsite) {
          const canonicalWebsite = canonicalizeKnownWebsite(
            state.spec.briefUnderstanding.activity,
            state.spec.copy.eyebrow,
            value,
          );
          state.spec.contact.website = canonicalWebsite;
          if (input.value !== canonicalWebsite) input.value = canonicalWebsite;
        }
        renderAll();
        markDirty();
      });
    });

    [
      els.detailLabel1, els.detailValue1, els.detailLabel2, els.detailValue2,
      els.detailLabel3, els.detailValue3,
    ].forEach((input) => input.addEventListener('input', () => {
      readDetailsFromEditor();
      renderDetails();
      markDirty();
    }));

    const applyPaletteEditor = () => {
      readPaletteFromEditor();
      syncPaletteEditor();
      renderPalette();
      updatePalettePresetState();
      updateDesignModelState();
      markDirty();
    };
    [els.colorBackground, els.colorSurface, els.colorInk, els.colorAccent].forEach((input) => {
      input.addEventListener('input', applyPaletteEditor);
      input.addEventListener('change', applyPaletteEditor);
    });

    document.querySelectorAll('[data-palette-preset]').forEach((button) => {
      button.addEventListener('click', () => applyPalettePreset(button.dataset.palettePreset));
    });

    document.querySelectorAll('[data-design-model]').forEach((button) => {
      button.addEventListener('click', () => applyDesignModel(button.dataset.designModel));
    });

    els.flyerTypography.addEventListener('change', () => {
      els.flyerCanvas.dataset.typography = els.flyerTypography.value;
      state.spec.artDirection.typography = typographyForPreset(els.flyerTypography.value);
      updateDesignModelState();
      markDirty();
    });

    els.flyerDecor.addEventListener('change', () => {
      state.decor = normalizeDecor(els.flyerDecor.value);
      renderDecor();
      updatePalettePresetState();
      updateDesignModelState();
      markDirty();
    });

    els.regenerateConceptButton.addEventListener('click', () => generateSpec(true));
    els.cancelVariantButton.addEventListener('click', cancelVariantRequest);
    els.generateImageButton.addEventListener('click', () => generateImage(false));
    els.retryButton.addEventListener('click', () => {
      const retry = state.lastFailedAction;
      state.lastFailedAction = null;
      if (typeof retry === 'function') retry();
    });
    els.flyerImageUpload.addEventListener('change', handleImageUpload);
    els.removeImageButton.addEventListener('click', removeImage);
    ['imageFit', 'imagePositionX', 'imagePositionY', 'imageSize', 'imageBlend'].forEach(id => {
      document.getElementById(id).addEventListener('input', event => {
        state[id] = id === 'imageFit' ? event.target.value : Number(event.target.value);
        if (id === 'imageFit') {
          state.imagePositionX = state.imageFit === 'logo' ? 80 : 50;
          state.imagePositionY = state.imageFit === 'logo' ? 42 : 50;
          state.imageSize = 100;
        }
        renderImage();
        markDirty();
      });
    });
    els.fitPreviewButton.addEventListener('click', exitPreviewFullscreen);
    els.zoomPreviewButton.addEventListener('click', enterPreviewFullscreen);
    els.exitFullscreenButton.addEventListener('click', exitPreviewFullscreen);
    document.addEventListener('fullscreenchange', syncPreviewFullscreen);
    document.addEventListener('fullscreenerror', handlePreviewFullscreenError);
    els.exportPngButton.addEventListener('click', exportPng);
    els.exportPdfButton.addEventListener('click', exportPdf);
    els.exportCardSheetButton.addEventListener('click', exportCardSheet);

    window.addEventListener('beforeunload', () => {
      if (state.activeObjectUrl) URL.revokeObjectURL(state.activeObjectUrl);
    });
  }

  async function generateSpec(isVariant) {
    const instruction = limitText(els.variantInstruction.value, FIELD_LIMITS.variant);
    if (isVariant && isImageRevision(instruction)) {
      await generateImage(false, true);
      return;
    }
    const typedBrief = limitText(els.flyerBrief.value, BRIEF_MAX_LENGTH);
    const currentSpecIsRevisable = hasRevisableSpec(state.spec);
    const brief = typedBrief.length >= 18 || !isVariant || !currentSpecIsRevisable
      ? typedBrief
      : buildRevisionBriefFromSpec(state.spec);

    if (!isVariant) clearVariantFeedback();
    if (brief.length < 18) {
      showFeedback('error', 'Votre brief est trop court.', 'Ajoutez l’activité, l’objectif et au moins une information concrète.');
      if (isVariant) {
        setVariantFeedback(
          'error',
          'Décrivez d’abord votre activité dans le brief, puis relancez cette nouvelle direction.',
        );
      }
      els.flyerBrief.focus();
      return;
    }

    const serial = beginRequest(isVariant ? 'variant' : 'spec');
    setBusy(true);
    if (isVariant) {
      setVariantFeedback(
        'loading',
        'Kirby prépare une seule nouvelle direction. Cela peut prendre environ une minute ; vous pouvez annuler sans perdre le flyer.',
      );
    }
    showFeedback(
      'loading',
      isVariant ? 'Kirby imagine une direction vraiment différente…' : 'Kirby construit la direction artistique…',
      state.supportType === 'business-card'
        ? 'Identité, coordonnées, hiérarchie courte et composition recto 85 × 55 mm.'
        : 'Analyse du métier, hiérarchie du message, composition et palette.',
    );

    try {
      const payload = {
        mode: 'spec',
        brief: buildGenerationBrief(brief),
        format: getApiFormat(),
        supportType: state.supportType,
        requestId: createRequestId(),
      };

      if (isVariant) {
        payload.revision = limitText(els.variantInstruction.value, FIELD_LIMITS.variant)
          || 'Créer une nouvelle direction artistique nettement différente, sans recycler la même composition.';
        if (currentSpecIsRevisable) payload.currentSpec = state.spec;
      }

      const data = await requestFlyer(payload, state.inFlight.controller.signal);
      if (!isCurrent(serial)) return;
      if (!data.spec || typeof data.spec !== 'object') throw new Error('Kirby n’a pas renvoyé de maquette exploitable.');

      state.spec = normalizeSpec(data.spec);
      state.generated = true;
      state.dirty = false;
      syncEditorFromState();
      renderAll();
      saveDraft();
      showFeedback(
        isVariant ? 'success' : 'loading',
        isVariant
          ? 'Nouvelle direction appliquée.'
          : 'Étape 1 sur 2 terminée — mise en page prête.',
        isVariant
          ? 'La composition, les textes et les couleurs ont changé. Vous pouvez garder le visuel actuel ou en générer un nouveau dans le menu Image.'
          : 'Kirby passe maintenant au fond IA. Le point bleu s’arrêtera dès que cette seconde étape sera terminée.',
      );

      endRequest(serial);
      setBusy(false);
      if (isVariant) {
        setVariantFeedback(
          'success',
          'Nouvelle direction appliquée. Pour changer aussi la photo, ouvrez « Image » puis générez un nouveau visuel IA.',
        );
        return;
      }
      await generateImage(true);
    } catch (error) {
      if (error.name === 'AbortError') {
        finishAbortedRequest(serial);
        return;
      }
      if (!isCurrent(serial)) return;
      state.lastFailedAction = () => generateSpec(isVariant);
      if (isVariant) {
        setVariantFeedback('error', humanizeError(error), { authRequired: isAuthRequiredError(error) });
      }
      showFeedback(
        'error',
        isAuthRequiredError(error) ? 'Connexion requise pour utiliser Kirby IA.' : 'La proposition n’a pas pu être générée.',
        humanizeError(error),
        { authRequired: isAuthRequiredError(error) },
      );
      endRequest(serial);
      setBusy(false);
    }
  }

  function isImageRevision(instruction) {
    let text = instruction.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    // Mentions of content to preserve are not requests to rewrite that content.
    text = text.replace(/\b(?:sans (?:toucher a|modifier|changer|supprimer)|(?:garde|garder|conserve|conserver|preserve|preserver))\s+(?:(?:les?|la|aux?|mon|mes|notre)\s+)?(?:textes?|titres?|coordonnees|contenu|site|qr(?: code)?)(?:\s*(?:,|et)\s*(?:(?:les?|la|mon|mes)\s+)?(?:textes?|titres?|coordonnees|contenu|site|qr(?: code)?))*/g, '');
    const image = /\b(fond|arriere[ -]plan|photo|image|visuel|ambiance)\b/;
    // Explicit preservation and requests for editable text/layout stay on the spec path.
    if (/\b(garde|garder|conserve|conserver|preserve|preserver|sans changer|ne change pas)\b[^.!?]*\b(fond|photo|image|visuel)\b/.test(text)) return false;
    if (/\b(texte|textes|titre|titres|prix|tarif|telephone|adresse|qr|police|typographie|mise en page|couleur|couleurs)\b/.test(text)) return false;
    return image.test(text);
  }

  async function generateImage(followsSpec, fromVariant = false) {
    if (!state.spec.artDirection.imagePrompt && !els.flyerBrief.value.trim()) {
      showFeedback('error', 'Le visuel a besoin d’un brief.', 'Décrivez d’abord votre activité ou votre événement.');
      return;
    }

    state.imageChangeSerial += 1;
    state.imagePending = null;
    const serial = beginRequest('image');
    state.inFlight.fromVariant = fromVariant;
    setBusy(true);
    if (fromVariant) setVariantFeedback('loading', 'Kirby crée le nouveau fond demandé. Votre composition reste en place pendant le chargement.');
    showFeedback(
      'loading',
      followsSpec ? 'Étape 2 sur 2 — Kirby termine le fond IA…' : 'Kirby crée un nouveau fond IA…',
      'Le flyer est déjà modifiable. Le point bleu s’arrêtera automatiquement dès que le fond sera prêt.',
    );

    try {
      const data = await requestFlyer({
        mode: 'image',
        brief: buildGenerationBrief(limitText(els.flyerBrief.value, BRIEF_MAX_LENGTH)),
        format: getApiFormat(),
        supportType: state.supportType,
        spec: state.spec,
        regenerationNote: followsSpec
          ? ''
          : (limitText(els.variantInstruction.value, FIELD_LIMITS.variant)
            || 'Créer une alternative visuelle distincte tout en respectant la direction artistique et les informations du flyer.'),
        requestId: createRequestId(),
      }, state.inFlight.controller.signal);
      if (!isCurrent(serial)) return;

      const image = data.image || {};
      const url = safeImageUrl(image.url || image.dataUrl || '');
      if (!url) throw new Error('Le visuel reçu est vide ou dans un format non reconnu.');
      const decoded = new Image();
      decoded.src = url;
      await decoded.decode();
      if (!isCurrent(serial)) return;
      if (url === state.imageUrl) throw new Error('Kirby a renvoyé le même visuel. Aucun nouveau fond n’a été appliqué.');
      setImage(url, 'Kirby IA', true);
      if (fromVariant) setVariantFeedback('success', 'Nouveau fond appliqué. Textes, couleurs, QR code et mise en page conservés.');
      showFeedback(
        'success',
        state.supportType === 'business-card' ? 'Carte recto prête — création terminée.' : 'Flyer prêt — création terminée.',
        'Le visuel IA est chargé. Vous pouvez modifier chaque texte, couleur et coordonnée avant l’export.',
      );
      saveDraft();
      endRequest(serial);
      setBusy(false);
    } catch (error) {
      if (error.name === 'AbortError') {
        finishAbortedRequest(serial);
        return;
      }
      if (!isCurrent(serial)) return;
      state.lastFailedAction = () => generateImage(followsSpec, fromVariant);
      if (fromVariant) setVariantFeedback('error', humanizeError(error), { authRequired: isAuthRequiredError(error) });
      showFeedback(
        'error',
        isAuthRequiredError(error)
          ? 'Connexion requise pour créer une image avec Kirby IA.'
          : 'La maquette est conservée, mais l’image n’a pas été créée.',
        `${humanizeError(error)} Vous pouvez réessayer ou importer votre propre image.`,
        { authRequired: isAuthRequiredError(error) },
      );
      endRequest(serial);
      setBusy(false);
    }
  }

  async function requestFlyer(payload, signal) {
    const timeoutController = new AbortController();
    const timeoutMs = payload.mode === 'image' ? 290000 : payload.revision ? 100000 : 150000;
    let didTimeout = false;
    const timeout = window.setTimeout(() => {
      didTimeout = true;
      timeoutController.abort();
    }, timeoutMs);
    const onAbort = () => timeoutController.abort();
    signal.addEventListener('abort', onAbort, { once: true });

    try {
      throwIfAborted(timeoutController.signal);
      const accessToken = await getFlyerAccessToken(timeoutController.signal);
      throwIfAborted(timeoutController.signal);
      const response = await fetch('/api/flyers', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Request-Id': payload.requestId || createRequestId(),
        },
        body: JSON.stringify(payload),
        signal: timeoutController.signal,
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_error) {
        data = {};
      }

      if (!response.ok || data.ok === false) {
        const message = data.message || data.error || `Le service Flyers a répondu avec le statut ${response.status}.`;
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      if (didTimeout && !signal.aborted) {
        throw new Error('Kirby a dépassé le temps d’attente. La demande peut être relancée sans perdre votre brouillon.');
      }
      throw error;
    } finally {
      window.clearTimeout(timeout);
      signal.removeEventListener('abort', onAbort);
    }
  }

  async function initializeFlyerAuthClient(signal) {
    if (!flyerAuthClientPromise) {
      flyerAuthClientPromise = (async () => {
        const response = await fetch('/api/cv-auth-config', {
          method: 'GET',
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
          signal,
        });
        const config = await response.json().catch(() => ({}));
        if (!response.ok || !config.url || !config.anonKey) {
          const error = new Error('La connexion sécurisée n’est pas disponible sur cet environnement.');
          error.status = response.status || 503;
          throw error;
        }
        const { createClient } = await import(SUPABASE_MODULE_URL);
        return createClient(config.url, config.anonKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        });
      })().catch((error) => {
        flyerAuthClientPromise = null;
        throw error;
      });
    }
    return flyerAuthClientPromise;
  }

  async function getFlyerAccessToken(signal) {
    const client = await raceWithAbort(initializeFlyerAuthClient(signal), signal);
    const { data, error } = await raceWithAbort(client.auth.getSession(), signal);
    if (error) throw error;
    const accessToken = data?.session?.access_token;
    if (!accessToken) {
      const authError = new Error('Connectez-vous à SA Création Web pour lancer une génération. Les exemples et les modifications locales restent disponibles.');
      authError.status = 401;
      authError.code = 'flyer_auth_required';
      throw authError;
    }
    return accessToken;
  }

  function beginRequest(type) {
    if (state.inFlight?.controller) state.inFlight.controller.abort();
    state.lastFailedAction = null;
    const serial = ++state.requestSerial;
    state.inFlight = { type, serial, controller: new AbortController() };
    return serial;
  }

  function cancelVariantRequest() {
    if (state.inFlight?.type !== 'variant' && !state.inFlight?.fromVariant) return;
    state.inFlight.controller.abort();
    state.inFlight = null;
    state.lastFailedAction = () => generateSpec(true);
    setBusy(false);
    showFeedback('success', 'Demande annulée.', 'Votre flyer actuel et toutes vos modifications sont conservés.');
    setVariantFeedback('error', 'Demande annulée. Votre flyer et toutes vos modifications sont conservés.');
  }

  function endRequest(serial) {
    if (state.inFlight?.serial === serial) state.inFlight = null;
  }

  function isCurrent(serial) {
    return state.inFlight?.serial === serial;
  }

  function finishAbortedRequest(serial) {
    if (!isCurrent(serial)) return;
    endRequest(serial);
    setBusy(false);
    showFeedback('success', 'Génération interrompue.', 'Votre flyer actuel et toutes vos modifications sont conservés.');
  }

  function setBusy(isBusy) {
    [
      els.generateConceptButton,
      els.regenerateConceptButton,
      els.generateImageButton,
    ].forEach((button) => { button.disabled = isBusy; });
    const variantIsBusy = isBusy && (state.inFlight?.type === 'variant' || state.inFlight?.fromVariant);
    els.regenerateConceptButton.textContent = variantIsBusy
      ? 'Création de la variante…'
      : 'Proposer une autre direction';
    els.regenerateConceptButton.setAttribute('aria-busy', String(variantIsBusy));
    els.flyerBriefForm.setAttribute('aria-busy', String(isBusy));
  }

  function showFeedback(kind, title, detail, options = {}) {
    els.generationFeedback.hidden = false;
    els.generationFeedback.classList.toggle('is-loading', kind === 'loading');
    els.generationFeedback.classList.toggle('is-error', kind === 'error');
    els.generationFeedback.classList.toggle('is-success', kind === 'success');
    els.generationFeedback.dataset.state = kind;
    els.generationFeedback.setAttribute('aria-busy', String(kind === 'loading'));
    els.generationStatus.textContent = title;
    els.generationDetail.textContent = detail;
    els.retryButton.hidden = kind !== 'error' || !state.lastFailedAction;
    els.flyerAuthLink.hidden = !options.authRequired;
  }

  function setVariantFeedback(kind, message, options = {}) {
    els.variantStatus.hidden = false;
    els.variantStatus.classList.toggle('is-error', kind === 'error');
    els.variantStatus.classList.toggle('is-success', kind === 'success');
    els.variantStatus.textContent = message;
    els.cancelVariantButton.hidden = kind !== 'loading';
    els.variantAuthLink.hidden = !options.authRequired;
  }

  function clearVariantFeedback() {
    els.variantStatus.hidden = true;
    els.variantStatus.classList.remove('is-error', 'is-success');
    els.variantStatus.textContent = '';
    els.cancelVariantButton.hidden = true;
    els.variantAuthLink.hidden = true;
  }

  function setSupportType(value) {
    const nextSupportType = value === 'business-card' ? 'business-card' : 'flyer';
    if (state.supportType === nextSupportType && FORMATS[state.format]?.supportType === nextSupportType) return;
    state.supportType = nextSupportType;
    if (nextSupportType === 'business-card') {
      state.format = 'business-card';
    } else if (FORMATS[state.format]?.supportType !== 'flyer') {
      state.format = 'a5';
    }
    renderAll();
    markDirty();
  }

  function syncSupportControls() {
    const isBusinessCard = state.supportType === 'business-card';
    els.exportCardSheetButton.hidden = !isBusinessCard;
    document.getElementById('cardDuplexDimensions').hidden = !isBusinessCard;
    els.supportTypeFlyer.checked = !isBusinessCard;
    els.supportTypeBusinessCard.checked = isBusinessCard;
    Array.from(els.flyerFormat.options).forEach((option) => {
      const matches = option.dataset.support === state.supportType;
      option.hidden = !matches;
      option.disabled = !matches;
    });
    els.flyerCanvas.dataset.support = state.supportType;
    els.flyerDesignModels.hidden = false;
    els.designModelsLegend.textContent = isBusinessCard ? 'Modèles de carte' : 'Modèles complets';
    els.designModelsHint.textContent = isBusinessCard
      ? 'Chaque modèle change réellement la disposition, le fond, l’écriture et les couleurs de la carte.'
      : 'Un clic change la composition, l’écriture, le fond et les couleurs.';
    els.flyerCanvas.setAttribute(
      'aria-label',
      isBusinessCard ? 'Aperçu modifiable de la carte de visite recto' : 'Aperçu modifiable du flyer',
    );
    const label = els.generateConceptButton.querySelector('span');
    if (label) label.textContent = isBusinessCard ? 'Créer ma carte avec Kirby' : 'Créer mon flyer avec Kirby';
  }

  function loadStaticExample(exampleKey) {
    const example = EXAMPLE_SPECS[exampleKey];
    if (!example) return;
    state.imageChangeSerial += 1;
    state.imagePending = null;
    if (state.inFlight?.controller) state.inFlight.controller.abort();
    state.inFlight = null;
    state.lastFailedAction = null;
    setBusy(false);
    if (state.activeObjectUrl) URL.revokeObjectURL(state.activeObjectUrl);
    state.activeObjectUrl = '';
    state.imageUrl = example.imageUrl ? new URL(example.imageUrl, window.location.href).href : '';
    state.imageOrigin = example.imageUrl ? 'upload' : '';
    if(example.imageUrl) {state.imageFit='logo';state.imagePositionX=80;state.imagePositionY=25;state.imageSize=130;state.imageBlend=0;}
    state.supportType = example.supportType;
    state.format = example.format;
    state.decor = normalizeDecor(example.decor);
    state.spec = normalizeSpec(clone(example.spec));
    state.generated = false;
    state.dirty = true;
    els.flyerBrief.value = limitText(example.brief, BRIEF_MAX_LENGTH, false);
    els.flyerTypography.value = example.typography;
    els.flyerCanvas.dataset.typography = example.typography;
    syncEditorFromState();
    renderAll();
    els.draftState.textContent = 'Exemple local · modifiable';
    updateBriefCount();
    saveDraft();
    showFeedback(
      'success',
      'Exemple chargé sans appel à Kirby IA.',
      example.supportType === 'business-card'
        ? 'Ce brouillon recto 85 × 55 mm est modifiable et exportable. Ajoutez votre propre image ou lancez Kirby lorsque vous êtes connecté.'
        : 'Les textes, couleurs et coordonnées sont déjà modifiables. Ajoutez votre propre image ou lancez Kirby lorsque vous êtes connecté.',
    );
    document.getElementById('flyer-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function normalizeSpec(input) {
    const spec = clone(DEFAULT_SPEC);
    const source = input && typeof input === 'object' ? input : {};
    const sourceArt = source.artDirection && typeof source.artDirection === 'object' ? source.artDirection : {};
    const sourceCopy = source.copy && typeof source.copy === 'object' ? source.copy : {};
    const sourceContact = source.contact && typeof source.contact === 'object' ? source.contact : {};
    const sourceBrief = source.briefUnderstanding && typeof source.briefUnderstanding === 'object'
      ? source.briefUnderstanding : {};

    spec.briefUnderstanding = Object.assign(spec.briefUnderstanding, sourceBrief);
    spec.artDirection = Object.assign(spec.artDirection, sourceArt);
    spec.artDirection.layout = normalizeLayout(sourceArt.layout);
    spec.artDirection.palette = normalizePalette(sourceArt.palette);
    spec.artDirection.typography = Object.assign(spec.artDirection.typography, sourceArt.typography || {});
    spec.copy = Object.assign(spec.copy, sourceCopy);
    spec.copy.details = normalizeDetails(sourceCopy.details);
    spec.contact = Object.assign(spec.contact, sourceContact);

    spec.briefUnderstanding.activity = limitText(sourceBrief.activity, FIELD_LIMITS.activity)
      || DEFAULT_SPEC.briefUnderstanding.activity;
    spec.copy.eyebrow = limitText(sourceCopy.eyebrow, FIELD_LIMITS.eyebrow) || DEFAULT_SPEC.copy.eyebrow;
    spec.copy.headline = limitText(sourceCopy.headline, FIELD_LIMITS.headline) || DEFAULT_SPEC.copy.headline;
    spec.copy.supporting = limitText(sourceCopy.supporting, FIELD_LIMITS.supporting) || DEFAULT_SPEC.copy.supporting;
    spec.copy.offer = limitText(sourceCopy.offer, FIELD_LIMITS.offer);
    spec.copy.cta = limitText(sourceCopy.cta, FIELD_LIMITS.cta) || DEFAULT_SPEC.copy.cta;
    spec.copy.disclaimer = limitText(sourceCopy.disclaimer, FIELD_LIMITS.disclaimer);
    spec.contact.phone = limitText(sourceContact.phone, FIELD_LIMITS.phone);
    spec.contact.email = limitText(sourceContact.email, FIELD_LIMITS.email);
    spec.contact.website = canonicalizeKnownWebsite(
      spec.briefUnderstanding.activity,
      spec.copy.eyebrow,
      limitText(sourceContact.website, FIELD_LIMITS.website),
    );
    spec.contact.address = limitText(sourceContact.address, FIELD_LIMITS.address);
    spec.contact.qrValue = limitText(sourceContact.qrValue, FIELD_LIMITS.qrValue);
    spec.artDirection.imagePrompt = limitText(sourceArt.imagePrompt, FIELD_LIMITS.imagePrompt);
    spec.artDirection.negativePrompt = limitText(sourceArt.negativePrompt, FIELD_LIMITS.negativePrompt)
      || DEFAULT_SPEC.artDirection.negativePrompt;
    return spec;
  }

  function hasRevisableSpec(spec) {
    if (!spec || typeof spec !== 'object') return false;
    const understanding = spec.briefUnderstanding || {};
    const direction = spec.artDirection || {};
    const copy = spec.copy || {};
    return Boolean(
      cleanText(understanding.activity, '')
      && Array.isArray(understanding.audience) && understanding.audience.length
      && Array.isArray(understanding.tone) && understanding.tone.length
      && cleanText(direction.imagePrompt, '')
      && cleanText(copy.headline, '')
      && cleanText(copy.cta, '')
      && Array.isArray(copy.details) && copy.details.length >= 2
    );
  }

  function buildRevisionBriefFromSpec(spec) {
    const understanding = spec.briefUnderstanding || {};
    const copy = spec.copy || {};
    const parts = [
      `Activité : ${cleanText(understanding.activity, 'activité à préciser')}.`,
      cleanText(understanding.objective, '') ? `Objectif : ${understanding.objective}.` : '',
      cleanText(understanding.offer, '') ? `Offre : ${understanding.offer}.` : '',
      cleanText(copy.headline, '') ? `Accroche actuelle : ${copy.headline}.` : '',
    ];
    return limitText(parts.filter(Boolean).join(' '), BRIEF_MAX_LENGTH);
  }

  function normalizePalette(input) {
    const base = clone(DEFAULT_SPEC.artDirection.palette);
    const source = input && typeof input === 'object' ? input : {};
    Object.keys(base).forEach((key) => {
      base[key] = validHex(source[key]) ? source[key] : base[key];
    });

    base.ink = ensureContrast(base.ink, base.background, '#10151f');
    base.muted = ensureContrast(base.muted, base.background, base.ink);
    base.accentInk = ensureContrast(base.accentInk, base.accent, bestContrast(base.accent));
    return base;
  }

  function normalizeDetails(input) {
    if (!Array.isArray(input)) return clone(DEFAULT_SPEC.copy.details);
    const details = input
      .slice(0, 3)
      .map((item) => ({
        label: limitText(item?.label, FIELD_LIMITS.detailLabel),
        value: limitText(item?.value, FIELD_LIMITS.detailValue),
      }))
      .filter((item) => item.label || item.value);
    return details.length ? details : clone(DEFAULT_SPEC.copy.details);
  }

  function normalizeLayout(value) {
    return LAYOUTS.has(value) ? value : 'poster-cut';
  }

  function normalizeDecor(value) {
    const canonical = DECOR_ALIASES[value] || value;
    return DECORS.has(canonical) ? canonical : 'velvet-glow';
  }

  function canonicalizeKnownWebsite(activity, eyebrow, website) {
    const boundedWebsite = limitText(website, FIELD_LIMITS.website);
    const identity = `${cleanText(activity, '')} ${cleanText(eyebrow, '')}`;
    const isVeloursSecret = /\bvelours[\s-]*secret\b/i.test(identity)
      || /^(?:https?:\/\/)?(?:www\.)?velourssecret\.(?:fr|com)(?:[/?#].*)?$/i.test(boundedWebsite);
    return isVeloursSecret ? 'velourssecret.com' : boundedWebsite;
  }

  function syncEditorFromState() {
    const spec = state.spec;
    els.flyerEyebrow.value = spec.copy.eyebrow;
    els.flyerHeadline.value = spec.copy.headline;
    els.flyerSupporting.value = spec.copy.supporting;
    els.flyerOffer.value = spec.copy.offer;
    els.flyerCta.value = spec.copy.cta;
    els.flyerDisclaimer.value = spec.copy.disclaimer;
    els.flyerLayout.value = normalizeLayout(spec.artDirection.layout);
    const typographyPreset = presetForTypography(spec.artDirection.typography);
    els.flyerTypography.value = typographyPreset;
    els.flyerCanvas.dataset.typography = typographyPreset;
    syncPaletteEditor();
    els.flyerPhone.value = spec.contact.phone;
    els.flyerEmail.value = spec.contact.email;
    els.flyerWebsite.value = spec.contact.website;
    els.flyerAddress.value = spec.contact.address;
    els.flyerQrValue.value = spec.contact.qrValue;

    for (let index = 0; index < 3; index += 1) {
      const detail = spec.copy.details[index] || { label: '', value: '' };
      els[`detailLabel${index + 1}`].value = detail.label;
      els[`detailValue${index + 1}`].value = detail.value;
    }

    els.flyerEditor.setAttribute('aria-disabled', 'false');
    els.draftState.textContent = 'Proposition Kirby · modifiable';
  }

  function readDetailsFromEditor() {
    state.spec.copy.details = [1, 2, 3]
      .map((index) => ({
        label: limitText(els[`detailLabel${index}`].value, FIELD_LIMITS.detailLabel),
        value: limitText(els[`detailValue${index}`].value, FIELD_LIMITS.detailValue),
      }))
      .filter((item) => item.label || item.value);
  }

  function readPaletteFromEditor() {
    const palette = state.spec.artDirection.palette;
    palette.background = els.colorBackground.value;
    palette.surface = els.colorSurface.value;
    palette.ink = ensureContrast(els.colorInk.value, palette.background, bestContrast(palette.background));
    palette.muted = ensureContrast(palette.muted, palette.background, palette.ink);
    palette.accent = els.colorAccent.value;
    palette.accentInk = bestContrast(palette.accent);
  }

  function syncPaletteEditor() {
    const palette = state.spec.artDirection.palette;
    els.colorBackground.value = toColorValue(palette.background, '#f4efe5');
    els.colorSurface.value = toColorValue(palette.surface, '#ffffff');
    els.colorInk.value = toColorValue(palette.ink, '#10151f');
    els.colorAccent.value = toColorValue(palette.accent, '#ff5a36');
  }

  function applyPalettePreset(key) {
    const preset = PALETTE_PRESETS[key];
    if (!preset) return;
    state.spec.artDirection.palette = normalizePalette(clone(preset.palette));
    syncPaletteEditor();
    renderPalette();
    updatePalettePresetState();
    updateDesignModelState();
    markDirty();
  }

  function applyDesignModel(key) {
    const model = DESIGN_MODELS[key];
    const palettePreset = model && PALETTE_PRESETS[model.palettePreset];
    if (!model || !palettePreset) return;

    state.spec.artDirection.layout = normalizeLayout(model.layout);
    state.spec.artDirection.typography = typographyForPreset(model.typography);
    state.spec.artDirection.palette = normalizePalette(clone(palettePreset.palette));
    state.decor = normalizeDecor(model.decor);
    els.flyerLayout.value = state.spec.artDirection.layout;
    els.flyerTypography.value = model.typography;
    els.flyerCanvas.dataset.typography = model.typography;
    els.flyerDecor.value = state.decor;
    syncPaletteEditor();
    renderAll();
    markDirty();
  }

  function updateDesignModelState() {
    const palette = state.spec.artDirection.palette;
    document.querySelectorAll('[data-design-model]').forEach((button) => {
      const model = DESIGN_MODELS[button.dataset.designModel];
      const palettePreset = model && PALETTE_PRESETS[model.palettePreset];
      const matches = Boolean(model && palettePreset)
        && normalizeLayout(model.layout) === state.spec.artDirection.layout
        && model.typography === els.flyerTypography.value
        && normalizeDecor(model.decor) === state.decor
        && ['background', 'surface', 'ink', 'accent'].every(
          (paletteKey) => palette[paletteKey]?.toLowerCase() === palettePreset.palette[paletteKey].toLowerCase(),
        );
      button.setAttribute('aria-pressed', String(matches));
    });
  }

  function updatePalettePresetState() {
    const palette = state.spec.artDirection.palette;
    document.querySelectorAll('[data-palette-preset]').forEach((button) => {
      const preset = PALETTE_PRESETS[button.dataset.palettePreset];
      const matches = Boolean(preset)
        && ['background', 'surface', 'ink', 'accent'].every(
          (key) => palette[key]?.toLowerCase() === preset.palette[key].toLowerCase(),
        );
      button.setAttribute('aria-pressed', String(matches));
    });
  }

  function renderAll() {
    renderFormat();
    syncSupportControls();
    renderCopy();
    renderDetails();
    renderContact();
    renderPalette();
    renderDecor();
    renderImage();
    renderQr();
    els.flyerCanvas.dataset.layout = normalizeLayout(state.spec.artDirection.layout);
    updateDesignModelState();
  }

  function renderFormat() {
    const format = FORMATS[state.format] || FORMATS.a4;
    state.supportType = format.supportType;
    els.flyerCanvas.dataset.format = state.format;
    els.flyerCanvas.dataset.support = state.supportType;
    els.formatLabel.textContent = format.label;
    const shortFormat = format.label.split(' · ')[0];
    els.previewFormatName.textContent = state.supportType === 'business-card'
      ? 'Carte de visite · Recto'
      : `Flyer · ${shortFormat}`;
    if (els.flyerFormat.value !== state.format) els.flyerFormat.value = state.format;
  }

  function renderCopy() {
    els.previewEyebrow.textContent = state.spec.copy.eyebrow;
    els.previewHeadline.textContent = state.spec.copy.headline;
    els.previewSupporting.textContent = state.spec.copy.supporting;
    els.previewOffer.textContent = state.spec.copy.offer;
    els.previewOffer.hidden = !state.spec.copy.offer;
    els.previewCta.textContent = state.spec.copy.cta;
    els.previewDisclaimer.textContent = state.spec.copy.disclaimer;
    els.previewDisclaimer.hidden = !state.spec.copy.disclaimer;
    els.flyerCanvas.style.setProperty('--headline-scale', headlineScale(state.spec.copy.headline));
  }

  function renderDetails() {
    els.previewDetails.replaceChildren();
    state.spec.copy.details.slice(0, 3).forEach((detail) => {
      if (!detail.label && !detail.value) return;
      const wrapper = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = detail.label;
      description.textContent = detail.value;
      wrapper.append(term, description);
      els.previewDetails.append(wrapper);
    });
    els.previewDetails.hidden = !els.previewDetails.children.length;
  }

  function renderContact() {
    els.previewPhone.textContent = state.spec.contact.phone;
    els.previewEmail.textContent = state.spec.contact.email;
    els.previewWebsite.textContent = state.spec.contact.website;
    els.previewAddress.textContent = state.spec.contact.address;
    els.previewContact.hidden = ![
      state.spec.contact.phone,
      state.spec.contact.email,
      state.spec.contact.website,
      state.spec.contact.address,
    ].some(Boolean);
  }

  function renderPalette() {
    const palette = normalizePalette(state.spec.artDirection.palette);
    state.spec.artDirection.palette = palette;
    const canvas = els.flyerCanvas;
    canvas.style.setProperty('--flyer-background', palette.background);
    canvas.style.setProperty('--flyer-surface', palette.surface);
    canvas.style.setProperty('--flyer-ink', palette.ink);
    canvas.style.setProperty('--flyer-muted', palette.muted);
    canvas.style.setProperty('--flyer-accent', palette.accent);
    canvas.style.setProperty('--flyer-accent-ink', palette.accentInk);
    canvas.style.setProperty('--flyer-surface-ink', bestContrast(palette.surface));
    canvas.style.setProperty('--flyer-accent-a26', hexToRgba(palette.accent, 0.26));
    canvas.style.setProperty('--flyer-accent-a38', hexToRgba(palette.accent, 0.38));
    canvas.style.setProperty('--flyer-accent-a54', hexToRgba(palette.accent, 0.54));
    canvas.style.setProperty('--flyer-accent-a56', hexToRgba(palette.accent, 0.56));
    canvas.style.setProperty('--flyer-background-a86', hexToRgba(palette.background, 0.86));
    canvas.style.setProperty('--flyer-background-a92', hexToRgba(palette.background, 0.92));
    canvas.style.setProperty('--flyer-background-a95', hexToRgba(palette.background, 0.95));
    canvas.style.setProperty('--flyer-ink-a10', hexToRgba(palette.ink, 0.1));
    canvas.style.setProperty('--flyer-ink-a22', hexToRgba(palette.ink, 0.22));
    canvas.style.setProperty('--flyer-ink-a28', hexToRgba(palette.ink, 0.28));
    canvas.style.setProperty('--flyer-ink-a30', hexToRgba(palette.ink, 0.3));
    canvas.style.setProperty('--flyer-surface-a84', hexToRgba(palette.surface, 0.84));
    canvas.style.setProperty(
      '--flyer-surface-accent',
      ensureContrast(palette.accent, palette.surface, bestContrast(palette.surface)),
    );
  }

  function renderDecor() {
    state.decor = normalizeDecor(state.decor);
    els.flyerCanvas.dataset.decor = state.decor;
    if (els.flyerDecor.value !== state.decor) els.flyerDecor.value = state.decor;
    updatePalettePresetState();
  }

  function renderImage() {
    const mode = state.imageOrigin === 'upload' ? state.imageFit : 'cover';
    els.flyerCanvas.dataset.imageFit = mode;
    els.flyerImage.style.objectFit = mode === 'cover' ? 'cover' : 'contain';
    const imported = state.imageOrigin === 'upload' && Boolean(state.imageUrl);
    els.flyerCanvas.dataset.importedImage = String(imported);
    if (imported) els.flyerCanvas.style.setProperty('--import-blend', state.imageBlend / 100);
    else els.flyerCanvas.style.removeProperty('--import-blend');
    const im = els.flyerImage;
    im.draggable = false;
    if (imported && im.naturalWidth && im.getAttribute('src') === state.imageUrl) {
      const aspect = els.flyerCanvas.offsetWidth / els.flyerCanvas.offsetHeight;
      const imageAspect = im.naturalWidth / im.naturalHeight;
      let width = mode === 'cover' ? Math.max(1, imageAspect / aspect) : Math.min(1, imageAspect / aspect);
      if (mode === 'logo') width = Math.min(.26, .16 * imageAspect / aspect);
      width *= state.imageSize / 100;
      im.style.width = `${width * 100}%`;
      im.style.height = `${width * aspect / imageAspect * 100}%`;
      im.style.left = `${state.imagePositionX}%`;
      im.style.top = `${state.imagePositionY}%`;
      im.style.transform = 'translate(-50%, -50%)';
    } else if (!imported) {
      ['width', 'height', 'left', 'top', 'transform'].forEach(property => im.style.removeProperty(property));
    }
    im.style.objectPosition = '50% 50%';
    ['imageFit', 'imagePositionX', 'imagePositionY', 'imageSize', 'imageBlend'].forEach(id => {
      document.getElementById(id).value = state[id];
    });

    if (state.imageUrl) {
      if (els.flyerImage.src !== state.imageUrl) {
        els.flyerImage.onload = () => renderImage();
        els.flyerImage.src = state.imageUrl;
      }
      els.flyerCanvas.dataset.hasImage = 'true';
      els.imageCredit.textContent = state.imageOrigin === 'upload'
        ? 'Image personnelle importée.'
        : 'Visuel généré par Kirby IA, sans texte incrusté.';
    } else {
      els.flyerImage.removeAttribute('src');
      els.flyerCanvas.dataset.hasImage = 'false';
      els.imageCredit.textContent = 'Aucun visuel chargé. La composition abstraite reste exportable.';
    }
  }

  function renderQr() {
    const value = state.spec.contact.qrValue.trim();
    els.previewQr.replaceChildren();
    if (!value) {
      els.previewQr.hidden = true;
      return;
    }

    if (typeof window.QRCode !== 'function') {
      els.previewQr.hidden = true;
      return;
    }

    els.previewQr.hidden = false;
    try {
      new window.QRCode(els.previewQr, {
        text: value,
        width: 256,
        height: 256,
        colorDark: '#080b11',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    } catch (_error) {
      els.previewQr.hidden = true;
    }
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/i.test(file.type)) {
      showFeedback('error', 'Format d’image non accepté.', 'Utilisez une image JPEG, PNG, WebP ou AVIF.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      showFeedback('error', 'Cette image est trop lourde.', 'Choisissez une image de moins de 12 Mo.');
      event.target.value = '';
      return;
    }

    cancelPendingImage();
    const serial = ++state.imageChangeSerial;
    // Allow selecting the same file again and avoid transient blob URLs in exports.
    event.target.value = '';
    const pending = (async () => {
      try {
        const url = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Le fichier image ne peut pas être lu.'));
          reader.readAsDataURL(file);
        });
        const image = new Image();
        image.src = url;
        await image.decode();
        if (serial !== state.imageChangeSerial) return;
        setImage(url, 'upload', true);
        await waitForImage();
        if (serial !== state.imageChangeSerial) return;
        showFeedback('success', 'Votre image est chargée.', 'Les textes restent indépendants et peuvent encore être modifiés.');
        markDirty();
      } catch (error) {
        if (serial === state.imageChangeSerial) {
          showFeedback('error', 'Cette image ne peut pas être affichée.', 'Essayez une autre image JPEG, PNG, WebP ou AVIF.');
        }
      } finally {
        if (serial === state.imageChangeSerial) state.imagePending = null;
      }
    })();
    state.imagePending = pending;
  }

  function cancelPendingImage() {
    if (state.inFlight?.type !== 'image') return;
    const fromVariant = state.inFlight.fromVariant;
    state.inFlight.controller.abort();
    state.inFlight = null;
    setBusy(false);
    if (fromVariant) setVariantFeedback('success', 'Demande de fond interrompue : votre choix manuel d’image est prioritaire.');
  }

  function setImage(url, origin, revokeExisting) {
    if (revokeExisting && state.activeObjectUrl) {
      URL.revokeObjectURL(state.activeObjectUrl);
      state.activeObjectUrl = '';
    }
    state.imageUrl = url;
    state.imageOrigin = origin;
    renderImage();
  }

  function removeImage() {
    cancelPendingImage();
    state.imageChangeSerial += 1;
    state.imagePending = null;
    if (state.activeObjectUrl) URL.revokeObjectURL(state.activeObjectUrl);
    state.activeObjectUrl = '';
    state.imageUrl = '';
    state.imageOrigin = '';
    els.flyerImageUpload.value = '';
    renderImage();
    markDirty();
  }

  function configurePreviewFullscreen() {
    const isSupported = Boolean(
      document.fullscreenEnabled
      && els.previewFullscreen
      && typeof els.previewFullscreen.requestFullscreen === 'function',
    );
    els.previewDisplayActions.hidden = !isSupported;
    syncPreviewFullscreen();
  }

  async function enterPreviewFullscreen() {
    if (els.previewDisplayActions.hidden || document.fullscreenElement === els.previewFullscreen) return;
    const options = els.zoomPreviewButton.closest('details');
    if (options) options.open = false;
    els.previewFullscreenStatus.textContent = '';
    try {
      await els.previewFullscreen.requestFullscreen();
    } catch (_error) {
      handlePreviewFullscreenError();
    }
  }

  async function exitPreviewFullscreen() {
    els.previewStage.scrollTop = 0;
    els.previewStage.scrollLeft = 0;
    if (document.fullscreenElement !== els.previewFullscreen) return;
    try {
      await document.exitFullscreen();
    } catch (_error) {
      handlePreviewFullscreenError();
    }
  }

  function syncPreviewFullscreen() {
    const isActive = document.fullscreenElement === els.previewFullscreen;
    const didChange = state.previewIsFullscreen !== isActive;
    state.previewIsFullscreen = isActive;
    els.fitPreviewButton.setAttribute('aria-pressed', String(!isActive));
    els.zoomPreviewButton.setAttribute('aria-pressed', String(isActive));
    els.exitFullscreenButton.hidden = !isActive;
    els.previewStage.scrollTop = 0;
    els.previewStage.scrollLeft = 0;
    if (!didChange) return;

    els.previewFullscreenStatus.textContent = isActive
      ? 'Aperçu en plein écran. Le flyer entier reste ajusté à la fenêtre.'
      : 'Plein écran fermé. Retour à l’atelier.';
    window.requestAnimationFrame(() => {
      if (isActive) {
        els.exitFullscreenButton.focus({ preventScroll: true });
        return;
      }
      const summary = els.zoomPreviewButton.closest('details')?.querySelector('summary');
      if (summary) summary.focus({ preventScroll: true });
    });
  }

  function handlePreviewFullscreenError() {
    els.previewFullscreenStatus.textContent = 'Le plein écran n’a pas pu s’ouvrir. L’aperçu adapté reste disponible.';
    syncPreviewFullscreen();
    window.requestAnimationFrame(() => {
      const summary = els.zoomPreviewButton.closest('details')?.querySelector('summary');
      if (summary) summary.focus({ preventScroll: true });
    });
  }

  async function exportPng() {
    try {
      setExportBusy(true, 'Préparation du PNG haute définition…');
      const canvas = await renderExportCanvas();
      const blob = await canvasToBlob(canvas, 'image/png');
      downloadBlob(blob, buildFilename('png'));
      els.exportStatus.textContent = `PNG exporté en ${canvas.width} × ${canvas.height} px.`;
    } catch (error) {
      els.exportStatus.textContent = `Export impossible : ${humanizeError(error)}`;
    } finally {
      setExportBusy(false);
    }
  }

  async function exportPdf() {
    try {
      setExportBusy(true, 'Préparation du PDF…');
      if (!window.jspdf?.jsPDF) throw new Error('Le moteur PDF n’est pas disponible. Rechargez la page puis réessayez.');
      const canvas = await renderExportCanvas();
      const format = FORMATS[state.format] || FORMATS.a4;
      const imageData = canvas.toDataURL('image/png', 1);
      let pdf;

      if (format.mm) {
        pdf = new window.jspdf.jsPDF({
          orientation: format.mm[0] > format.mm[1] ? 'landscape' : 'portrait',
          unit: 'mm',
          format: format.pdf,
          compress: true,
          putOnlyUsedFonts: true,
        });
        pdf.addImage(imageData, 'PNG', 0, 0, format.mm[0], format.mm[1], undefined, 'FAST');
      } else {
        pdf = new window.jspdf.jsPDF({
          orientation: format.width > format.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [format.width, format.height],
          hotfixes: ['px_scaling'],
          compress: true,
        });
        pdf.addImage(imageData, 'PNG', 0, 0, format.width, format.height, undefined, 'FAST');
      }

      pdf.save(buildFilename('pdf'));
      if (state.supportType === 'business-card') {
        els.exportStatus.textContent = 'PDF de la carte recto exporté au format 85 × 55 mm.';
      } else if (format.mm) {
        els.exportStatus.textContent = `PDF exporté au format ${format.mm[0]} × ${format.mm[1]} mm.`;
      } else {
        els.exportStatus.textContent = `PDF ${format.width} × ${format.height} px exporté.`;
      }
    } catch (error) {
      els.exportStatus.textContent = `Export impossible : ${humanizeError(error)}`;
    } finally {
      setExportBusy(false);
    }
  }

  async function exportCardSheet() {
    if (state.supportType !== 'business-card' || state.format !== 'business-card') return;
    try {
      setExportBusy(true, 'Préparation de la planche A4…');
      if (!window.jspdf?.jsPDF || !window.KirbyCardSheet) {
        throw new Error('Le moteur PDF n’est pas disponible. Rechargez la page puis réessayez.');
      }
      const front = await renderExportCanvas({ cardSheet: true, side: 'front' });
      const back = await renderExportCanvas({ cardSheet: true, side: 'back' });
      const pdf = window.KirbyCardSheet.createPdf(window.jspdf.jsPDF, front.toDataURL('image/png'), back.toDataURL('image/png'));
      pdf.save(buildFilename('pdf').replace(/\.pdf$/, '-planche-a4-recto-verso.pdf'));
      els.exportStatus.textContent = 'Planche A4 paysage : 4 cartes de 85 × 55 mm, grille 2 × 2, espacement 5 mm. Page 1 : rectos ; page 2 : versos. Impression recto verso à 100 %, retournement sur le bord court.';
    } catch (error) {
      els.exportStatus.textContent = `Export impossible : ${humanizeError(error)}`;
    } finally {
      setExportBusy(false);
    }
  }

  let exportWarnings=[];
  async function renderExportCanvas({ cardSheet = false, side = 'front' } = {}) {
    if (typeof window.html2canvas !== 'function') {
      throw new Error('Le moteur d’export n’est pas disponible. Rechargez la page puis réessayez.');
    }

    if (document.fonts?.ready) await document.fonts.ready;
    while (state.imagePending) await state.imagePending;
    await waitForImage();
    const format = cardSheet ? { width: 1004, height: 650 } : (FORMATS[state.format] || FORMATS.a4);
    const scale = cardSheet ? 1 : Math.max(1, format.width / els.flyerCanvas.getBoundingClientRect().width);
    const canvas = await window.html2canvas(els.flyerCanvas, {
      backgroundColor: null,
      scale,
      useCORS: true,
      allowTaint: false,
      imageTimeout: 45000,
      logging: false,
      width: cardSheet ? format.width : els.flyerCanvas.offsetWidth,
      height: cardSheet ? format.height : els.flyerCanvas.offsetHeight,
      onclone: async (clonedDocument) => {
        if (cardSheet) {
          const root = clonedDocument.getElementById('flyerCanvas');
          root.dataset.printSheet = 'duplex';
          root.dataset.printSide = side;
          // Keep contact information once: the website already belongs to the recto.
          // Work only in the export clone; the editable brief remains untouched.
          if (side === 'back') {
            const website = root.querySelector('#previewWebsite')?.textContent.trim();
            if (website) {
              const normalize = value => value.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
              root.querySelectorAll('.flyer-details > div').forEach(row => {
                if (normalize(row.querySelector('dd')?.textContent.trim() || '') === normalize(website)) row.remove();
              });
              root.querySelector('#previewWebsite').remove();
            }
            if (!root.querySelector('.flyer-contact')?.textContent.trim()) root.querySelector('.flyer-action-zone')?.remove();
          }

          root.style.width = format.width + 'px';
          root.style.height = format.height + 'px';
          root.style.maxWidth = 'none';
          root.style.maxHeight = 'none';
        }
        const printRoot=clonedDocument.getElementById('flyerCanvas');
        const widthMM=cardSheet?85:FORMATS[state.format].mm?.[0];
        exportWarnings=[];
        if(widthMM) {
          const bounds=printRoot.getBoundingClientRect();
          for(const el of printRoot.querySelectorAll('h1,h2,p,dd,dt,.flyer-contact span')) {
            const box=el.getBoundingClientRect();if(!box.width||!box.height||!el.textContent.trim())continue;
            const pt=parseFloat(clonedDocument.defaultView.getComputedStyle(el).fontSize)*widthMM/bounds.width*72/25.4;
            if(pt<8 && !exportWarnings.includes('Certains textes sont inférieurs à 8 points'))exportWarnings.push('Certains textes sont inférieurs à 8 points');
            if((box.right>bounds.right+1||box.bottom>bounds.bottom+1||el.scrollWidth>el.clientWidth+2)&&!exportWarnings.includes('Un texte dépasse sa zone'))exportWarnings.push('Un texte dépasse sa zone');
          }
        }
        const image = clonedDocument.getElementById('flyerImage');
        if (!image?.getAttribute('src')) return;
        image.style.transition = 'none';
        await image.decode();
        // html2canvas does not apply object-fit: cover. Bake only the image's
        // crop into its export clone, keeping all layout and overlay styles.
        const box = image.getBoundingClientRect();
        if (!box.width || !box.height) return;
        const crop = clonedDocument.createElement('canvas');
        crop.width = Math.max(1, Math.round(box.width * scale));
        crop.height = Math.max(1, Math.round(box.height * scale));
        const computed = clonedDocument.defaultView.getComputedStyle(image);
        const contain = computed.objectFit === 'contain';
        const ratio = (contain ? Math.min : Math.max)(crop.width / image.naturalWidth, crop.height / image.naturalHeight);
        const [px, py] = computed.objectPosition.split(' ').map(value => parseFloat(value) / 100);
        const width = image.naturalWidth * ratio, height = image.naturalHeight * ratio;
        crop.getContext('2d').drawImage(image,
          (crop.width - width) * px, (crop.height - height) * py, width, height);
        image.src = crop.toDataURL('image/png');
        await image.decode();
      },
    });

    if (canvas.width === format.width && canvas.height === format.height) return canvas;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = format.width;
    finalCanvas.height = format.height;
    const context = finalCanvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(canvas, 0, 0, format.width, format.height);
    return finalCanvas;
  }

  async function waitForImage() {
    if (!state.imageUrl) return;
    try {
      await els.flyerImage.decode();
      if (!els.flyerImage.naturalWidth) throw new Error('Image vide');
    } catch (_error) {
      throw new Error('L’image ne peut pas être affichée. Importez-la à nouveau avant l’export.');
    }
  }

  function setExportBusy(isBusy, message) {
    els.exportPngButton.disabled = isBusy;
    els.exportPdfButton.disabled = isBusy;
    els.exportCardSheetButton.disabled = isBusy;
    if (message) els.exportStatus.textContent = message;
    if (!isBusy) {const warnings=collectPrintWarnings();if(warnings.length) els.exportStatus.textContent+=' À vérifier : '+warnings.join(' · ');}
  }

  function canvasToBlob(canvas, type) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Le navigateur n’a pas pu créer le fichier.'));
      }, type, 1);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function buildFilename(extension) {
    const fallbackName = state.supportType === 'business-card' ? 'carte-kirby' : 'flyer-kirby';
    const activity = cleanText(state.spec.briefUnderstanding.activity, fallbackName)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 42) || fallbackName;
    return `${activity}-${state.format}.${extension}`;
  }

  function markDirty() {
    state.dirty = true;
    els.draftState.textContent = 'Enregistrement en cours…';
    window.clearTimeout(markDirty.timer);
    markDirty.timer = window.setTimeout(saveDraft, 350);
  }

  function draftSnapshot() {
    return {brief:els.flyerBrief.value,supportType:state.supportType,format:state.format,decor:state.decor,
      spec:structuredClone(state.spec),typography:els.flyerTypography.value,generated:state.generated,
      ...Object.fromEntries(['imageUrl','imageOrigin','imageFit','imagePositionX','imagePositionY','imageSize','imageBlend'].map(k=>[k,state[k]]))};
  }
  let draftSaving=Promise.resolve();
  function saveDraft() {
    const saved=draftSnapshot();
    draftSaving=draftSaving.catch(()=>{}).then(async()=>{
      try {
        if(exampleKey) sessionStorage.setItem(draftKey,JSON.stringify(saved));
        else await KirbyWorkspace.access('put',{id:'flyers-active-draft',snapshot:saved});
        els.draftState.textContent='Modifications enregistrées sur cet appareil';
        window.KirbyWorkspace?.capture();
      } catch (_) {els.draftState.textContent='Sauvegarde indisponible : exportez votre création pour la conserver.';}
    });
    return draftSaving;
  }
  function applyDraft(saved) {
    if(!saved || typeof saved!=='object') return false;
    els.flyerBrief.value=limitText(saved.brief||'',BRIEF_MAX_LENGTH,false);
    const format=saved.format==='instagram'?'instagram-square':saved.format;
    if(FORMATS[format]) state.format=format;
    state.supportType=FORMATS[state.format].supportType;
    state.decor=normalizeDecor(saved.decor);
    if(saved.spec) state.spec=normalizeSpec(saved.spec);
    state.generated=Boolean(saved.generated);
    for(const k of ['imageUrl','imageOrigin','imageFit','imagePositionX','imagePositionY','imageSize','imageBlend']) if(saved[k]!==undefined) state[k]=saved[k];
    els.flyerTypography.value=['modern','geometric','editorial','human'].includes(saved.typography)?saved.typography:'modern';
    els.flyerCanvas.dataset.typography=els.flyerTypography.value;
    syncEditorFromState();return true;
  }
  async function restoreDraft() {
    try {
      let saved;
      if(!exampleKey) {try{saved=(await KirbyWorkspace.access('get','flyers-active-draft'))?.snapshot;}catch(_){/* Try the legacy draft when IndexedDB is unavailable. */}}
      if(!saved) saved=JSON.parse((exampleKey?sessionStorage:localStorage).getItem(draftKey)||'null');
      const restored=applyDraft(saved); if(restored) els.draftState.textContent='Brouillon et image restaurés';return restored;
    } catch (_) {return false;}
  }
  async function previewPrint() {
    const d=KirbyWorkspace.dialog('Aperçu avant impression');
    const note=document.createElement('p');note.textContent='Préparation du rendu…';d.append(note);
    try {
      const card=state.format==='business-card';
      note.textContent=card?'Carte : 85 × 55 mm. A4 paysage : 297 × 210 mm, 4 cartes (2 × 2), espacement 5 mm. Marges gauche/droite 61 mm ; haut/bas 47,5 mm. Recto verso à 100 %, bord court.':`Format : ${(FORMATS[state.format].mm||[FORMATS[state.format].width,FORMATS[state.format].height]).join(' × ')} ${FORMATS[state.format].mm?'mm':'px'}.`;
      const tabs=document.createElement('div');tabs.className='workspace-tools';d.append(tabs);
      const display=document.createElement('img');display.alt='Rendu exporté';d.append(display);
      let first=true;const allWarnings=[];
      const addView=(label,src)=>{const button=document.createElement('button');button.textContent=label;button.type='button';button.setAttribute('aria-pressed',String(first));button.onclick=()=>{display.src=src;display.alt=label;for(const b of tabs.children)b.setAttribute('aria-pressed',String(b===button));};tabs.append(button);if(first){display.src=src;display.alt=label;first=false;}};
      for(const side of card?['front','back']:['front']) {
        const canvas=await renderExportCanvas({cardSheet:card,side});allWarnings.push(...exportWarnings);
        addView(side==='front'?'Recto':'Verso',canvas.toDataURL());
        if(card) {
          const l=KirbyCardSheet.layout, sheet=document.createElement('canvas');sheet.width=l.pageWidth*10;sheet.height=l.pageHeight*10;
          const ctx=sheet.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,sheet.width,sheet.height);ctx.scale(10,10);ctx.strokeStyle='#828282';ctx.lineWidth=.1;
          const line=(x1,y1,x2,y2)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
          for(let row=0;row<2;row++)for(let col=0;col<2;col++){
            const frontX=l.marginX+col*(l.width+l.gap), x=side==='back'?l.pageWidth-frontX-l.width:frontX,y=l.marginY+row*(l.height+l.gap);
            ctx.drawImage(canvas,x,y,l.width,l.height);
            for(const edgeX of [x,x+l.width]){line(edgeX,y-2,edgeX,y-.5);line(edgeX,y+l.height+.5,edgeX,y+l.height+2);}
            for(const edgeY of [y,y+l.height]){line(x-2,edgeY,x-.5,edgeY);line(x+l.width+.5,edgeY,x+l.width+2,edgeY);}
          }
          addView(side==='front'?'A4 — rectos':'A4 — versos',sheet.toDataURL());
        }
      }
      exportWarnings=[...new Set(allWarnings)];
      const warnings=collectPrintWarnings();const p=document.createElement('p');p.textContent=warnings.length?'À vérifier (export autorisé) : '+warnings.join(' · '):'Aucun problème détecté par les contrôles automatiques. Vérifiez le rendu avant impression.';d.append(p);
    } catch (_) {note.textContent='Aperçu indisponible. Réessayez après le chargement des images.';}
  }
  function collectPrintWarnings() {
    const warnings=[...exportWarnings];const root=els.flyerCanvas;const mm=FORMATS[state.format].mm;
    if(state.supportType==='business-card'&&!state.spec.contact.qrValue.trim())warnings.push('Aucun lien QR renseigné');
    if(mm && state.supportType!=='business-card') { const ratio=mm[0]/root.getBoundingClientRect().width*72/25.4;const small=[...root.querySelectorAll('p,dd,dt,span')].some(el=>el.getClientRects().length&&el.textContent.trim()&&parseFloat(getComputedStyle(el).fontSize)*ratio<8);if(small)warnings.push('Certains textes seront imprimés à moins de 8 points'); }
    for(const el of root.querySelectorAll('h1,h2,p,dd,dt,.flyer-contact span')) {
      if(!el.getClientRects().length||!el.textContent.trim())continue;
      if(el.scrollWidth>el.clientWidth+2) {warnings.push('Un texte dépasse sa zone');break;}
    }
    if(mm && state.imageUrl && els.flyerImage.naturalWidth) {
      const widthMM=els.flyerImage.getBoundingClientRect().width/root.getBoundingClientRect().width*mm[0];
      if(els.flyerImage.naturalWidth/(widthMM/25.4)<150)warnings.push('Image peu définie à cette taille d’impression');
    }
    return warnings;
  }

  function updateBriefCount() {
    els.briefCount.textContent = `${els.flyerBrief.value.length} / ${BRIEF_MAX_LENGTH}`;
  }

  function presetForTypography(typography) {
    const display = cleanText(typography?.display, '').toLowerCase();
    const body = cleanText(typography?.body, '').toLowerCase();
    const signature = `${display} ${body}`;
    if (/playfair|\bserif\b|editorial/.test(signature)) return 'editorial';
    if (/dm sans|human|friendly|rounded/.test(signature)) return 'human';
    if (/geometric|space grotesk|architectural/.test(signature)) return 'geometric';
    return 'modern';
  }

  function typographyForPreset(preset) {
    if (preset === 'editorial') return { display: 'Playfair Display', body: 'Manrope' };
    if (preset === 'human') return { display: 'DM Sans', body: 'DM Sans' };
    if (preset === 'geometric') return { display: 'Space Grotesk', body: 'Manrope' };
    return { display: 'Space Grotesk', body: 'Manrope' };
  }

  function headlineScale(text) {
    const length = cleanText(text, '').length;
    if (length <= 28) return '0.9';
    if (length <= 52) return '0.76';
    if (length <= 72) return '0.64';
    return '0.55';
  }

  function safeImageUrl(value) {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    // Sous-types autorisés : ^data:image\/png|jpeg|webp|avif;base64,
    if (/^data:image\/(png|jpeg|webp|avif);base64,/i.test(trimmed)) return trimmed;
    if (/^https:\/\//i.test(trimmed)) return trimmed;
    return '';
  }

  function humanizeError(error) {
    if (!error) return 'Une erreur inconnue est survenue.';
    if (error.status === 401 || error.status === 403) {
      return 'Connectez-vous à SA Création Web, puis relancez la génération. Votre brouillon local est conservé.';
    }
    if (error.status === 429) return 'Le service est momentanément très sollicité. Attendez quelques secondes puis réessayez.';
    if (error.status === 503) return error.message || 'Le service Flyers n’est pas configuré sur cet environnement.';
    if (error instanceof TypeError && /fetch/i.test(error.message)) return 'La connexion au service Flyers a été interrompue.';
    return cleanText(error.message, 'Une erreur inattendue est survenue.');
  }

  function isAuthRequiredError(error) {
    return error?.code === 'flyer_auth_required' || error?.status === 401 || error?.status === 403;
  }

  function getApiFormat() {
    return FORMATS[state.format] ? state.format : 'a4';
  }

  function buildGenerationBrief(brief) {
    const source = limitText(brief, BRIEF_MAX_LENGTH);
    if (state.supportType === 'business-card') {
      return `${source}\n\nTYPE DE SUPPORT : carte de visite RECTO au format 85 × 55 mm. Compose un objet d’identité distinct d’un flyer et d’une page web : nom ou marque, promesse très courte, rôle ou offre et coordonnées essentielles. Le résultat doit rester élégant, crédible et lisible à petite taille. Ne duplique aucune information. Ne place aucun texte, prix, logo, coordonnée ni QR code dans l’image : ces éléments restent des calques éditables dans l’application. Réponds dans le schéma demandé pour le moteur de composition.`;
    }
    return `${source}\n\nTYPE DE SUPPORT : véritable flyer publicitaire, pas une page de site réduite. Crée un univers visuel propre au métier, actuel et distinct des autres secteurs. Évite les modèles génériques recolorés, les murs de cartes, les cadres façon WordPress, les titres démesurés et les doublons. Utilise une accroche courte, une hiérarchie élégante et des informations essentielles présentes une seule fois. Ne place aucun texte, prix, logo, coordonnée ni QR code dans l’image : ces éléments restent des calques éditables dans l’application.`;
  }

  function fieldLimitForPath(path) {
    const limits = {
      'copy.eyebrow': FIELD_LIMITS.eyebrow,
      'copy.headline': FIELD_LIMITS.headline,
      'copy.supporting': FIELD_LIMITS.supporting,
      'copy.offer': FIELD_LIMITS.offer,
      'copy.cta': FIELD_LIMITS.cta,
      'copy.disclaimer': FIELD_LIMITS.disclaimer,
      'contact.phone': FIELD_LIMITS.phone,
      'contact.email': FIELD_LIMITS.email,
      'contact.website': FIELD_LIMITS.website,
      'contact.address': FIELD_LIMITS.address,
      'contact.qrValue': FIELD_LIMITS.qrValue,
    };
    return limits[path] || 300;
  }

  function limitText(value, maxLength, trim = true) {
    const text = typeof value === 'string' ? value : '';
    const bounded = text.slice(0, Math.max(0, maxLength || 0));
    return trim ? bounded.trim() : bounded;
  }

  function throwIfAborted(signal) {
    if (!signal?.aborted) return;
    const error = new Error('La demande a été interrompue.');
    error.name = 'AbortError';
    throw error;
  }

  function raceWithAbort(promise, signal) {
    throwIfAborted(signal);
    if (!signal) return Promise.resolve(promise);
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        const error = new Error('La demande a été interrompue.');
        error.name = 'AbortError';
        reject(error);
      };
      signal.addEventListener('abort', onAbort, { once: true });
      Promise.resolve(promise).then(
        (value) => {
          signal.removeEventListener('abort', onAbort);
          resolve(value);
        },
        (error) => {
          signal.removeEventListener('abort', onAbort);
          reject(error);
        },
      );
    });
  }

  function cleanText(value, fallback) {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }

  function setPath(target, path, value) {
    const parts = path.split('.');
    let cursor = target;
    for (let index = 0; index < parts.length - 1; index += 1) {
      if (!cursor[parts[index]] || typeof cursor[parts[index]] !== 'object') cursor[parts[index]] = {};
      cursor = cursor[parts[index]];
    }
    cursor[parts[parts.length - 1]] = value;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createRequestId() {
    return typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `flyer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  window.KirbyFlyers = Object.freeze({
    formats: Object.freeze(clone(FORMATS)),
    getState: () => clone({
      supportType: state.supportType,
      format: state.format,
      generated: state.generated,
      inFlight: state.inFlight ? state.inFlight.type : null,
    }),
    loadExample: loadStaticExample,
  });

  function validHex(value) {
    return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
  }

  function hexToRgba(value, alpha) {
    const hex = validHex(value) ? value.slice(1) : '000000';
    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function toColorValue(value, fallback) {
    return validHex(value) ? value : fallback;
  }

  function hexToRgb(hex) {
    const normalized = validHex(hex) ? hex.slice(1) : '000000';
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }

  function luminance(hex) {
    const rgb = hexToRgb(hex);
    const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
  }

  function contrastRatio(foreground, background) {
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  }

  function bestContrast(background) {
    return contrastRatio('#fffdf8', background) >= contrastRatio('#0b0f16', background)
      ? '#fffdf8' : '#0b0f16';
  }

  function ensureContrast(foreground, background, fallback) {
    const fg = validHex(foreground) ? foreground : fallback;
    const bg = validHex(background) ? background : '#ffffff';
    if (validHex(fg) && contrastRatio(fg, bg) >= 4.5) return fg;
    const safe = bestContrast(bg);
    return contrastRatio(safe, bg) >= 4.5 ? safe : fallback;
  }
}());
