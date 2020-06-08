
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
 * @throws
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

    let dataAttrs = {
        action,
        size,
        ...(active && { active }),
        ...(target && { target }),
        ...(value && { value }),
        ...(label === infoLabel && { 'info': 'true' }),
    };

    let attributes = Object.keys(dataAttrs).reduce((attrs, key) => {
        attrs[`data-${key}`] = dataAttrs[key];
        return attrs;
    }, {});

    attributes['type'] = type;

    return element('button', label, attributes);
};
