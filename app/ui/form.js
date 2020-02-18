
import { actions } from './action.js';
import { button, buttonSize, infoLabel } from './button.js';
import { div, fieldset, section } from './block.js';
import { paragraph, small } from './typography.js';
import { select, input, slider, fieldLabel } from './field.js';
import { toDash } from '../utility/tools.js';
import { typeSelect, typeNumber, typeRange } from '../knobs.js';

const submitButton = button('Generate', actions.generate, {
    size: buttonSize.large,
    type: 'submit',
});

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
            return input(name, 'number', value);
        case typeRange:
            return slider(name, values, value);
        default:
            throw 'Invalid knob type';
    }
};

const renderFields = (fields) => Object.keys(fields).map((key) => {
    let settings = fields[key];

    let { desc, label, name } = settings;

    let knob       = getKnob(settings);
    let descId     = desc && `info-${name}`;
    let descButton = desc ? button(infoLabel, actions.showHide, { target: descId, size: 'auto' }) : '';
    let descText   = desc ? paragraph(small(desc), { hidden: true, 'data-id': descId }) : '';
    let knobLabel  = fieldLabel(label + descButton);

    return div(knobLabel + descText + knob);
}).join('');

export const renderKnobs = (config, page) => submitButton + config.map((knobConfig) => {
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

export const getFormData = (knobContainer) => {
    let fields = [ ...knobContainer.querySelectorAll('[name]') ];

    let config = fields.reduce((set, item) => {
        let { name, value } = item;

        set[name] = value;

        return set;
    }, {});

    return config;
};
