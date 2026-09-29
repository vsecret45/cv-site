window.addEventListener('load', async () => {
  if (!document.querySelector('#cv-form') || !window.KirbyWorkspace) return;
  const busy = () => isLoadingCvDraft || isApplyingKirbyCvChange || isImportingCvPreview || isReplacingCvDocument;
  await loadAuthSession();
  await KirbyWorkspace.register({
    kind:'CV', mount:document.querySelector('#cv-form').parentElement,
    title:()=>{ const data=JSON.parse(getCvHistoryState()); return 'CV — '+(data.values.fullName || data.values.name || 'Mon document'); },
    busy:()=>busy() || currentPreviewMode!=='cv',
    snapshot:()=>getCvHistoryState(),
    thumbnail:async()=>{try{const c=await html2canvas(document.querySelector('#cv-preview'),{scale:.25,logging:false,useCORS:true});return c.toDataURL('image/jpeg',.6);}catch(_){return null;}},
    restore:async saved=>{ if(busy()) throw Error('CV occupé'); if(!restoreCvHistorySnapshot(saved,'Version restaurée'))throw Error('Version invalide'); }
  });
  const check=document.createElement('button');check.type='button';check.textContent='Vérifier avant export';
  check.onclick=()=>{
    const d=KirbyWorkspace.dialog('Vérification du CV');const p=document.createElement('p');
    const root=document.querySelector('#cv-preview');const warnings=[];
    if(root) for(const el of root.querySelectorAll('p,li,h1,h2,h3')) {if(el.getClientRects().length && el.scrollWidth>el.clientWidth+2){warnings.push('Un texte dépasse sa zone : vérifiez les lignes longues.');break;}}
    p.textContent=warnings.length?warnings.join(' '):'Aucun débordement horizontal détecté. Vérifiez aussi les sauts de page dans l’aperçu PDF avant impression.';
    d.append(p);
  };
  document.querySelector('.workspace-tools').append(check);
});
