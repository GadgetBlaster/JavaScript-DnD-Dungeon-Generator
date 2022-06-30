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
 * @param {Attributes} [attributes = {}]
 *
 * @returns {string}
 */
const option = (value, label, attributes = {}) => element('option', label, { ...attributes, value });

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an HTML field label element string.
 *
 * @param {string} label
 * @param {Attributes} [attributes = {}]
 *
 * @returns {string}
 */
export const fieldLabel = (label, attributes = {}) => element('label', label, attributes);

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

    return element('input', null, { type: 'text', ...attributes, name });
}

/**
 * Returns an HTML select element string.
 *
 * @param {string} name
 * @param {string[]} values
 * @param {string} [selectedValue]
 * @param {Attributes} [attributes = {}]
 *
 * @returns {string}
 */
export function select(name, values, selectedValue, attributes = {}) {
    (!values || !values.length) && toss('Select fields require option values');

    let options = values.map((value) => {
        /** @type {Attributes} */
        let attrs = value === selectedValue ? { selected: '' } : {};

        return option(value, toWords(value), attrs);
    }).join('');

    return element('select', options, { ...attributes, name });
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
