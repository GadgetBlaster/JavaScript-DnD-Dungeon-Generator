// @ts-check

import { element } from '../utility/element.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../utility/element.js').Attributes} Attributes */

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an HTML article element string.
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const article = (content, attributes) => element('article', content, attributes);

/**
 * Returns an HTML div element string.
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const div = (content, attributes) => element('div', content, attributes);

/**
 * Returns an HTML fieldset element string.
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const fieldset = (content, attributes) => element('fieldset', content, attributes);

/**
 * Returns an HTML header element string.
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const header = (content, attributes) => element('header', content, attributes);

/**
 * Returns an HTML section element string.
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const section = (content, attributes) => element('section', content, attributes);
