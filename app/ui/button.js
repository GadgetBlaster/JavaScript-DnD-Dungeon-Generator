
const infoLabel = '?';

export const buttonSize = {
    small: 'small',
    large: 'large',
};

let { small } = buttonSize;

export const button = (label, action, options = {}) => {
    let {
        size = small,
        active,
        target,
        value,
    } = options;

    let attrs = {
        action,
        size,
        ...(active && { active }),
        ...(target && { target }),
        ...(value && { value }),
        ...(label === infoLabel && { 'info': 'true' }),
    };

    let htmlAttrs = Object.keys(attrs).map((key) => {
        return `data-${key}="${attrs[key]}"`;
    }).join(' ');

    return `<button ${htmlAttrs}>${label}</button>`;
};
