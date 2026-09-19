const { test } = require('node:test');
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');
const build = require('../../lib/site-selection-email');
const fixtures = require('../fixtures/kirby-site.cjs');

const pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=';
function snapshot() {
    const site = fixtures.site();
    site.assets = [{ id: 'cover', alt: 'Cover' }];
    site.pages[0].sections[0].slots.primaryMediaId = 'cover';
    return { id: 'selection-' + 'a'.repeat(64), sourceProject: 'original-project', state: { site, media: { cover: { url: 'data:image/png;base64,' + pixel } }, conversation: [{ role: 'user', content: 'Six jeux, sons, glisser-déposer et espace Parents.' }] } };
}
const contact = { firstName: 'Client <Test>', email: 'local@example.com', phone: '0102030405', additionalNeed: 'Domaine & WhatsApp', preview: 'http://127.0.0.1:8017/incorrect' };

test('selected email uses the frozen home image, public identity and original brief without mutating the snapshot', async () => {
    const saved = snapshot(), before = JSON.stringify(saved);
    const email = build(saved, contact);
    assert.equal(email.subject, 'Nouvelle demande de projet — Atelier');
    assert.equal(JSON.stringify(saved), before);
    assert.equal(email.attachments.length, 1);
    assert.deepEqual(email.attachments[0].content, Buffer.from(pixel, 'base64'));
    assert.ok(email.html.includes('cid:' + email.attachments[0].cid));
    assert.match(email.html, /Client &lt;Test&gt;/);
    assert.match(email.html, /Domaine &amp; WhatsApp/);
    for (const value of ['https://www.sacreationweb.com/site-preview.html?project=' + saved.id, 'Six jeux, sons, glisser-déposer et espace Parents.', 'original-project', 'Révision : 1', '0102030405']) {
        assert.ok(email.text.includes(value)); assert.ok(email.html.includes(value));
    }
    assert.doesNotMatch(email.html + email.text, /127\.0\.0\.1|localhost|incorrect/);
    assert.ok(email.html.indexOf('Nouvelle demande de projet') < email.html.indexOf('<img'));
    assert.ok(email.html.indexOf('<img') < email.html.indexOf('Voir le projet'));
    assert.ok(email.html.indexOf('Voir le projet') < email.html.indexOf('Brief Kirby'));
    assert.ok(email.html.indexOf('Brief Kirby') < email.html.indexOf('Références techniques'));
    // Exercise real Nodemailer MIME assembly without any network or SMTP connection.
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
    const mime = (await transport.sendMail({ from: 'test@example.com', to: 'local@example.com', ...email })).message.toString();
    assert.match(mime, /multipart\/related/);
    assert.ok(mime.includes('Content-ID: <' + email.attachments[0].cid + '>'));
    assert.doesNotMatch(mime, /Content-ID:[ \t]*\r?\n/);
    assert.ok(('Content-ID: <' + email.attachments[0].cid + '>').length <= 78);
    assert.match(mime, /Content-Type: image\/png/);
});

test('thumbnail follows the selected home page, never unrelated media or a later version', () => {
    const saved = snapshot(); saved.state.media.unrelated = { url: 'data:image/png;base64,AAAA' };
    assert.deepEqual(build(saved, contact).attachments[0].content, Buffer.from(pixel, 'base64'));
    saved.state.media.cover.url = 'https://untrusted.test/image.png';
    const noImage = build(saved, contact);
    assert.equal(noImage.attachments.length, 0); assert.doesNotMatch(noImage.html, /<img|untrusted/);
    assert.match(noImage.html, /Voir le projet/);
    assert.throws(() => build({ ...saved, id: '../other' }, contact), /invalid_selection/);
});
