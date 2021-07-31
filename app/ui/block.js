// @ts-check

import { element } from '../utility/element.js';

/** @typedef {import('../utility/element.js').Attributes} Attributes */

/**
 * Article
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const article = (content, attributes) => element('article', content, attributes);

/**
 * Div
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const div = (content, attributes) => element('div', content, attributes);

/**
 * Fieldset
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const fieldset = (content, attributes) => element('fieldset', content, attributes);

/**
 * Section
 *
 * @param {string} content
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const section = (content, attributes) => element('section', content, attributes);
