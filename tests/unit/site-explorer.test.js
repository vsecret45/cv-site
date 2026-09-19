const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../../assets/kirby-site-contract');
const R=require('../../assets/kirby-site-renderer');
const F=require('../fixtures/kirby-site.cjs');
function fixture(){
 const s=F.site(),section=s.pages[0].sections[0];
 section.blocks=[{id:'explore',type:'explorer',title:'Explorer',text:'',assetId:'',items:[],chartType:'bar',illustrative:true,explorer:{panels:[
 {id:'dashboard',label:'Tableau de bord',title:'Aujourd’hui',text:'',presentation:'metrics',items:[{label:'CA',value:'8 420 €',detail:'',amount:null}],variants:[{label:'Commerce',items:[{label:'Panier moyen',value:'42 €',detail:'Exemple',amount:null}]},{label:'Indépendant',items:[{label:'À encaisser',value:'120 €',detail:'Exemple',amount:null}]}]},
 {id:'assistant',label:'Assistant',title:'Cléo',text:'Démonstration',presentation:'questions',variants:[],items:[{label:'<script>Question</script>',value:'Réponse <exemple>',detail:'',amount:null}]}
 ]}}];section.slots.artifactBlockIds=['explore'];return s;
}
test('old projects remain valid and render identically without explorer data',()=>{const s=F.site();C.validate(s);assert.doesNotMatch(R.render(s,'home','p'),/data-explorer/);});
test('explorer keeps one initial accessible panel and profile and escapes answers',()=>{const s=fixture();C.validate(s);const html=R.render(s,'home','p');assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);assert.match(html,/data-explorer-panel="assistant" tabindex="0" hidden/);assert.match(html,/data-explorer-view="1" hidden/);assert.match(html,/&lt;script&gt;Question/);assert.match(html,/Réponse &lt;exemple&gt;/);assert.match(html,/Données de démonstration/);assert.equal((html.match(/8 420 €/g)||[]).length,1);assert.match(html,/Panier moyen/);});
test('explorer rejects missing content, duplicate or unsafe tab ids',()=>{for(const mutate of [b=>b.explorer.panels=[],b=>b.explorer.panels[1].id='dashboard',b=>b.explorer.panels[0].id='x" onclick="bad',b=>b.type='text']){const s=fixture();mutate(s.pages[0].sections[0].blocks[0]);assert.throws(()=>C.validate(s));}});
