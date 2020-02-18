
import { toWords } from '../utility/tools.js';

export const fieldLabel = (label) => `<label>${label}</label>`;

export const input = (name, type, value) => {
    return `<input name="${name}" type="${type}" value="${value}" />`;
};

const option = (value, label) => `<option value="${value}">${label}</option>`;

export const select = (name, values) => {
    let options = values.map((value) => {
        return option(value, toWords(value));
    }).join('');

    return `<select name="${name}">${options}</select>`;
};

export const slider = (name, [ min = 1, max = 100 ] = [], value) => {
    return `<input type="range" name="${name}" min="${min}" max="${max}" value="${value}" />`;
};
