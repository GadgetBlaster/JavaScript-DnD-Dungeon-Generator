
import { uiSmall } from './size';

export const button = (label, action, { size = uiSmall, target } = {}) => {
    let attrs = {
        action,
        size,
        ...(target && { target })
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
