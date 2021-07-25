
import { element } from '../utility/element.js';

/** @typedef {import('../typedefs.js').Attrs} Attrs */

/**
 * Article
 *
 * @param {string} content
 * @param {Attrs} [attrs]
 *
 * @returns {string}
 */
export const article = (content, attrs) => element('article', content, attrs);

/**
 * Div
 *
 * @param {string} content
 * @param {Attrs} [attrs]
 *
 * @returns {string}
 */
export const div = (content, attrs) => element('div', content, attrs);

/**
 * Fieldset
 *
 * @param {string} content
 * @param {Attrs} [attrs]
 *
 * @returns {string}
 */
export const fieldset = (content, attrs) => element('fieldset', content, attrs);

/**
 * Section
 *
 * @param {string} content
 * @param {Attrs} [attrs]
 *
 * @returns {string}
 */
export const section = (content, attrs) => element('section', content, attrs);
