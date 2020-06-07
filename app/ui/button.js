
import { element } from '../utility/html.js';

/** @type {string} infoLabel */
export const infoLabel = '?';

/**
 * Button size
 *
 * @type {Object<string, string>} buttonSize
 */
export const buttonSize = {
    auto: 'auto',
    large: 'large',
    small: 'small',
};

/**
 * Valid sizes
 *
 * @type {Set<string>}
 */
const validSizes = new Set(Object.values(buttonSize));

/**
 * Button options
 *
 * @typedef {Object} ButtonOptions
 *      @property {boolean} active
 *      @property {string} size
 *      @property {string} target
 *      @property {string} value
 *      @property {string} type
 */

/**
 * Button
 *
 * @param {string} label
 * @param {string} action
 * @param {ButtonOptions} options
 *
 * @returns {string}
 */
export const button = (label, action, options = {}) => {
    let {
        active,
        size = buttonSize.small,
        target,
        type = 'button',
        value,
    } = options;

    if (!validSizes.has(size)) {
        throw new Error(`Invalid button size: ${size}`);
    }

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

    attributes['type'] = type;

    return element('button', label, attributes);
};
