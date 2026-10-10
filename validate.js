'use strict';

const Ajv2020 = require('ajv/dist/2020').default;

const schema = require('./schema/v1.json');

const validateSchema = new Ajv2020({ allErrors: true }).compile(schema);

// The schema checks the shape of a document. It can't check that an id points at something, or that ids are
// unique, so those rules live here.
function checkReferences(document) {
    const errors = [];
    const nodeIds = new Set(document.nodes.map((node) => node.id));
    const sectionIds = new Set(document.sections.map((section) => section.id));
    const materialIds = new Set(document.materials.map((material) => material.id));

    const lists = [
        ['node', document.nodes],
        ['member', document.members],
        ['support', document.supports],
        ['nodal load', document.nodalLoads],
        ['material', document.materials],
        ['section', document.sections],
        ['dimension', document.dimensions ?? []],
    ];
    for (const [label, items] of lists) {
        const seen = new Set();
        for (const item of items) {
            if (seen.has(item.id)) {
                errors.push(`duplicate ${label} id ${item.id}`);
            }
            seen.add(item.id);
        }
    }

    const checkNode = (owner, nodeId) => {
        if (!nodeIds.has(nodeId)) {
            errors.push(`${owner} references node ${nodeId}, which doesn't exist`);
        }
    };

    for (const member of document.members) {
        const owner = `member ${member.id}`;
        if (member.from === member.to) {
            errors.push(`${owner} starts and ends at node ${member.from}; it needs two different nodes`);
        }
        checkNode(owner, member.from);
        checkNode(owner, member.to);
        if (!sectionIds.has(member.section)) {
            errors.push(`${owner} references section ${member.section}, which doesn't exist`);
        }
        if (!materialIds.has(member.material)) {
            errors.push(`${owner} references material ${member.material}, which doesn't exist`);
        }
    }
    for (const support of document.supports) {
        checkNode(`support ${support.id}`, support.node);
    }
    for (const load of document.nodalLoads) {
        checkNode(`nodal load ${load.id}`, load.node);
    }
    for (const dimension of document.dimensions ?? []) {
        checkNode(`dimension ${dimension.id}`, dimension.from);
        checkNode(`dimension ${dimension.id}`, dimension.to);
    }
    return errors;
}

function describeSchemaError(error) {
    const path = error.instancePath || '(root)';
    const { additionalProperty, allowedValues } = error.params ?? {};
    const detail = additionalProperty ?? (allowedValues != null ? allowedValues.join(', ') : null);
    return `${path}: ${error.message}${detail != null ? ` (${detail})` : ''}`;
}

function validate(document) {
    if (!validateSchema(document)) {
        const messages = (validateSchema.errors ?? []).map(describeSchemaError);
        return { valid: false, errors: Array.from(new Set(messages)) };
    }
    const errors = checkReferences(document);
    return { valid: errors.length === 0, errors };
}

module.exports = { schema, validate };
