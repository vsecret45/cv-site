'use strict';

// Provider-only constraints. Keep the stored-document schema compatible with
// existing projects while preventing combinations the renderer cannot execute.
module.exports = function generationSchema(schema) {
    const result = structuredClone(schema);
    const defs = result.$defs;
    const block = defs.block;
    defs.block = { anyOf: [
        { ...structuredClone(block), properties: { ...structuredClone(block.properties), type: { type: 'string', enum: ['image'] } } },
        { ...structuredClone(block), properties: { ...structuredClone(block.properties), type: { type: 'string', enum: block.properties.type.enum.filter(type => type !== 'image') }, target: { type: 'null', description: 'Only image blocks support a target. Use section.actions for links from other content.' } } }
    ] };
    const empty = { type: 'string', enum: [''] };
    const target = defs.target;
    defs.target = { anyOf: [
        { ...structuredClone(target), properties: { ...target.properties, kind: { type: 'string', enum: ['page'] }, sectionId: empty, url: empty } },
        { ...structuredClone(target), properties: { ...target.properties, kind: { type: 'string', enum: ['section'] }, url: empty } },
        { ...structuredClone(target), properties: { ...target.properties, kind: { type: 'string', enum: ['url'] }, pageId: empty, sectionId: empty } }
    ] };
    return result;
};
