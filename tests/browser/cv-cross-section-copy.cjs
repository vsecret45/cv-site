const { execFileSync } = require('node:child_process');
const cli = process.env.AGENT_BROWSER_CLI;
if (!cli) throw Error('AGENT_BROWSER_CLI required');
const args = [cli, '--session', 'cv-cross-section-copy'];
const run = (...more) => execFileSync(process.execPath, [...args, ...more], { encoding: 'utf8', maxBuffer: 5e6 });
const ev = code => JSON.parse(execFileSync(process.execPath, [...args, 'eval', '--stdin'], { input: code, encoding: 'utf8', maxBuffer: 5e6 }));
const drag = points => {
    run('mouse','move',String(Math.ceil(points.start.x)),String(Math.round(points.start.y)));run('mouse','down');
    run('mouse','move',String(Math.ceil(points.end.x)),String(Math.round(points.end.y)));run('mouse','up');
};
const coordinates = `async()=>{
    previewNodes.summary.scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const point=(node,end)=>{const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);const texts=[];while(walker.nextNode())if(walker.currentNode.length)texts.push(walker.currentNode);const text=end?texts.at(-1):texts[0];const r=document.createRange();r.setStart(text,end?text.length:0);r.collapse(true);const b=r.getBoundingClientRect();return {x:b.x+(end?1:0),y:b.y+b.height/2}};
    return {start:point(previewNodes.summary,false),end:point(previewNodes.experience,true)};
}`;
try {
    run('open',(process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8000')+'/cv.html');run('snapshot','-i');
    ev(`(()=>{currentUser={id:'cv-cross-section-copy',email:'synthetic@example.invalid',name:''};supersedePendingCvDraftLoad();updateAuthUi();refreshCvModule();openBlankCvSheet({persist:false});for(const [key,value] of Object.entries({summary:'DEBUT PROFIL CRM RGPD',experience:'EXPERIENCE WORD API 2025',education:'FORMATION IFRS 2020'})){cvForm.elements[key].value=value;rememberManualCvField(key)}cvForm.elements.layoutTheme.value='wordpro';updateCvPreview();return true})()`);
    drag(ev(`(${coordinates})()`));
    const before=ev('getSelection().toString()');
    if(!before.includes('DEBUT PROFIL')||before.includes('EXPERIENCE WORD API'))throw Error('Original editing boundary not reproduced: '+before);
    const reports=[];
    for(const theme of ['wordpro','digital','holographic','creative']){
        ev(`(()=>{setCvCopySelectionMode(false);cvForm.elements.layoutTheme.value='${theme}';updateCvPreview();window.copyStateBefore=JSON.stringify(getKirbyCvSource({includeDisplayedValues:true}));document.querySelector('#cv-copy-select').click();return true})()`);
        drag(ev(`(${coordinates})()`));
        reports.push(ev(`(async()=>{
            const selected=getSelection().toString();
            if(!selected.includes('DEBUT PROFIL CRM RGPD')||!selected.includes('EXPERIENCE WORD API 2025'))throw Error('Selection clipped: '+selected);
            const data=new DataTransfer();previewNodes.preview.dispatchEvent(new ClipboardEvent('copy',{bubbles:true,cancelable:true,clipboardData:data}));
            const copied=data.getData('text/plain');if(!copied.includes('EXPERIENCE WORD API 2025')||/↑|↓|×/.test(copied))throw Error('Copy data');
            await new Promise(r=>setTimeout(r,700));if(JSON.stringify(getKirbyCvSource({includeDisplayedValues:true}))!==window.copyStateBefore)throw Error('CV mutated');
            document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
            if(!previewNodes.summary.isContentEditable||!previewNodes.experience.isContentEditable||previewNodes.meta.isContentEditable||cvWordToolbarShell.inert)throw Error('Edit mode not restored');
            return {theme:'${theme}',crossSectionDrag:true,copySelection:true,contentUnchanged:true,editingRestored:true};
        })()`));
    }
    ev(`(()=>{setCvCopySelectionMode(true);setPreviewMode('letter');if(document.body.classList.contains('is-cv-copy-selection')||cvWordToolbarShell.inert)throw Error('Mode leak to letter');return true})()`);
    console.log(JSON.stringify({reproducedBefore:before,reports,letterUnaffected:true},null,2));
} finally {run('close')}
