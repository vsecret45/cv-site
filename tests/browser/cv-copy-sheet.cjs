const { execFileSync } = require('node:child_process');
const cli = process.env.AGENT_BROWSER_CLI;
if (!cli) throw Error('AGENT_BROWSER_CLI required');
const args = [cli, '--session', 'cv-copy-sheet'];
const run = (...more) => execFileSync(process.execPath, [...args, ...more], { encoding: 'utf8', maxBuffer: 5e6 });
try {
    run('open', (process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8000') + '/cv.html');
    run('snapshot', '-i');
    const result = execFileSync(process.execPath, [...args, 'eval', '--stdin'], { encoding: 'utf8', input: `(async()=>{
        const check=(ok,label)=>{if(!ok)throw Error(label)};
        currentUser={id:'cv-copy-sheet',email:'synthetic@example.invalid',name:''};
        supersedePendingCvDraftLoad();updateAuthUi();refreshCvModule();openBlankCvSheet({persist:false});
        const fields={fullName:'PERSONNE TEST',headline:'Titre test',location:'Ville TEST',phone:'0012  3456',email:'synthetic@example.invalid',summary:'  WORD API  CRM RGPD IFRS  0026\\n\\nTexte libre  ',experience:'Poste unique\\n2025 - 2026\\nMission unique',languages:'ANGLAIS',skills:'Compétence unique'};
        for(const [key,value] of Object.entries(fields)){cvForm.elements[key].value=value;rememberManualCvField(key)}
        const themes=['digital','holographic','creative','modern','ats','wordpro','elegant','premium'];
        for(const theme of themes){
            cvForm.elements.layoutTheme.value=theme;updateCvPreview();
            const before=JSON.stringify(getKirbyCvSource({includeDisplayedValues:true}));
            const text=getWholeCvCopyText();
            for(const value of Object.values(fields))check(text.includes(value),'missing literal '+theme+' '+value);
            check(text.split(fields.fullName).length===2,'duplicate header '+theme);
            check(text.split(fields.experience).length===2,'duplicate experience '+theme);
            check(text.indexOf(fields.fullName)<text.indexOf(fields.summary),'header before sections');
            check(!/↑|↓|×|Monter|Supprimer|CV intelligent/.test(text),'editor controls leaked');
            check(JSON.stringify(getKirbyCvSource({includeDisplayedValues:true}))===before,'copy modified CV');
        }
        const section=previewNodes.skills.closest('section');section.hidden=true;
        check(!getWholeCvCopyText().includes(fields.skills),'hidden section copied');section.hidden=false;
        cvSectionOrder=['languages','summary',...cvSectionOrder.filter(key=>!['languages','summary'].includes(key))];updateCvPreview();
        const ordered=getWholeCvCopyText();check(ordered.indexOf(fields.languages)<ordered.indexOf(fields.summary),'custom rubric order');
        let copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{copied=text}}});
        document.querySelector('#cv-copy-all').click();await new Promise(r=>setTimeout(r,20));
        check(copied===ordered,'copy button clipboard payload');check(document.querySelector('#cv-copy-status').textContent.startsWith('CV copié'),'success status');
        navigator.clipboard.writeText=async()=>{throw Error('blocked')};document.querySelector('#cv-copy-all').click();await new Promise(r=>setTimeout(r,20));
        check(document.querySelector('#cv-copy-status').textContent.includes('bloqué'),'clipboard failure');
        return {templates:themes.length,literalText:true,contacts:true,noDuplicates:true,noControls:true,hiddenSectionsExcluded:true,customOrder:true,cvUnchanged:true,copyButton:true,clipboardFailure:true,clipboard:'simulated'};
    })()` });
    console.log(result);
} finally { run('close'); }
