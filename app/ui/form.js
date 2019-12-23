
import { actions } from './action';
import { button, buttonSize } from './button';
import { div, legend, fieldset } from './block';
import { select, input, fieldLabel } from './field';
import { typeSelect, typeNumber } from '../knobs';

const submitButton = button('Generate', actions.generate, { size: buttonSize.large });

const getKnob = (settings) => {
    let {
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

const renderFields = (options) => Object.keys(options).map((key) => {
    let settings = options[key];

    let { desc, label, name } = settings;

    let knobLabel  = fieldLabel(label);
    let knob       = getKnob(settings);
    let descId     = desc && `info-${name}`;
    let descButton = desc ? button('?', actions.showHide, { target: descId }) : '';
    let descText   = desc ? `<p hidden="true" data-id="${descId}"><small>${desc}</small></p>` : '';

    return div(knobLabel + knob + descButton) + descText;
}).join('');

export const renderKnobs = (config, page) => config.map((knobConfig) => {
    let {
        label,
        labels,
        options,
    } = knobConfig;

    if (labels && labels[page]) {
        label = labels[page];
    }

    let fields = renderFields(options);

    return fieldset(legend(label) + fields);
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
