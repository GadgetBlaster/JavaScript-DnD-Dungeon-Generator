
import { actions } from './action';
import { button, buttonSize } from './button';
import { select } from './select';

export const getKnobs = (config) => config.map((knobConfig) => {
    let { label: groupLabel, options } = knobConfig;

    let fields = Object.keys(options).map((key) => {
        let { label, name, values, desc } = options[key];

        let knobSelect = select(label, name, values);
        let descId     = desc && `info-${name}`;
        let descButton = desc ? button('?', actions.showHide, { target: descId }) : '';
        let descText   = desc ? `<p hidden="true" data-id="${descId}"><small>${desc}</small></p>` : '';

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
