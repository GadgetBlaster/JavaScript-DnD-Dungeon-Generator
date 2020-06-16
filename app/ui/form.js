
import { actions } from './action.js';
import { button, buttonSize, infoLabel } from './button.js';
import { div, fieldset, section } from './block.js';
import { paragraph, small } from './typography.js';
import { select, input, slider, fieldLabel } from './field.js';
import { toDash } from '../utility/tools.js';
import { typeSelect, typeNumber, typeRange } from '../knobs.js';

/**
 * Throw
 *
 * @private
 *
 * @param {string} message
 *
 * @throws
 */
const _throw = (message) => { throw new Error(message); };

/**
 * @typedef {import('../knobs.js').KnobSettings} KnobSettings
 * @typedef {import('../knobs.js').KnobSet} KnobSet
 */

/** @type {string} submitButton */
export const submitButton = button('Generate', actions.generate, {
    size: buttonSize.large,
    type: 'submit',
});

/**
 * Get knob
 *
 * @private
 *
 * @param {KnobSettings} settings
 *
 * @returns {string}
 */
export const _getKnob = (settings) => {
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
            throw new Error('Invalid knob type');
    }
};

/**
 * Render fields
 *
 * @private
 *
 * @param {KnobSettings[]}
 *
 * @returns {string}
 */
export const _renderFields = (fields) => fields.map((settings) => {
    let { desc, label, name } = settings;

    !name  && _throw('Missing required knob setting: name');
    !label && _throw('Missing required knob setting: label');

    let knob       = _getKnob(settings);
    let descId     = desc && `info-${name}`;
    let descButton = desc ? button(infoLabel, actions.showHide, { target: descId, size: buttonSize.auto }) : '';
    let descText   = desc ? paragraph(small(desc), { hidden: true, 'data-id': descId }) : '';
    let knobLabel  = fieldLabel(label + descButton);

    return div(knobLabel + descText + knob);
}).join('');

/**
 * Render knobs
 *
 * @param {KnobSet[]} knobs
 * @param {string} [page]
 *
 * @returns {string}
 */
export const renderKnobs = (knobs, page) => knobs.map((knobConfig) => {
    let {
        label,
        labels,
        fields,
    } = knobConfig;

    if (labels && labels[page]) {
        label = labels[page];
    }

    let fieldsetId = `fieldset-${toDash(label)}`;
    let handle = button(label, actions.accordion, { target: fieldsetId });

    let attrs = {
        'data-collapsed': true,
        'data-id': fieldsetId,
    };

    return fieldset(handle + section(_renderFields(fields)), attrs);
}).join('');

/**
 * Get form data
 *
 * @param {Element} knobContainer
 *
 * @returns {Object<string, *>}
 */
export const getFormData = (knobContainer) => {
    return [ ...knobContainer.querySelectorAll('[name]') ].reduce((set, item) => {
        let { name, value } = item;

        set[name] = value;

        return set;
    }, {});
};
