
import { actions } from './action';
import { button, buttonSize } from './button';
import { config as roomKnobs } from '../rooms/knobs';
import { select } from './select';

export const knobs = roomKnobs.map(({ label: groupLabel, options }) => {
    let fields = Object.keys(options).map((key) => {
        let { label, name, values, desc } = options[key];

        let knobSelect = select(label, name, values);
        let descId     = desc && `info-${name}`;
        let descButton = desc ? button('?', actions.showHide, { target: descId }) : '';
        let descText   = desc ? `<p hidden="true" data-id="${descId}">${desc}</p>` : '';

        return `
            <div>
                ${knobSelect}
                ${descButton}
            </div>
            ${descText}
        `;
    }).join('');

    return `
        <fieldset>
            <legend>${groupLabel}</legend>
            ${fields}
        </fieldset>
    `;
}).join('') + button('Generate', actions.generate, { size: buttonSize.large });

export const getFormData = (knobContainer) => {
    let fields = [ ...knobContainer.querySelectorAll('[name]') ];
    let config = fields.reduce((set, item) => {
        let { name, value } = item;
        set[name] = value;
        return set;
    }, {});

    return config;
};
