const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../../lib/kirby-site-model');
const C = require('../../assets/kirby-site-contract');
const R = require('../../assets/kirby-site-renderer');
const F = require('../fixtures/kirby-site.cjs');
const brief = 'Crée une maquette pour Atelier Lune, atelier de céramique pour adultes débutants. Présente les cours, le déroulement et les créations dans une ambiance claire et artisanale. Je ne fournis ni téléphone, ni adresse, ni horaires pour le moment.';
const questions = 'Voici la première conception. Quelle adresse, quel téléphone et quels horaires souhaitez-vous ajouter ? Avez-vous un lien de réservation ou des préférences supplémentaires ?';
const response = value => new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}]}));

test('usable brief without contact details returns a complete site AND optional follow-up questions', async () => {
    const draft=F.site();draft.name='Atelier Lune';draft.project.brief=brief;
    draft.pages[0].sections[0].title='Découvrez la céramique';
    const result=await M.generate({protocol:C.protocol,message:brief}, {apiKeys:['test'],log:()=>{},fetchImpl:async(_,options)=>{
        const request=JSON.parse(options.body);
        assert.match(request.instructions,/pose-les ensuite dans decision.message/);
        assert.match(request.instructions,/Ne transforme pas ces questions en kind=clarify/);
        assert.match(request.instructions,/N’invente ni coordonnées ni fonctionnalités connectées/);
        assert.match(request.instructions,/Ne les remplace pas par une liste déclarative/);
        if(request.text.format.name==='kirby_site_review') assert.match(request.instructions,/conserve ou ajoute dans decision.message des questions complémentaires facultatives/);
        return response(request.text.format.name==='kirby_site_review'?{approved:true,decision:null}:{kind:'create',baseRevision:0,message:questions,site:draft,operations:[]});
    }});
    assert.equal(result.decision.kind,'create');
    assert.equal(result.decision.message,questions);
    const visible=C.apply(null,result.decision);
    assert.equal(visible.name,'Atelier Lune');
    assert.match(R.render(visible,'home','test'),/Découvrez la céramique/);
    assert.doesNotMatch(R.render(visible,'home','test'),/Quelle adresse/); // Questions stay in the editor.

    const enriched=structuredClone(visible.pages[0].sections[1]);
    enriched.body='12 rue des Ateliers · 01 23 45 67 89 · Mardi–samedi, 10 h–18 h';
    const answer='Adresse : 12 rue des Ateliers. Téléphone : 01 23 45 67 89. Horaires : mardi–samedi de 10 h à 18 h.';
    const updated=await M.generate({protocol:C.protocol,site:visible,message:answer,conversation:[{role:'user',content:brief},{role:'assistant',content:questions}]}, {apiKeys:['test'],log:()=>{},fetchImpl:async(_,options)=>{
        const request=JSON.parse(options.body),context=JSON.parse(request.input);
        if(request.text.format.name==='kirby_site_scope')return response({scope:'edit'});
        assert.deepEqual(context.site,visible);
        assert.equal(context.conversation.at(-1).content,questions);
        return response(request.text.format.name==='kirby_site_review'?{approved:true,decision:null}:F.decision([{type:'put_section',pageId:'home',index:1,section:enriched}]));
    }});
    assert.equal(updated.decision.kind,'edit');assert.equal(updated.site.id,visible.id);
    assert.equal(updated.site.revision,2);assert.deepEqual(updated.site.design,visible.design);
    assert.deepEqual(updated.site.pages[0].sections[0],visible.pages[0].sections[0]);
    assert.match(R.render(updated.site,'home','test'),/12 rue des Ateliers/);
});

test('genuinely unusable brief can still ask a blocking clarification without fabricating a site', async () => {
    const result=await M.generate({protocol:C.protocol,message:'Fais le truc dont je parle.'}, {apiKeys:['test'],log:()=>{},fetchImpl:async()=>response({kind:'clarify',baseRevision:0,message:'Quel projet souhaitez-vous créer ?',site:null,operations:[]})});
    assert.equal(result.decision.kind,'clarify');assert.equal(C.apply(null,result.decision),null);
});
