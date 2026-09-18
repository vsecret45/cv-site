const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../../kirby-docx');
const D = globalThis.KirbyDocx;
test('free A4 export is truly empty, without CV or letter boilerplate', async () => {
    const xml = await D.readDocxXmlEntry(new Uint8Array(await D.createFreeDocumentDocxBlob().arrayBuffer()), 'word/document.xml');
    assert.match(xml, /w:w="11906" w:h="16838"/);
    assert.doesNotMatch(xml, /<w:t[ >]|Votre nom|Candidature|Profil|Experience/);
});
test('free document Word export retains supplied text, basic formatting and alignment', async () => {
    const blob = D.createFreeDocumentDocxBlob([{ align:'center', runs:[{text:'Courrier & informations',font:'Arial',size:14,bold:true,italic:true,underline:true}] }]);
    const xml = await D.readDocxXmlEntry(new Uint8Array(await blob.arrayBuffer()), 'word/document.xml');
    for (const value of ['Courrier &amp; informations','<w:b/>','<w:i/>','<w:u w:val="single"/>','w:jc w:val="center"','w:sz w:val="28"']) assert.ok(xml.includes(value));
    assert.doesNotMatch(xml,/Candidature|Votre nom|DocumentTitle/);
});
