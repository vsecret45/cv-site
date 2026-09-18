'use strict';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// Only the validated, persisted snapshot supplies the identity, brief and image.
// Never use a browser-supplied origin or an expiring storage URL in the email.
module.exports = function selectedProjectEmail(saved, contact) {
    if (!/^selection-[a-f0-9]{64}$/.test(saved.id)) throw new Error('invalid_selection');
    const { site, media = {}, conversation = [] } = saved.state;
    const preview = 'https://www.sacreationweb.com/site-preview.html?project=' + saved.id;
    const home = site.pages.find(page => page.path === '/') || site.pages[0];
    const candidates = (home?.sections || []).flatMap(section => [
        section.slots?.primaryMediaId, section.slots?.secondaryMediaId,
        section.slots?.tertiaryMediaId, ...(section.blocks || []).map(block => block.assetId),
    ]).filter(Boolean);
    const assetId = candidates.find(id => site.assets.some(asset => asset.id === id) && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(media[id]?.url || ''));
    const image = assetId && media[assetId].url.match(/^data:(image\/(png|jpeg|webp));base64,(.+)$/);
    // Keep Content-ID short enough to stay on one MIME header line. Some
    // webmail viewers fail to resolve inline images when this header is folded.
    const cid = 'preview.' + saved.id.slice(10, 34) + '@sacreationweb.com';
    const attachments = image ? [{ filename: 'apercu-projet.' + (image[2] === 'jpeg' ? 'jpg' : image[2]), content: Buffer.from(image[3], 'base64'), contentType: image[1], cid, contentDisposition: 'inline' }] : [];
    const brief = conversation.filter(turn => turn.role === 'user').map(turn => turn.content).join('\n\n');
    const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Visiteur';
    const technical = `Identifiant de la version : ${saved.id}\nProjet source : ${saved.sourceProject}\nSite : ${site.id} — Révision : ${site.revision}`;
    const details = [
        `Nom : ${fullName}`, `E-mail : ${contact.email}`,
        contact.phone ? `Téléphone : ${contact.phone}` : '',
        contact.plan ? `Formule envisagée : ${contact.plan}` : '',
        `Besoin complémentaire : ${contact.additionalNeed || 'Aucun'}`,
    ].filter(Boolean).join('\n');
    const text = `Nouvelle demande de projet — ${site.name}\n\nVoir le projet : ${preview}\n\n${details}\n\nBrief Kirby :\n${brief}\n\nRéférences techniques\n${technical}`;
    const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17212b;max-width:600px;margin:auto;padding:24px;">
<p style="font-size:13px;color:#596575;">SA Création Web · Nouvelle demande</p>
<h1 style="font-size:26px;line-height:1.3;">Nouvelle demande de projet — ${escape(site.name)}</h1>
${image ? `<a href="${preview}"><img src="cid:${cid}" alt="${escape('Aperçu visuel de ' + site.name)}" width="320" style="display:block;width:100%;max-width:320px;height:auto;border:0;border-radius:12px;"></a><p style="font-size:12px;color:#596575;">Visuel de la génération sélectionnée</p>` : '<p>Le projet sélectionné est accessible avec le bouton ci-dessous.</p>'}
<p style="margin:24px 0;"><a href="${preview}" style="display:inline-block;background:#17212b;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:bold;">Voir le projet</a></p>
<h2 style="font-size:18px;">Coordonnées et besoin</h2><p style="white-space:pre-wrap;">${escape(details)}</p>
<h2 style="font-size:18px;">Brief Kirby</h2><p style="white-space:pre-wrap;">${escape(brief)}</p>
<hr style="border:0;border-top:1px solid #e1e5e9;margin-top:28px;"><p style="font-size:11px;color:#596575;white-space:pre-wrap;">Références techniques\n${escape(technical)}</p>
</div>`;
    return { fullName, subject: `Nouvelle demande de projet — ${site.name}`, text, html, attachments };
};
