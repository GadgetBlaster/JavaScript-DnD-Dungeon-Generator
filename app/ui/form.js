
import { actions } from './action.js';
import { button, buttonSize, infoLabel } from './button.js';
import { div, fieldset, section } from './block.js';
import { paragraph, small } from './typography.js';
import { select, input, slider, fieldLabel } from './field.js';
import { toDash } from '../utility/tools.js';
import { typeSelect, typeNumber, typeRange } from '../knobs.js';

/**
 * Settings
 *
 * @typedef {Object} Settings
 *     @param {string} desc
 *     @param {string} label
 *     @param {string} name
 *     @param {string} type
 *     @param {*} value
 *     @param {*} values
 */

/** @type {string} submitButton */
export const submitButton = button('Generate', actions.generate, {
    size: buttonSize.large,
    type: 'submit',
});

/**
 * Get knob
 *
 * @param {Settings}
 *
 * @returns {string}
 */
const getKnob = (settings) => {
    let {
        name,
        type,
        value,
        values,
    } = settings;

    switch (type) {
        case typeSelect:
            return select(name, values);
        case typeNumber:
            return input(name, { type: 'number' , value });
        case typeRange:
            // TODO min/max config
            return slider(name, { min: values[0], max: values[1], value });
        default:
            throw new Error('Invalid knob type');
    }
};

/**
 * Render fields
 *
 * @param {Settings[]}
 *
 * @returns {string}
 */
// TODO Object.values
const renderFields = (fields) => Object.keys(fields).map((key) => {
    let settings = fields[key];

    let { desc, label, name } = settings;

    let knob       = getKnob(settings);
    let descId     = desc && `info-${name}`;
    let descButton = desc ? button(infoLabel, actions.showHide, { target: descId, size: buttonSize.auto }) : '';
    let descText   = desc ? paragraph(small(desc), { hidden: true, 'data-id': descId }) : '';
    let knobLabel  = fieldLabel(label + descButton);

    return div(knobLabel + descText + knob);
}).join('');

/**
 * Render knobs
 *
 * @param {Object[]} config // TODO describe
 * @param {string} page // TODO ?
 *
 * @returns {string}
 */
export const renderKnobs = (config, page) => config.map((knobConfig) => {
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

    return fieldset(handle + section(renderFields(fields)), attrs);
}).join('');

/**
 * Get form data
 *
 * @param {Element} knobContainer
 *
 * @returns {Object} // TODO typedef
 */
export const getFormData = (knobContainer) => {
    let fields = [ ...knobContainer.querySelectorAll('[name]') ];

    let config = fields.reduce((set, item) => {
        let { name, value } = item;

        set[name] = value;

        return set;
    }, {});

    return config;
};
