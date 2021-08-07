// @ts-check

import { element } from '../utility/element.js';
import { toWords, toss } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../utility/element.js').Attributes} Attributes */

// -- Private Functions --------------------------------------------------------

/**
 * Returns an HTML option element string.
 *
 * @private
 *
 * @param {string} value
 * @param {string} label
 *
 * @returns {string}
 */
const option = (value, label) => element('option', label, { value });

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an HTML field label element string.
 *
 * @param {string} label
 *
 * @returns {string}
 */
export const fieldLabel = (label) => element('label', label);

/**
 * Returns an HTML input element string.
 *
 * @param {string} name
 * @param {Attributes} [attributes]
 *
 * @throws
 *
 * @returns {string}
 */
export function input(name, attributes = {}) {
    attributes.name && toss('Input `attrs` cannot contain a name');

    Object.keys(attributes).forEach(key => {
        attributes[key] === undefined && delete attributes[key];
    });

    return element('input', null, { name, type: 'text', ...attributes });
}

/**
 * Returns an HTML select element string.
 *
 * @param {string} name
 * @param {string[]} values
 *
 * @returns {string}
 */
export function select(name, values) {
    !values.length && toss('Select fields require option values');
    let options = values.map((value) => option(value, toWords(value))).join('');

    return element('select', options, { name });
}

/**
 * Returns an HTML input range type element string.
 *
 * @param {string} name
 * @param {Attributes} [attributes]
 *
 * @throws
 *
 * @returns {string}
 */
export function slider(name, attributes = {}) {
    let { type, min, max } = attributes;

    type && toss('Slider `attrs` cannot contain a type');
    min && typeof min !== 'number' && toss('Slider `min` must be a number');
    max && typeof max !== 'number' && toss('Slider `max` must be a number');
    min >= max && toss('Slider `min` must be less than `max`');

    return input(name, { type: 'range', min: 1, max: 100, ...attributes });
}
