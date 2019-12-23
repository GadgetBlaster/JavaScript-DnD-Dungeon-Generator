

export const fieldLabel = (label) => `<label>${label}</label>`;

export const input = (name, type, value) => {
    return `<input name="${name}" type="${type}" value="${value}" />`;
};

const option = (value) => `<option>${value}</option>`;

export const select = (name, values) => {
    let options = values.map((value) => {
        return option(value);
    }).join('');

    return `<select name="${name}">${options}</select>`;
};
