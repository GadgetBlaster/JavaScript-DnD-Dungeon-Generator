
import { element } from '../utility/html';

export const infoLabel = '?';

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

    let attributes = Object.keys(attrs).reduce((obj, key) => {
        obj[`data-${key}`] = attrs[key];
        return obj;
    }, {});

    return element('button', label, attributes);
};
