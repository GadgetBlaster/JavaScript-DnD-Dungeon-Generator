// @ts-check

import { element } from '../utility/element.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../utility/element').Attributes} Attributes */

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an HTML emphasis element string.
 *
 * @param {string} label
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const em = (label, attributes) => element('em', label, attributes);

/**
 * Returns an HTML paragraph element string.
 *
 * @param {string} label
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const paragraph = (label, attributes) => element('p', label, attributes);

/**
 * Returns an HTML small element string.
 *
 * @param {string} label
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const small = (label, attributes) => element('small', label, attributes);

/**
 * Returns an HTML span element string.
 *
 * @param {string} label
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const span = (label, attributes) => element('span', label, attributes);

/**
 * Returns an HTML subtitle (h3) element string.
 *
 * @param {string} label
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const subtitle = (label, attributes) => element('h2', label, attributes);

/**
 * Returns an HTML title (h2) element string.
 *
 * @param {string} label
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const title = (label, attributes) => element('h1', label, attributes);
