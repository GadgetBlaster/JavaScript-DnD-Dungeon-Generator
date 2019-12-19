
import { random } from '/app/utility/random';

const option = (value) => `<option>${value}</option>`;

export const select = (label, name, values) => {
    let options = values.map((value) => {
        return option(value);
    });

    return `
        <label>${label}</label>
        <select name="${name}">
            ${options}
        </select>
    `;
};
