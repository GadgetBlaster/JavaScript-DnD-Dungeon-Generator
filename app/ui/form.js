
import { random } from '../utility/random';
import { rollArrayItem } from '../utility/roll';

import { config as roomKnobs } from '../room/knobs';

import { button } from './button';
import { select } from './select';

export const actionGenerate = 'generate';

export const knobs = roomKnobs.map(({ label: groupLabel, options }) => {
    let fields = Object.keys(options).map((key) => {
        let { label, name, values } = options[key];

        return `<div>${select(label, name, values)}</div>`;
    }).join('');

    return `
        <fieldset>
            <legend>${groupLabel}</legend>
            ${fields}
        </fieldset>
    `;
}).join('') + button('Generate', actionGenerate);

const getRandomSelectOption = (selectOptions) => {
    let options = [ ...selectOptions ].map(({ value }) => value !== random && value).filter(Boolean);

    return rollArrayItem(options);
};

export const getFormData = (knobContainer) => {
    let fields = [ ...knobContainer.querySelectorAll('[name]') ];
    let config = fields.reduce((set, item) => {
        let { name, value } = item;

        let formValue = value === random ? getRandomSelectOption(item.options) : value;

        set[name] = formValue;

        return set;
    }, {});

    return config;
};
