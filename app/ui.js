
import { valueRandom } from './knobs';

export const button = (label, action) => {
    return `
        <button data-action="${action}">
            ${label}
        </button>
    `;
};

const option = (value) => {
    return `<option>${value}</option>`;
};

export const select = (label, name, values) => {
    let options = values.map((value) => {
        return option(value);
    });

    options.unshift(option(valueRandom));

    return `
        <label>${label}</label>
        <select name="${name}">
            ${options}
        </select>
    `;
};
