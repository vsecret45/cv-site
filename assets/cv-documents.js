/* Local document entry points. The existing New CV handler remains authoritative. */
(function () {
    'use strict';
    const page = document.getElementById('free-document-page');
    const body = document.getElementById('free-document-body');
    if (!page || !body) return;
    const context = document.getElementById('document-context');
    const contextText = document.getElementById('document-context-text');
    const drawer = document.getElementById('cv-tools-drawer');
    let drawerWasOpen = false;
    // Deliberately separate from CV data. Retained while comparing modes in this page.
    function save() {
        updatePreviewViewport();
    }
    window.FreeDocumentEditor = { save };
    function enter(mode) {
        if (!requireAuthenticatedCvAccess('Connectez-vous pour ouvrir votre document.')) return;
        if (currentPreviewMode === 'blank') drawer.open = drawerWasOpen;
        closeAssistant();
        activeEditableNode = null; activeFormatNode = null; savedFormatRange = null;
        setPreviewMode(mode);
        document.querySelectorAll('[data-document-entry]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.documentEntry === mode)));
        context.hidden = mode === 'cv';
        contextText.textContent = mode === 'letter' ? 'Votre lettre de motivation, avec le modèle existant.' : 'Une feuille A4 libre. Écrivez directement, sans assistant.';
        if (mode === 'blank') {
            drawerWasOpen = drawer.open;
            drawer.open = true;
            updateWordToolbarState();
            requestAnimationFrame(() => { body.focus({ preventScroll: true }); updatePreviewViewport(); });
        }
    }
    document.getElementById('document-new-letter').addEventListener('click', () => enter('letter'));
    document.getElementById('document-new-blank').addEventListener('click', () => enter('blank'));
    document.getElementById('document-return-cv').addEventListener('click', () => enter('cv'));
    document.getElementById('cv-autofill').addEventListener('click', () => {
        if (currentPreviewMode !== 'cv') enter('cv');
    }, true);
    document.querySelectorAll('[data-preview-mode]').forEach(button => button.addEventListener('click', () => enter(button.dataset.previewMode)));
    body.addEventListener('focus', () => { rememberFormatTarget(body); updateWordToolbarState(); });
    body.addEventListener('input', save);
    body.addEventListener('blur', save);
    body.addEventListener('paste', event => {
        event.preventDefault();
        document.execCommand('insertText', false, event.clipboardData?.getData('text/plain') || '');
        save();
    });
    // Formatting buttons already use these same shared selection helpers.
    body.addEventListener('mouseup', () => rememberFormatTarget(body));
    body.addEventListener('keyup', () => rememberFormatTarget(body));
    // The free document is one editable root containing several paragraphs.
    // Read the selected text's style, rather than the root's default Arial.
    function syncSelectionToolbar() {
        if (currentPreviewMode !== 'blank') return;
        const range = getCurrentFormatRange();
        if (!range || !body.contains(range.startContainer)) return;
        let node = range.startContainer;
        if (node.nodeType === Node.ELEMENT_NODE) {
            node = node.childNodes[range.startOffset] || node.childNodes[range.startOffset - 1] || node;
            while (node.firstChild) node = node.firstChild;
        }
        const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        const styles = getComputedStyle(element);
        const family = styles.fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
        const option = Array.from(cvInlineFont.options).find(item => item.value.split(',')[0].replace(/["']/g, '').trim().toLowerCase() === family);
        cvInlineFont.value = option ? option.value : '';
        cvInlineAlignButtons.forEach(button => button.classList.toggle('is-active', (styles.textAlign === 'start' ? 'left' : styles.textAlign) === button.dataset.align));
    }
    document.addEventListener('selectionchange', syncSelectionToolbar);
    cvInlineFont.addEventListener('change', syncSelectionToolbar);
    body.addEventListener('keyup', syncSelectionToolbar);
    body.addEventListener('mouseup', syncSelectionToolbar);
    cvInlineAlignButtons.forEach(button => button.addEventListener('click', event => {
        if (currentPreviewMode !== 'blank') return;
        event.stopImmediatePropagation();
        const range = getCurrentFormatRange()?.cloneRange();
        if (!range || !body.contains(range.startContainer) || !body.contains(range.endContainer)) return;
        body.focus({ preventScroll: true });
        const selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        const commands = { left: 'justifyLeft', center: 'justifyCenter', right: 'justifyRight', justify: 'justifyFull' };
        document.execCommand(commands[button.dataset.align], false, null);
        rememberFormatTarget(body);
        syncSelectionToolbar();
        save();
    }, true));
    new ResizeObserver(updatePreviewViewport).observe(page);

    function paragraphs() {
        const result = []; let runs = [], alignment = 'left';
        const flush = () => { result.push({ runs, align: alignment }); runs = []; };
        function walk(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const style = getComputedStyle(node.parentElement);
                const lines = node.textContent.split('\n');
                lines.forEach((text, i) => {
                    if (i) flush();
                    if (text) runs.push({ text, bold: parseInt(style.fontWeight, 10) >= 600, italic: style.fontStyle === 'italic', underline: style.textDecorationLine.includes('underline'), font: style.fontFamily.split(',')[0].replace(/["']/g, ''), size: parseFloat(style.fontSize) * .75 });
                });
                return;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            if (node.tagName === 'BR') { flush(); return; }
            const block = node !== body && /^(P|DIV|LI|H[1-6])$/.test(node.tagName);
            if (block && runs.length) flush();
            alignment = getComputedStyle(node).textAlign;
            if (node.tagName === 'LI') runs.push({ text: node.parentElement.tagName === 'OL' ? `${Array.from(node.parentElement.children).indexOf(node) + 1}. ` : '• ' });
            node.childNodes.forEach(walk);
            if (block) flush();
        }
        walk(body); if (runs.length || !result.length) flush();
        return result;
    }
    async function exportBlank(action) {
        if (!requireAuthenticatedCvAccess('Connectez-vous pour exporter votre document.')) return;
        if (action === 'word') {
            downloadBlob('Document.docx', KirbyDocx.createFreeDocumentDocxBlob(paragraphs()));
            setCvStatus('Document Word téléchargé');
            return;
        }
        const Pdf = window.jspdf?.jsPDF;
        if (!Pdf || !window.html2canvas) { setCvStatus('Export PDF indisponible. Rechargez la page.'); return; }
        const previewWindow = action === 'preview' ? window.open('', '_blank') : null;
        if (previewWindow) previewWindow.opener = null;
        const clone = page.cloneNode(true);
        copyComputedStylesForExport(page, clone);
        clone.removeAttribute('id'); clone.classList.remove('is-hidden-preview');
        Object.assign(clone.style, { position: 'fixed', left: '0', top: '0', width: '210mm', minHeight: '297mm', height: 'auto', transform: 'none', zIndex: '-1', margin: '0', boxShadow: 'none' });
        clone.querySelectorAll('[contenteditable]').forEach(node => node.removeAttribute('contenteditable'));
        document.body.append(clone);
        try {
            await document.fonts.ready;
            const canvas = await html2canvas(clone, { scale: 2, backgroundColor: '#ffffff' });
            const pdf = new Pdf({ unit: 'mm', format: 'a4' });
            const sliceHeight = Math.round(canvas.width * 297 / 210);
            for (let top = 0; top < Math.max(1, canvas.height - 2); top += sliceHeight) {
                if (top) pdf.addPage();
                const slice = document.createElement('canvas'); slice.width = canvas.width; slice.height = sliceHeight;
                const ctx = slice.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, slice.width, slice.height); ctx.drawImage(canvas, 0, -top);
                pdf.addImage(slice.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
            }
            const blob = pdf.output('blob');
            if (previewWindow) previewWindow.location.href = URL.createObjectURL(blob);
            else downloadBlob('Document.pdf', blob);
            setCvStatus(previewWindow ? 'Aperçu du document ouvert' : 'Document PDF téléchargé');
        } catch (error) { previewWindow?.close(); throw error; }
        finally { clone.remove(); }
    }
    for (const [id, action] of [['cv-export-pdf', 'preview'], ['cv-download-pdf', 'pdf'], ['cv-export-word', 'word']]) {
        document.getElementById(id)?.addEventListener('click', event => {
            if (currentPreviewMode !== 'blank') return;
            event.stopImmediatePropagation(); event.preventDefault();
            exportBlank(action).catch(() => setCvStatus('L’export du document n’a pas abouti.'));
        }, true);
    }
}());
