const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const F = require('../fixtures/kirby-site.cjs');
const E = require('../../kirby-composition-engine');
const cli = process.env.AGENT_BROWSER_CLI;
if (!cli) throw Error('Set AGENT_BROWSER_CLI');
const session = 'responsive';
const cmd = (...args) => execFileSync(process.execPath, [cli, '--session', session, ...args], { encoding: 'utf8' });
const ev = code => JSON.parse(execFileSync(process.execPath, [cli, '--session', session, 'eval', '--stdin'], { input: code, encoding: 'utf8' }));
const site = F.site();
site.name = 'Padel indoor'; site.design = { ...site.design, canvas:'#08141b',surface:'#0c1d26',ink:'#f4f7f8',muted:'#99adb8',accent:'#b8ff24',onAccent:'#08141b',headingFont:'sans' };
site.pages = [site.pages[0]]; site.navigation.items = [site.navigation.items[0]];
site.pages[0].sections = E.compositions.map((composition, i) => {
    const s = F.section('section-' + i, 'Venir jouer en Île-de-France.');
    s.composition = composition; s.eyebrow = 'Infos pratiques';
    s.body = 'Le club accueille les joueurs pour la location de terrains, les cours et les événements padel.';
    s.blocks = [{ id:'table-'+i, type:'table', title:'À retenir', text:'', assetId:'', chartType:'bar', illustrative:false, items:[
        {label:'Localisation',value:'Île-de-France',detail:'Club de padel indoor.'},
        {label:'Jeu',value:'6 terrains indoor',detail:'Location de terrains et pratique encadrée.'},
        {label:'Sur place',value:'Vestiaires, détente, boissons',detail:'Services utiles avant et après le match.'},
        {label:'Demandes',value:'Terrains, cours, tournois',detail:'Orientation par type de besoin.'}
    ] }];
    s.slots.artifactBlockIds = [s.blocks[0].id]; return s;
});
const out = 'output/responsive'; fs.mkdirSync(out, { recursive:true });
try {
    cmd('open', (process.env.KIRBY_TEST_URL || 'http://127.0.0.1:8001') + '/site-preview.html'); cmd('snapshot','-i');
    ev(`(async()=>{await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/assets/kirby-site-responsive.js';s.onload=resolve;s.onerror=reject;document.head.append(s)});window.fixture=${JSON.stringify(site)};document.querySelector('#site-root').innerHTML=KirbySiteRenderer.render(fixture,'home','test');return true})()`);
    const report = ev(`KirbySiteResponsive.validate(fixture,'test')`);
    assert.equal(report.results.length,4);
    for (const width of [390,430,768,1440]) {
        cmd('set','viewport',String(width),'1000');
        const result = ev(`(()=>{const doc=document;const tables=[...doc.querySelectorAll('.ks-block-table')];return {issues:KirbySiteResponsive.inspect(doc),overflow:doc.documentElement.scrollWidth>innerWidth,tables:tables.map(t=>({width:t.clientWidth,display:getComputedStyle(t.querySelector('tr')).display})),mobile:[...doc.querySelectorAll('.ks-composition')].every(c=>[...c.children].every(s=>s.getBoundingClientRect().width>=c.clientWidth-parseFloat(getComputedStyle(c).paddingLeft)-parseFloat(getComputedStyle(c).paddingRight)-2))}})()`);
        assert.deepEqual(result.issues,[],JSON.stringify({width,...result})); assert.equal(result.overflow,false);
        if(width<=768) { assert.equal(result.mobile,true,JSON.stringify({width,...result})); if(width<=430) assert.ok(result.tables.every(t=>t.display==='grid')); }
        if(width===1440) assert.ok(result.tables.some(t=>t.display==='table-row'));
        // Capture the specific missing-media asymmetric composition from the report.
        ev(`document.querySelector('#site-root').innerHTML=KirbySiteRenderer.render({...fixture,pages:[{...fixture.pages[0],sections:[fixture.pages[0].sections[2]]}]},'home','test');true`);
        cmd('screenshot',`${out}/${width}.png`);
        ev(`document.querySelector('#site-root').innerHTML=KirbySiteRenderer.render(fixture,'home','test');true`);
    }
    // The gate must really reject a broken layout, not merely return a success report.
    const rejected = ev(`(async()=>{const render=KirbySiteRenderer.render;KirbySiteRenderer.render=(...args)=>render(...args)+'<style>.ks-block-table{width:60px!important}.ks-block-table th{word-break:break-all!important}</style>';try{await KirbySiteResponsive.validate(fixture,'test');return false}catch(e){return e.message.includes('corrigée')}finally{KirbySiteRenderer.render=render}})()`);
    assert.equal(rejected,true);
    fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
    console.log('PASS: 17 compositions, 390/430/768/1440 px; stacked mobile tables, intact words, no empty columns; broken design rejected.');
} finally { cmd('close'); }
