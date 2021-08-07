// @ts-check

import { element } from '../utility/element.js';

// -- Types --------------------------------------------------------------------

/**
 * Button options
 *
 * @typedef {object} ButtonOptions
 *
 * @property {boolean} [active]
 * @property {string} [size]
 * @property {string} [target]
 * @property {string} [value]
 * @property {string} [type]
 */

// -- Config -------------------------------------------------------------------

export const infoLabel = '?';

/**
 * Button size
 */
export const buttonSize = {
    auto : 'auto',
    large: 'large',
    small: 'small',
};

/**
 * Valid button sizes
 */
const validSizes = new Set(Object.values(buttonSize));

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an HTML element button string.
 *
 * @param {string} label
 * @param {string} action
 * @param {ButtonOptions} [options]
 *
 * @throws
 *
 * @returns {string}
 */
export function button(label, action, options = {}) {
    let {
        active,
        size = buttonSize.small,
        target,
        type = 'button',
        value,
    } = options;

    if (!validSizes.has(size)) {
        throw new TypeError('Invalid button size');
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
}
