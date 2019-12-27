
import { actions } from './action';
import { button, buttonSize, infoLabel } from './button';
import { div, legend, fieldset } from './block';
import { select, input, fieldLabel } from './field';
import { typeSelect, typeNumber } from '../knobs';
import { paragraph, small } from './typography';

const submitButton = button('Generate', actions.generate, { size: buttonSize.large });

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
        default:
            throw 'Invalid knob type';
    }
};

const renderFields = (fields) => Object.keys(fields).map((key) => {
    let settings = fields[key];

    let { desc, label, name } = settings;

    let knobLabel  = fieldLabel(label);
    let knob       = getKnob(settings);
    let descId     = desc && `info-${name}`;
    let descButton = desc ? button(infoLabel, actions.showHide, { target: descId }) : '';
    let descText   = desc ? paragraph(small(desc), { hidden: true, 'data-id': descId }) : '';

    return div(knobLabel + knob + descButton) + descText;
}).join('');

export const renderKnobs = (config, page) => config.map((knobConfig, i) => {
    let {
        label,
        labels,
        fields,
    } = knobConfig;

    if (labels && labels[page]) {
        label = labels[page];
    }

    let fieldsetId = `fieldset-${label}`;
    let handle = legend(label, {
        'data-action': actions.expandCollapse,
        'data-target': fieldsetId,
    });

    let attrs = {
        'data-collapsed': i !== 0,
        'data-id': fieldsetId,
    };

    return fieldset(handle + renderFields(fields), attrs);
}).join('') + submitButton;

export const getFormData = (knobContainer) => {
    let fields = [ ...knobContainer.querySelectorAll('[name]') ];

    let config = fields.reduce((set, item) => {
        let { name, value } = item;

        set[name] = value;

        return set;
    }, {});

    return config;
};
