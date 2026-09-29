/* Local project library. Snapshots (including images) stay in this browser. */
(() => {
  'use strict';
  let ownerOverride, database, adapter, currentId, past = [], future = [], previous, historyOwner, restoring = false, timer;
  const open = () => database ||= new Promise((resolve, reject) => {
    const r = indexedDB.open('kirby-workspace-v1', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('records', {keyPath:'id'});
    r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
  }).catch(e => { database = null; throw e; });
  async function access(method, value) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('records', method === 'get' || method === 'getAll' ? 'readonly' : 'readwrite');
      const r = tx.objectStore('records')[method](value);
      tx.oncomplete = () => resolve(r.result); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
  }
  const scope = () => { try { return typeof currentUser !== 'undefined' && currentUser?.id || ownerOverride || 'guest'; } catch (_) { return ownerOverride || 'guest'; } };
  const status = text => { const el = document.getElementById('workspace-status'); if(el) el.textContent = text; };
  const snapshot = () => JSON.stringify(adapter?.snapshot());
  function controls() { document.querySelectorAll('[data-workspace-history]').forEach(b => b.disabled = restoring || adapter?.busy?.() || !(b.dataset.workspaceHistory === 'undo' ? past.length : future.length)); }
  async function changeHistory(redo) {
    if (!adapter || adapter.busy?.() || restoring) return;
    if(historyOwner!==scope()){past=[];future=[];previous=snapshot();historyOwner=scope();controls();return;}
    const source = redo ? future : past, target = redo ? past : future;
    if(!source.length) return;
    const next = source[source.length - 1]; restoring = true; controls();
    try { await adapter.restore(JSON.parse(next)); source.pop(); target.push(previous); previous = snapshot(); status(redo ? 'Modification rétablie.' : 'Modification annulée.'); }
    catch (_) { status('Restauration impossible. La version reste disponible.'); }
    finally { restoring = false; controls(); }
  }
  function capture() {
    if(!adapter || restoring || adapter.busy?.()) return;
    if(historyOwner!==scope()){past=[];future=[];previous=undefined;historyOwner=scope();}
    const next = snapshot();
    if(previous && previous !== next) { past.push(previous); if(past.length > 20) past.shift(); future = []; }
    previous = next; controls();
  }
  function dialog(title) {
    const d = document.createElement('dialog'); d.className = 'workspace-dialog';
    const h = document.createElement('h2'); h.textContent = title;
    const close = document.createElement('button'); close.textContent = 'Fermer'; close.onclick = () => d.close();
    d.append(h, close); d.addEventListener('close', () => d.remove()); document.body.append(d); d.showModal(); return d;
  }
  async function save() {
    if(!adapter || restoring || adapter.busy?.()) return status('Attendez la fin de la génération pour enregistrer une version.');
    capture(); const id = crypto.randomUUID();
    try { await access('put', {id, owner:scope(), kind:adapter.kind, title:adapter.title(), path:location.pathname, snapshot:adapter.snapshot(), thumbnail:await adapter.thumbnail?.(), savedAt:Date.now()}); currentId = id; status('Projet enregistré sur cet appareil.'); }
    catch (_) { status('Enregistrement impossible sur cet appareil. Exportez votre création pour la conserver.'); }
  }
  async function library() {
    const d = dialog('Mes projets'); const note = document.createElement('p'); note.textContent = 'Sauvegardés dans ce navigateur, sur cet appareil. Les données peuvent être effacées avec celles du navigateur.'; d.append(note);
    try {
      const rows = (await access('getAll')).filter(r => r.owner === scope() && r.kind).sort((a,b) => b.savedAt-a.savedAt);
      if(!rows.length) note.textContent += ' Aucun projet enregistré pour le moment.';
      for(const row of rows) {
        const item = document.createElement('article'), name = document.createElement('strong'), date = document.createElement('p'), link = document.createElement('a'), copy = document.createElement('button');
        if(row.thumbnail && /^(data:image\/|https?:)/.test(row.thumbnail)){const image=document.createElement('img');image.src=row.thumbnail;image.alt='Aperçu du projet';image.style.cssText='width:140px;max-height:90px;object-fit:contain;display:block';item.append(image);}
        name.textContent = row.title; date.textContent = `${row.kind} · ${new Date(row.savedAt).toLocaleString('fr-FR')}`;
        link.textContent = 'Reprendre'; link.href = `${row.path}?project=${encodeURIComponent(row.id)}`;
        copy.textContent = 'Dupliquer'; copy.onclick = async () => { try {await access('put', {...row,id:crypto.randomUUID(),title:row.title+' — copie',savedAt:Date.now()}); d.close(); library();} catch (_) {status('Duplication impossible.');} };
        item.append(name,date,link,copy); d.append(item);
      }
    } catch (_) { note.textContent = 'La sauvegarde locale est indisponible dans ce navigateur.'; }
  }
  async function register(value) {
    adapter = value;
    const bar = document.createElement('section'); bar.className = 'workspace-tools'; bar.setAttribute('aria-label','Projets et historique');
    for(const [label, action] of [['Mes projets',library],['Enregistrer une version',save],['Annuler',()=>changeHistory(false)],['Rétablir',()=>changeHistory(true)]]) {
      const b = document.createElement('button'); b.type='button'; b.textContent=label; b.onclick=action;
      if(label==='Annuler'||label==='Rétablir') b.dataset.workspaceHistory=label==='Annuler'?'undo':'redo'; bar.append(b);
    }
    const info = document.createElement('span'); info.id='workspace-status'; info.setAttribute('aria-live','polite'); bar.append(info);
    (value.mount || document.querySelector('main') || document.body).prepend(bar);
    const id = new URLSearchParams(location.search).get('project');
    if(id) try { const row = await access('get',id); if(row?.owner===scope() && row.kind===adapter.kind) {await adapter.restore(row.snapshot); currentId=null; status('Version restaurée. Le prochain enregistrement créera une nouvelle version.');} } catch (_) {status('Cette version n’a pas pu être restaurée.');}
    previous=snapshot(); historyOwner=scope(); controls();
    document.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(capture,700);});
    document.addEventListener('change',()=>{clearTimeout(timer);timer=setTimeout(capture,50);});
  }
  window.KirbyWorkspace={register,capture,dialog,access,setOwner:id=>{ownerOverride=id||undefined;}};
})();
