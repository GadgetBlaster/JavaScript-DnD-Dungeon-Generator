// @ts-check

import { button, infoLabel } from './button.js';
import { div, fieldset } from './block.js';
import { knobConfig, getKnobConfig } from '../controller/knobs.js';
import { paragraph, small, span, subtitle } from './typography.js';
import { select, input, slider, fieldLabel } from './field.js';
import { isRequired, toDash, toss, toWords } from '../utility/tools.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Action} Action */
/** @typedef {import('../controller/controller.js').Generator} Generator */
/** @typedef {import('../controller/knobs.js').Config} Config */
/** @typedef {import('../controller/knobs.js').KnobConfig} KnobConfig */
/** @typedef {import('../controller/knobs.js').KnobFieldConfig} KnobFieldConfig */

// -- Config -------------------------------------------------------------------

const maxExpandedColumns = 3;

const expandButton = button(span(''), 'expand', {
    size: 'auto',
    ariaLabel: 'Expand form',
});

const collapseButton = button(span(''), 'expand', {
    size: 'auto',
    ariaLabel: 'Collapse form',
});

const submitButton = button('Generate', 'generate', {
    size: 'large',
    type: 'submit',
});

// -- Private Functions --------------------------------------------------------

/**
 * Returns a set of HTML fieldset accordion element strings containing form
 * elements for the given knobs.
 *
 * @private
 *
 * @param {KnobConfig[]} knobs
 *
 * @returns {string}
 */
const formatKnobAccordions = (knobs) => knobs.map((knobSet, i) => {
    let {
        label,
        fields,
        generator,
    } = knobSet;

    let fieldsetId = `fieldset-${toDash(label)}`;
    let handle = button(label, 'accordion', { target: fieldsetId });

    let attrs = {
        'data-accordion': i === 0 ? 'expanded' : 'collapsed',
        'data-id': fieldsetId,
    };

    return fieldset(handle + getFields(fields, generator), attrs);
}).join('');

/**
 * Returns a set of HTML fieldset element strings containing form elements for
 * the given knobs.
 *
 * @private
 *
 * @param {KnobConfig[]} knobs
 *
 * @returns {string}
 */
const formatKnobSections = (knobs) => knobs.map((knobSet) => {
    let {
        fields,
        label,
        generator,
    } = knobSet;

    return fieldset(subtitle(label) + getFields(fields, generator));
}).join('');

/**
 * Returns HTML form field element strings for the given fields.
 *
 * @private
 * @throws
 *
 * @param {KnobFieldConfig[]} fields
 * @param {Generator} generator // TODO tests
 *
 * @returns {string}
 */
const getFields = (fields, generator) => fields.map((settings) => {
    let { desc, label, name } = settings;

    !generator && toss('generator is required in getFields()');
    !name      && toss('knob name is required in getFields()');
    !label     && toss('knob label is required in getFields()');
    !desc      && toss('knob description is required in getFields()');

    let { errorId, infoId, knobId}  = getKnobIds(name);

    let knob       = getKnob(settings, { knobId, generatorId: generator, infoId, errorId });
    let infoButton = button(infoLabel, 'toggle', { target: infoId, size: 'auto' });
    let infoText   = paragraph(small(desc), { hidden: 'true', id: infoId }); // TODO make into pop-up
    let knobLabel  = fieldLabel(label + infoButton, { for: knobId }); // TODO restructure
    let errorText  = paragraph('', { id: errorId, hidden: 'true', 'data-error': '' });

    return div(knobLabel + infoText + knob + errorText);
}).join('');

/**
 * Returns an array of `HTMLInputElement` children for the container.
 *
 * @private
 *
 * @param {HTMLElement} knobContainer
 *
 * @returns {ReturnType<HTMLInputElement[]>}
 */
const getInputElements = (knobContainer) => [ ...knobContainer.querySelectorAll('[name]') ];

/**
 * Returns an HTML from element string for the given knob type.
 *
 * @private
 * @throws
 *
 * @param {KnobFieldConfig} config
 * @param {object} ids
 *     @param {string} ids.errorId
 *     @param {string} ids.generatorId
 *     @param {string} ids.infoId
 *     @param {string} ids.knobId
 *
 * @returns {string}
 */
