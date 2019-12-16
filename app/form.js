
import { knobConfig, random } from './knobs';
import { select, button } from './ui';
import { getRandomArrayItem } from './util';

export const actionGenerate = 'generate';

const submitButton = button('Generate', actionGenerate);

export const knobUi = knobConfig.map(({ label: groupLabel, options }) => {
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
}).join('') + submitButton;

const getRandomSelectOption = (selectOptions) => {
    let options = [ ...selectOptions ].map(({ value }) => value !== random && value).filter(Boolean);

    return getRandomArrayItem(options);
}

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
