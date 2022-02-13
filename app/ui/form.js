// @ts-check

import { button, infoLabel } from './button.js';
import { div, fieldset, section } from './block.js';
import { paragraph, small } from './typography.js';
import { select, input, slider, fieldLabel } from './field.js';
import { toDash, toss } from '../utility/tools.js';
import { getKnobConfig, typeSelect, typeNumber, typeRange } from '../controller/knobs.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Action} Action */
/** @typedef {import('../controller/knobs.js').KnobSet} KnobSet */
/** @typedef {import('../controller/knobs.js').KnobSettings} KnobSettings */
/** @typedef {import('./nav.js').Page} Page */

// -- Config -------------------------------------------------------------------

const submitButton = button('Generate', 'generate', {
    size: 'large',
    type: 'submit',
});

// -- Private Functions --------------------------------------------------------

/**
 * Returns an array of HTMLInputElement children for the knob container.
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
 * @param {KnobSettings} settings
 *
 * @returns {string}
 */
function getKnob(settings) {
    let {
        name,
        type,
        value,
        values,
        min,
        max,
    } = settings;

    switch (type) {
        case typeSelect:
            return select(name, values);
        case typeNumber:
            return input(name, { type: 'number' , value });
        case typeRange:
            return slider(name, { min, max, value });
        default:
            toss('Invalid knob type');
    }
}

/**
 * Renders form fields for the given knob settings configurations.
 *
 * @private
 * @throws
 *
 * @param {KnobSettings[]} fields
 *
 * @returns {string}
 */
const renderFields = (fields) => fields.map((settings) => {
    let { desc, label, name } = settings;

    !name  && toss('Missing required knob name');
    !label && toss('Missing required knob label');
    !desc  && toss('Missing required knob description');

    let knob       = getKnob(settings);
    let descId     = desc && `info-${name}`;
    let descButton = button(infoLabel, 'toggle', { target: descId, size: 'auto' });
    let descText   = paragraph(small(desc), { hidden: true, 'data-id': descId }); // TODO style instead of `<small>`
    let knobLabel  = fieldLabel(label + descButton);

    return div(knobLabel + descText + knob);
}).join('');

/**
 * Renders a fieldset containing from elements for the given knob sets.
 *
 * @private
 *
 * @param {KnobSet[]} knobs
 * @param {string} [page]
 *
 * @returns {string}
 */
const renderKnobs = (knobs, page) => knobs.map((knobSet) => {
    let {
        label,
        labels,
        fields,
    } = knobSet;

    if (labels && labels[page]) {
        label = labels[page];
    }

    let fieldsetId = `fieldset-${toDash(label)}`;
    let handle = button(label, 'accordion', { target: fieldsetId });

    let attrs = {
        'data-collapsed': true,
        'data-id': fieldsetId,
    };

    return fieldset(handle + section(renderFields(fields)), attrs);
}).join('');

export {
    getKnob      as testGetKnob,
    renderFields as testRenderFields,
    renderKnobs  as testRenderKnobs,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Gets form data for the given form container.
 *
 * @param {HTMLElement} knobContainer
 *
 * @returns {Object<string, *>}
 */
export function getFormData(knobContainer) {
    return getInputElements(knobContainer).reduce((set, item) => {
        let { name, value } = item;

        set[name] = value;

        return set;
    }, {});
}

/**
 * Update form knobs when changing pages.
 *
 * @param {Page} [page = "dungeon"] // TODO make rquired
 *
 * @returns {string}
 */
export const getKnobPanel = (page = 'dungeon') =>
    submitButton + renderKnobs(getKnobConfig(page), page);
