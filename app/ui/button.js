
const infoLabel = '?';

export const buttonSize = {
    small: 'small',
    large: 'large',
};

let { small } = buttonSize;

export const button = (label, action, { size = small, target } = {}) => {
    let attrs = {
        action,
        size,
        ...(target && { target }),
        ...(label === infoLabel && { 'info': 'true' }),
    };

    let htmlAttrs = Object.keys(attrs).map((key) => {
        return `data-${key}="${attrs[key]}"`;
    }).join(' ');

    return `
        <button ${htmlAttrs}>
            ${label}
        </button>
    `;
};
