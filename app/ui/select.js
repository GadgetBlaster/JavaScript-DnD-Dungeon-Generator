
import { random } from '/app/attribute/random';

const option = (value) => `<option>${value}</option>`;

export const select = (label, name, values) => {
    let options = values.map((value) => {
        return option(value);
    });

    options.unshift(option(random));

    return `
        <label>${label}</label>
        <select name="${name}">
            ${options}
        </select>
    `;
};
