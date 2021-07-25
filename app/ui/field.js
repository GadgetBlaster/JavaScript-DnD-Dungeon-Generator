
import { element } from '../utility/element.js';
import { toWords, toss } from '../utility/tools.js';

/** @typedef {import('../typedefs.js').Attrs} Attrs */

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
 * @param {Attrs} [attributes]
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
 * @param {Object<string, string>} [attrs]
 *
 * @throws
 *
 * @returns {string}
 */
export function slider(name, attrs = {}) {
    attrs.type && toss('Slider `attrs` cannot contain a type');
    attrs.min && typeof attrs.min !== 'number' && toss('Slider `min` must be a number');
    attrs.max && typeof attrs.max !== 'number' && toss('Slider `max` must be a number');
    attrs.min >= attrs.max && toss('Slider `min` must be less than `max`');

    return input(name, { type: 'range', min: 1, max: 100, ...attrs });
}
