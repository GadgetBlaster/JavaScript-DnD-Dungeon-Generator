
import { element } from '../utility/element.js';
import { toWords, toss } from '../utility/tools.js';

/** @typedef {import('../utility/element.js').Attributes} Attributes */

// -- Private Functions --------------------------------------------------------

/**
 * Option
 *
 * @private
 *
 * @param {string} label
 * @param {string} type
 *
 * @returns {string}
 */
const option = (value, label) => element('option', label, { value });

// -- Public Functions ---------------------------------------------------------

/**
 * Field label
 *
 * @param {string} label
 *
 * @returns {string}
 */
export const fieldLabel = (label) => element('label', label);

/**
 * Input
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
 * Input
 *
 * @param {string} name
 * @param {string[]} values
 *
 * @returns {string}
 */
export function select(name, values) {
    let options = values.map((value) => option(value, toWords(value))).join('');

    return element('select', options, { name });
}

/**
 * Slider
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
