
import { element } from '../utility/html.js';

/**
 * Article
 *
 * @param {string} content
 * @param {Object<string, string>} attrs
 *
 * @returns {string}
 */
export const article = (content, attrs) => element('article', content, attrs);

/**
 * Div
 *
 * @param {string} content
 * @param {Object<string, string>} attrs
 *
 * @returns {string}
 */
export const div = (content, attrs) => element('div', content, attrs);

/**
 * Fieldset
 *
 * @param {string} content
 * @param {Object<string, string>} attrs
 *
 * @returns {string}
 */
export const fieldset = (content, attrs) => element('fieldset', content, attrs);

/**
 * Section
 *
 * @param {string} content
 * @param {Object<string, string>} attrs
 *
 * @returns {string}
 */
export const section = (content, attrs) => element('section', content, attrs);