function getKnob(config, ids) {
    let {
        name,
        type,
        value,
        values,
        min,
        max,
    } = config;

    let { errorId, generatorId, infoId, knobId } = ids;

    // TODO tests
    let attrs = {
        'data-generator': generatorId,
        'aria-describedby': `${infoId} ${errorId}`,
        'data-error-id': errorId,
        id: knobId,
    };

    switch (type) {
        case 'number':
            return input(name, { ...attrs, min, max, type: 'number', value });

        case 'range':
            return slider(name, { ...attrs, min, max, value });

        case 'select':
            if (typeof value !== 'undefined' && typeof value !== 'string') {
                toss('Select value must be a string in getKnob()');
            }

            if (typeof values === 'undefined' || !Array.isArray(values)) {
                toss('Select values must be an array of strings in getKnob()');
            }

            return select(name, values, value, { ...attrs });

        case 'text':
            return input(name, { ...attrs, type: 'text', value });

        default:
            toss('Invalid knob type in getKnob()');
    }
}

/**
 * Returns various HTML attribute ids for a knob.
 *
 * @param {string} name
 *
 * @returns {{
 *   errorId: string;
 *   infoId : string;
 *   knobId : string;
 * }}
 */
function getKnobIds(name) {
    let dashName = toDash(toWords(name));

    return {
        errorId: `error-${dashName}`,
        infoId : `info-${dashName}`,
        knobId : `knob-${dashName}`,
    };
}

export {
    formatKnobAccordions as testFormatKnobAccordions,
    getFields            as testGetFields,
    getKnob              as testGetKnob,
    getKnobIds           as testGetKnobIds,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Gets form data for the given form container.
 *
 * @param {HTMLElement} knobContainer
 *
 * @returns {Config}
 */
export function getFormData(knobContainer) {
    return getInputElements(knobContainer).reduce((settings, knob) => {
        let { name, value, dataset } = knob;

        let generator = dataset.generator;

        isRequired(generator, `data-generator attribute is required on field "${name}" in getFormData()`);

        if (!settings[generator]) {
            settings[generator] = {};
        }

        settings[generator][name] = value;

        return settings;
    }, {});
}

/**
 * Update form knobs when changing generators.
 *
 * @param {Generator} generator
 * @param {object} options
 *     @param {Config} [options.config]
 *     @param {boolean} [options.isExpanded]
 *
 * @returns {string}
 */
export function getKnobPanel(generator, { config, isExpanded } = {}) {
    let knobs     = getKnobConfig(knobConfig, generator, config);
    let knobPanel = isExpanded
        ? formatKnobSections(knobs)
        : formatKnobAccordions(knobs);

    let columnCount          = Math.min(knobs.length, maxExpandedColumns);
    let knobContainerAttrs   = isExpanded ? { 'data-grid': columnCount } : {};
    let buttonContainerAttrs = { 'data-flex': 'justify-between', 'data-spacing': 'default' };

    let expandCollapseButton = isExpanded ? collapseButton : expandButton;

    let content =
        div(submitButton + expandCollapseButton, buttonContainerAttrs) +
        div(knobPanel, knobContainerAttrs);

    return content;
}

/**
 * Validates a control element on blur, adding or clearing the error state.
 *
 * TODO tests
 *
 * @param {HTMLElement} knobs
 * @param {HTMLInputElement | HTMLSelectElement} element
 */
export function validateOnBlur(knobs, element) {
    let { value } = element;

    let min = element.getAttribute('min');
    let max = element.getAttribute('max');

    let errors = [];

    if (min && Number(value) < Number(min)) {
        errors.push(`Min: ${min}`);
    }

    if (max && Number(value) > Number(max)) {
        errors.push(`Max: ${max}`);
    }

    let errorId = element.dataset.errorId;
    let errorEl = /** @type {HTMLElement} */ (knobs.querySelector(`[id="${errorId}"]`));

    if (!errors.length) {
        delete element.dataset.error;
        errorEl.textContent = '';
        errorEl.hidden = true;
        return;
    }

    element.dataset.error = '';
    errorEl.textContent = errors.join('. ').trim();
    errorEl.hidden = false;
}
