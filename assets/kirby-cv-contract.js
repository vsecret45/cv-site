/* Shared, deterministic document contract. No interpretation of user language. */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.KirbyCvContract = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const protocol = 'cv-model-v1';
    const fields = ['fullName', 'location', 'phone', 'email', 'permit', 'headline', 'summary', 'skills', 'experience', 'projects', 'education', 'languages', 'activities'];
    const sections = ['summary', 'skills', 'experience', 'projects', 'education', 'activities', 'languages'];
    const timelines = ['experience', 'projects', 'education'];
    const lists = ['skills', 'languages', 'activities'];
    const object = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
    const string = { type: 'string' };
    const strings = { type: 'array', items: string };
    const entrySchema = object({ title: string, organization: string, period: string, details: strings });
    const schema = object({
        action: { type: 'string', enum: ['edit', 'replace_document', 'answer', 'clarify', 'letter'] },
        message: string,
        documentLanguage: { type: 'string', enum: ['fr', 'en'] },
        operations: { type: 'array', items: object({
            field: { type: 'string', enum: fields },
            encoding: { type: 'string', enum: ['text', 'items', 'entries'] },
            text: string, items: strings, entries: { type: 'array', items: entrySchema },
        }) },
        layout: object({ reflow: { type: 'boolean' }, compact: { type: ['boolean', 'null'] }, sectionOrder: strings }),
        letter: object({ subject: string, body: string }),
    });
    const fail = (code) => { throw new Error(code); };
    const text = (value, max = 120000) => {
        if (typeof value !== 'string' || value.length > max || value.includes('\u0000')) fail('invalid_cv_text');
        return value;
    };
    const exactKeys = (value, keys) => {
        if (!value || Array.isArray(value) || typeof value !== 'object'
            || Object.keys(value).length !== keys.length || keys.some((key) => !Object.hasOwn(value, key))) fail('invalid_cv_shape');
    };
    const stringList = (value) => {
        if (!Array.isArray(value) || value.length > 2000) fail('invalid_cv_list');
        return value.map((item) => text(item, 20000));
    };
    const state = (value = {}) => Object.fromEntries(fields.map((field) => [field, text(value[field] ?? '')]));
    // Escaping is reversible and independent of professions, dates or languages.
    const encodePart = (value) => value.replace(/%/g, '%25').replace(/\|/g, '%7C').replace(/•/g, '%2022').replace(/\r?\n/g, ' ');
    const decodePart = (value) => value.replace(/%2022/g, '•').replace(/%7C/g, '|').replace(/%25/g, '%');
    const serializeEntry = (entry) => {
        exactKeys(entry, ['title', 'organization', 'period', 'details']);
        const parts = [entry.title, entry.organization, entry.period].map((part) => encodePart(text(part, 20000)));
        const details = stringList(entry.details).map(encodePart);
        if (![...parts, ...details].some((part) => part.trim())) fail('empty_cv_entry');
        // Three columns, including empty columns, remove all date/title guessing.
        return parts.join(' | ') + (details.length ? ' • ' + details.join(' • ') : '');
    };
    const parseEntry = (line) => {
        if (typeof line !== 'string') return null;
        const [header, ...details] = line.split(' • ');
        const parts = header.split('|');
        if (parts.length !== 3) return null;
        return { title: decodePart(parts[0].trim()), meta: decodePart(parts[1].trim()), date: decodePart(parts[2].trim()), bullets: details.map(decodePart) };
    };
    const operationValue = (operation) => {
        exactKeys(operation, ['field', 'encoding', 'text', 'items', 'entries']);
        if (!fields.includes(operation.field)) fail('unknown_cv_field');
        text(operation.text);
        const items = stringList(operation.items);
        if (!Array.isArray(operation.entries)) fail('invalid_cv_entries');
        if (operation.encoding === 'text' && !items.length && !operation.entries.length) return operation.text;
        if (operation.encoding === 'items' && lists.includes(operation.field) && !operation.text && !operation.entries.length) {
            if (items.some((item) => !item.trim() || /[\r\n]/.test(item))) fail('invalid_cv_item');
            return items.join('\n');
        }
        if (operation.encoding === 'entries' && timelines.includes(operation.field) && !operation.text && !items.length) {
            if (operation.entries.length > 500) fail('too_many_cv_entries');
            return operation.entries.map(serializeEntry).join('\n');
        }
        fail('invalid_cv_encoding');
    };
    const plan = (result, current) => {
        exactKeys(result, ['action', 'message', 'documentLanguage', 'operations', 'layout', 'letter']);
        if (!schema.properties.action.enum.includes(result.action) || !['fr', 'en'].includes(result.documentLanguage)) fail('invalid_cv_action');
        text(result.message, 12000);
        exactKeys(result.layout, ['reflow', 'compact', 'sectionOrder']);
        exactKeys(result.letter, ['subject', 'body']);
        text(result.letter.subject, 1000); text(result.letter.body, 30000);
        if (typeof result.layout.reflow !== 'boolean' || ![true, false, null].includes(result.layout.compact)) fail('invalid_cv_layout');
        const order = stringList(result.layout.sectionOrder);
        if (order.length && (order.length !== sections.length || new Set(order).size !== sections.length || order.some((section) => !sections.includes(section)))) fail('invalid_cv_section_order');
        if (!Array.isArray(result.operations) || result.operations.length > fields.length) fail('invalid_cv_operations');
        const before = state(current);
        const after = result.action === 'replace_document' ? state() : { ...before };
        const seen = new Set();
        for (const operation of result.operations) {
            if (seen.has(operation.field)) fail('duplicate_cv_operation');
            seen.add(operation.field);
            after[operation.field] = operationValue(operation);
        }
        if (['answer', 'clarify', 'letter'].includes(result.action)
            && (result.operations.length || result.layout.reflow || result.layout.compact !== null || order.length)) fail('non_editing_cv_action_has_changes');
        if (result.action !== 'letter' && (result.letter.subject || result.letter.body)) fail('unexpected_cv_letter');
        if (result.action === 'replace_document' && !Object.values(after).some((value) => value.trim())) fail('empty_cv_document');
        return { before, after, changedFields: fields.filter((field) => before[field] !== after[field]) };
    };
    return { protocol, fields, sections, timelines, lists, schema, state, plan, serializeEntry, parseEntry };
});
