
import { knobConfig, valueRandom } from './knobs';
import { select, button } from './ui';
import { getDescription } from './desc';
import { getRandomArrayItem } from './util';

const knobContainer = document.getElementById('knobs');
const contentContainer = document.getElementById('content');

const actionGenerate = 'generate';

let submitButton = button('Generate', actionGenerate);

let knobInterface = knobConfig.map(({ label: groupLabel, options }) => {
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

const getFieldConfig = () => {
    let fields = [ ...knobContainer.querySelectorAll('[name]') ];
    let config = fields.reduce((set, item) => {
        let { name, value } = item;

        if (value === valueRandom) {
            let options = [ ...item.options ].map(({ value }) => {
                if (value !== valueRandom) {
                    return value;
                }
            }).filter(Boolean);

            value = getRandomArrayItem(options);
        }

        set[name] = value;

        return set;
    }, {});

    return config;
};

const generateRoom = () => {
    let config  = getFieldConfig();
    let desc = getDescription(config);

    contentContainer.innerHTML = desc;
};

document.body.addEventListener('click', (e) => {
    e.preventDefault();

    let action = e.target.dataset.action;

    switch (action) {
        case actionGenerate:
            generateRoom();
            break;
    }
});

knobContainer.innerHTML = knobInterface;
