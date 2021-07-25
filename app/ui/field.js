
import { element, createAttrs } from '../utility/element.js';
import { toWords } from '../utility/tools.js';

/** @typedef {import('../typedefs.js').Attrs} Attrs */

// -- Private Functions --------------------------------------------------------

/**
 * Throw
 *
 * @private
 *
 * @param {string} message
 *
 * @throws
 */
const _throw = (message) => { throw new TypeError(message); };

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
 * @param {Attrs} [attrs]
 *
 * @throws
 *
 * @returns {string}
 */
export function input(name, attrs = {}) {
    attrs.name && _throw('Input `attrs` cannot contain a name');
    Object.keys(attrs).forEach(key => attrs[key] === undefined && delete attrs[key]);

    return `<input${createAttrs({ name, type: 'text', ...attrs })} />`;
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
    attrs.type && _throw('Slider `attrs` cannot contain a type');
    attrs.min && typeof attrs.min !== 'number' && _throw('Slider `min` must be a number');
    attrs.max && typeof attrs.max !== 'number' && _throw('Slider `max` must be a number');
    attrs.min >= attrs.max && _throw('Slider `min` must be less than `max`');

    return input(name, { type: 'range', min: 1, max: 100, ...attrs });
}
