// Local isolated browser; the Kirby response is simulated, never a paid model call.
const { execFileSync } = require('node:child_process');
const cli = process.env.AGENT_BROWSER_CLI;
if (!cli) throw Error('AGENT_BROWSER_CLI required');
const args = [cli, '--session', 'cv-whole-paste'];
const run = (...more) => execFileSync(process.execPath, [...args, ...more], { encoding: 'utf8', maxBuffer: 5e6 });
const evaluate = code => JSON.parse(execFileSync(process.execPath, [...args, 'eval', '--stdin'], { input: code, encoding: 'utf8', maxBuffer: 5e6 }));
try {
    run('open', (process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8000') + '/cv.html');
    run('snapshot', '-i');
    console.log(JSON.stringify(evaluate(`(async()=>{
        const eq=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(label)};
        const waitFor=async(fn)=>{for(let i=0;i<100;i++){if(fn())return;await new Promise(r=>setTimeout(r,50))}throw Error('Timeout')};
        currentUser={id:'cv-whole-paste',email:'synthetic@example.invalid',name:''};
        supabaseClientPromise=Promise.resolve({auth:{getSession:async()=>({data:{session:{access_token:'synthetic-test-only'}},error:null})}});
        supersedePendingCvDraftLoad();updateAuthUi();refreshCvModule();openBlankCvSheet({persist:false});
        cvForm.elements.summary.value='  WORD API  CRM RGPD IFRS  0026  ';
        rememberManualCvField('summary');updateCvPreview();
        const source='PERSONNE TEST\\nProfile\\nWORD API CRM RGPD IFRS\\nExperience\\n2025 - 2026 Entreprise\\n2021 - 2024 Atelier';
        const paste=(node,text)=>{const data=new DataTransfer();data.setData('text/plain',text);node.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data}))};
        const original=JSON.stringify(getKirbyCvSource({includeDisplayedValues:true}));
        const originalFetch=window.fetch;const requests=[];let fail=true;
        window.fetch=async(url,options)=>{
            if(url!=='/api/kirby-cv')return originalFetch(url,options);
            const body=JSON.parse(options.body);requests.push(body);
            if(fail)throw Error('Import de test indisponible');
            const entries=[{title:'WORD API',organization:'Entreprise',period:'2025 - 2026',details:['CRM RGPD IFRS']},{title:'Autre poste',organization:'Atelier',period:'2021 - 2024',details:[]}];
            const action={action:'replace_document',message:'CV structuré.',documentLanguage:'fr',operations:[{field:'summary',encoding:'text',text:'WORD API CRM RGPD IFRS',items:[],entries:[]},{field:'experience',encoding:'entries',text:'',items:[],entries}],layout:{reflow:true,compact:null,sectionOrder:[]},letter:{subject:'',body:''}};
            return new Response(JSON.stringify({ok:true,source:'openai',protocol:window.KirbyCvContract.protocol,base:body.cv,cv:{modelAction:action}}),{status:200,headers:{'Content-Type':'application/json'}});
        };
        try {
            previewNodes.preview.focus();eq(document.activeElement===previewNodes.preview,true,'sheet focus');
            paste(previewNodes.preview,source);
            eq(cvPasteDialog.open,true,'sheet paste opens dialog');eq(cvPasteText.value,source,'full source retained');
            eq(requests.length,0,'paste does not call Kirby');eq(JSON.stringify(getKirbyCvSource({includeDisplayedValues:true})),original,'paste does not edit CV');
            cvPasteClose.click();eq(cvPasteDialog.open,false,'close');
            document.querySelector('#cv-paste-open').click();eq(cvPasteText.value,source,'reopen keeps text');
            cvPasteText.value=' ';cvPasteApply.click();eq(requests.length,0,'empty paste rejected');
            cvPasteText.value=source;isKirbyCvRequestInFlight=true;cvPasteApply.click();eq(requests.length,0,'busy guard');isKirbyCvRequestInFlight=false;
            cvPasteApply.click();cvPasteApply.click();await waitFor(()=>!isPastingWholeCv);
            eq(requests.length,1,'one explicit import');eq(JSON.stringify(getKirbyCvSource({includeDisplayedValues:true})),original,'failure preserves CV');eq(cvPasteText.value,source,'failure preserves paste');
            fail=false;cvPasteApply.click();await waitFor(()=>!isPastingWholeCv);
            eq(requests.length,2,'retry');eq(requests[1].task,'autofill','existing import route');eq(requests[1].documentText,source,'document source');eq(requests[1].sourceKind,'document','PDF text is a document');
            eq(previewNodes.experience.querySelectorAll(':scope > li').length,2,'structured experiences');
            eq(readScopedLocalDraft(currentUser.id).values.summary,'WORD API CRM RGPD IFRS','import saved');
            cvPasteClose.click();
            const n=previewNodes.summary;n.focus();const range=document.createRange();range.selectNodeContents(n);range.collapse(false);getSelection().removeAllRanges();getSelection().addRange(range);
            paste(n,'  C R M  0012');eq(cvPasteDialog.open,false,'rubric paste stays local');eq(n.textContent,'WORD API CRM RGPD IFRS  C R M  0012','literal rubric paste');eq(requests.length,2,'no implicit AI');
            return {sheetPaste:true,explicitActionOnly:true,emptyAndBusyGuards:true,failurePreservesCvAndText:true,retry:true,structuredImport:true,autosave:true,literalRubricPaste:true,modelResponse:'simulated'};
        } finally {window.fetch=originalFetch}
    })()`), null, 2));
} finally { run('close'); }
