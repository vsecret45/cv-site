// Isolated local browser; no real account or model call. Start server.js first.
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const cli = process.env.AGENT_BROWSER_CLI;
if (!cli) throw Error('AGENT_BROWSER_CLI required');
const session = 'cv-manual-regression';
const run = (...args) => execFileSync(process.execPath, [cli, '--session', session, ...args], { encoding: 'utf8', maxBuffer: 5e6 });
const ev = (code) => JSON.parse(execFileSync(process.execPath, [cli, '--session', session, 'eval', '--stdin'], { input: code, encoding: 'utf8', maxBuffer: 5e6 }));
const url = process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8000';
const setup = `
currentUser = { id: 'cv-manual-regression', email: 'synthetic@example.invalid', name: '' };
supabaseClientPromise = Promise.resolve({auth:{getSession:async()=>({data:{session:{access_token:'synthetic-test-only'}},error:null})}});
updateAuthUi(); refreshCvModule(); supersedePendingCvDraftLoad();
`;
const helpers = `
const eq=(actual,expected,label)=>{if(actual!==expected)throw Error(label+': '+JSON.stringify({actual,expected}))};
const pause=()=>new Promise(r=>setTimeout(r,700));
const show=node=>{for(let p=node;p;p=p.parentElement){if(p.tagName==='DETAILS')p.open=true;if(getComputedStyle(p).display==='none')p.style.setProperty('display','block','important')}};
const place=(node,offset)=>{show(node);node.focus();const r=document.createRange();if(node.firstChild)r.setStart(node.firstChild,offset);else r.selectNodeContents(node);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r)};
const set=(name,value)=>{const f=cvForm.elements[name];f.value=value;f.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:value}));return f};
const insert=text=>document.execCommand('insertText',false,text);
`;
const report = {};
try {
    run('open', url + '/cv.html');
    run('snapshot', '-i');
    report.typing = ev(`(async()=>{${setup}${helpers}
openBlankCvSheet({persist:false});
const n=previewNodes.summary;place(n,0);insert('2');await pause();
eq(readScopedLocalDraft(currentUser.id).values.summary,'2','autosave before resume');
insert('6');eq(n.textContent,'26','blank caret');await pause();
eq(readScopedLocalDraft(currentUser.id).values.summary,'26','autosave after resume');
n.blur();set('summary','Gestion CRM 2025');place(n,8);insert('X');await pause();insert('Y');
eq(n.textContent,'Gestion XYCRM 2025','middle caret');n.blur();n.focus();eq(n.textContent,'Gestion XYCRM 2025','blur/focus');n.blur();
const literal='  WORD API CRM RGPD IFRS  0026  01/02/03  \\n\\n suite  ';
set('summary',literal);set('languages','ANGLAIS');
const timeline='  WORD API  \\n2025  -  2024\\n\\nCRM  0007';
set('experience',timeline);set('education',timeline);set('projects',timeline);
set('skills','CRM\\nRGPD\\nIFRS\\nCRM');
set('fullName','  WORD API  ');set('location','  Ville  TEST  ');set('phone','  0012  3400  ');
for(const name of ['summary','languages','experience','education','projects','fullName','location','phone']){
const f=cvForm.elements[name],before=f.value;f.dispatchEvent(new Event('change',{bubbles:true}));f.dispatchEvent(new Event('blur'));eq(f.value,before,'change/blur '+name)}
eq(previewNodes.summary.textContent,literal,'literal render');eq(previewNodes.languages.textContent,'ANGLAIS','language render');
const before=JSON.stringify(Object.fromEntries(new FormData(cvForm).entries()));
await pause();await loadCvDraft({silent:true});eq(JSON.stringify(Object.fromEntries(new FormData(cvForm).entries())),before,'draft exact restore');
eq(previewNodes.summary.textContent,literal,'restored spaces');
const history=getCvHistoryState();set('summary','changed');restoreCvHistorySnapshot(history);eq(cvForm.elements.summary.value,literal,'history exact');
const roundTrip=buildCvRoundTripPayload();openBlankCvSheet({persist:false});restoreCvPayloadToEditor(roundTrip);eq(cvForm.elements.summary.value,literal,'round trip exact');
await saveCvDraft(true);return {blank:'26',middle:'Gestion XYCRM 2025',literal,fields:buildCvDraftPayload().values,autosave:true,restore:true,history:true,roundTrip:true};})()`);
    run('reload');
    report.reload = ev(`(async()=>{${setup}await loadCvDraft({silent:true});return {fields:buildCvDraftPayload().values,manual:Object.keys(cvManualContent),summary:previewNodes.summary.textContent};})()`);
    assert.deepEqual(report.reload.fields, report.typing.fields);
    assert.equal(report.reload.summary, report.typing.literal);
    report.cards = ev(`(async()=>{${setup}${helpers}
openBlankCvSheet({persist:false});
const title=experienceCards.querySelector('[data-experience-field="title"]');
const edit=(node,value)=>{node.value=value;node.dispatchEvent(new InputEvent('input',{bubbles:true,data:value,inputType:'insertText'}))};
edit(title,'WORD API');eq(title.value,'WORD API','card title');eq(cvForm.elements.experience.value,'WORD API','card serialization');
const date=experienceCards.querySelector('[data-experience-field="date"]');edit(date,'  01/02/03  -  0007  ');
edit(experienceCards.querySelector('[data-experience-field="bullets"]'),'  CRM  RGPD  IFRS  \\n\\n0026');
edit(languageCards.querySelector('[data-language-field="language"]'),'ANGLAIS');
edit(languageCards.querySelector('[data-language-field="level"]'),'  IFRS  0001  ');
await pause();const saved=JSON.stringify(getStableComparableValue(cvManualContent));await loadCvDraft({silent:true});eq(JSON.stringify(getStableComparableValue(cvManualContent)),saved,'card metadata restore');
eq(experienceCards.querySelector('[data-experience-field="title"]').value,'WORD API','card title restore');
eq(experienceCards.querySelector('[data-experience-field="date"]').value,'  01/02/03  -  0007  ','date restore');
eq(languageCards.querySelector('[data-language-field="language"]').value,'ANGLAIS','language card restore');
const cardValue=cvForm.elements.experience.value;persistAllEditableNodes();eq(cvForm.elements.experience.value,cardValue,'format/export sync preserves card backing value');
// Direct edits in structured rubrics must also survive another field's rerender.
set('experience','CRM');const n=previewNodes.experience;show(n);n.focus();const r=document.createRange();r.selectNodeContents(n);r.collapse(false);getSelection().removeAllRanges();getSelection().addRange(r);insert(' XYZ');await pause();insert(' 0026');const direct=cvForm.elements.experience.value;n.blur();set('headline','Autre champ');eq(cvForm.elements.experience.value,direct,'direct structured state');eq(n.textContent,'CRM XYZ 0026','direct structured render');
await saveCvDraft(true);await loadCvDraft({silent:true});eq(n.textContent,'CRM XYZ 0026','direct structured restore');
// Ordinary editor paste is literal; the assistant import is exercised below.
set('summary','');const summary=previewNodes.summary;place(summary,0);const dt=new DataTransfer();dt.setData('text/plain','C R M  RGPD\\n\\n0012');summary.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:dt}));
eq(cvForm.elements.summary.value,'C R M  RGPD\\n\\n0012','literal paste');summary.blur();
set('summary','');place(summary,0);const typed='  A  B  \\n\\nCRM\\u00a0RGPD  0012  ';insert(typed);eq(cvForm.elements.summary.value,typed,'typed whitespace');await pause();summary.blur();await loadCvDraft({silent:true});eq(cvForm.elements.summary.value,typed,'typed whitespace restore');eq(readManualCvText(summary),typed,'typed whitespace visible');
const dangerous=sanitizeManualCvContent({summary:{value:'CRM  ',html:'<b onclick="bad()">CRM  </b><script>bad()</script><img src=x onerror=bad()>'}});
if(/onclick|script|onerror|<img/.test(dangerous.summary.html))throw Error('unsafe manual HTML');
return {case:true,dates:true,spaces:true,cardRestore:true,directStructured:true,literalPaste:true,htmlSanitization:true};})()`);
    report.kirby = ev(`(async()=>{${setup}${helpers}
const contract=window.KirbyCvContract;const originalFetch=window.fetch;const requests=[];
const entries=[{title:'WORD API',organization:'Entreprise',period:'2025',details:['CRM']},{title:'Autre poste',organization:'Atelier',period:'2021',details:['RGPD']}];
const education=[{title:'Diplôme B',organization:'École',period:'2020',details:[]},{title:'Diplôme A',organization:'École',period:'2018',details:[]}];
window.fetch=async(url,options)=>{if(url!=='/api/kirby-cv')return originalFetch(url,options);const body=JSON.parse(options.body);requests.push(body);const imported=Boolean(body.documentText);
const action={action:imported?'replace_document':'edit',message:'Modifications préparées.',documentLanguage:'fr',operations:imported?
[{field:'experience',encoding:'entries',text:'',items:[],entries},{field:'education',encoding:'entries',text:'',items:[],entries:education}]:
[{field:'languages',encoding:'text',text:'Anglais',items:[],entries:[]}],layout:{reflow:imported,compact:null,sectionOrder:[]},letter:{subject:'',body:''}};
return new Response(JSON.stringify({ok:true,source:'openai',protocol:contract.protocol,base:body.cv,cv:{modelAction:action}}),{status:200,headers:{'Content-Type':'application/json'}})};
try {
for(const sourceKind of ['document','narrative']){
await importCvTextWithModel('Autre poste 2021 Atelier RGPD. WORD API 2025 Entreprise CRM. Diplôme A 2018. Diplôme B 2020.',{sourceKind});
eq(getManualCvField('experience'),null,'import replaces manual provenance');
eq(JSON.stringify(cvForm.elements.experience.value.split('\\n').map(contract.parseEntry).map(e=>e.date)),JSON.stringify(['2025','2021']),'import dates/order');
eq(previewNodes.experience.querySelectorAll(':scope > li').length,2,'import structured render');
eq(previewNodes.education.querySelectorAll(':scope > li').length,2,'two qualifications');const original=cvForm.elements.experience.value;show(previewNodes.experience);previewNodes.experience.focus();previewNodes.experience.blur();eq(cvForm.elements.experience.value,original,'import focus/blur without edit');}
set('summary','  CRM  RGPD IFRS  ');set('languages','ANGLAIS');
await runKirbyModelAssistant({instruction:'Remplace ANGLAIS par Anglais.'});eq(cvForm.elements.languages.value,'Anglais','explicit Kirby edit');eq(getManualCvField('languages'),null,'explicit edit clears only target');eq(cvForm.elements.summary.value,'  CRM  RGPD IFRS  ','unrelated manual field');
eq(requests.length,3,'only explicit requests');
eq(serializeExperienceEntry({title:'WORD API',meta:'',date:'',bullets:[]}), 'WORD API |  | ', 'model serializer intact');
return {import:true,kirbyPaste:true,explicitEdit:true,unrelatedLiteral:true,requests:requests.length,modelResponse:'simulated'};
}finally{window.fetch=originalFetch;}})()`);
    ev(`(async()=>{${helpers}currentUser=null;set('summary','Brouillon invité  CRM  0026');await saveCvDraft(true);return true;})()`);
    run('reload');
    report.guestReload = ev(`(async()=>{for(let i=0;i<60&&!document.querySelector('.workspace-tools');i++)await new Promise(r=>setTimeout(r,100));const text=cvForm.elements.summary.value;if(text!=='Brouillon invité  CRM  0026')throw Error('guest startup overwrote draft: '+text);return true;})()`);
    console.log(JSON.stringify(report, null, 2));
} finally { run('close'); }
