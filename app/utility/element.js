// @ts-check

import { toss } from './tools.js';

/**
 * @typedef {{ [attribute: string]: string | number | boolean }} Attrs
 */

// -- Config -------------------------------------------------------------------

/**
 * Empty elements
 *
 * @type {readonly string[]}
 */
export const selfClosingElements = Object.freeze([
    // HTML elements
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',

    // SVG elements
    'circle',
    'line',
    'rect',
]);

// -- Private Functions --------------------------------------------------------

/**
 * Create html attributes
 *
 * @param {Attrs} [attributes]
 *     An object with HTML attribute names as the keys and attribute values as
 *     the values.
 *
 * @returns {string}
 */
function createAttributes(attributes = {}) {
    return Object.keys(attributes).map((key) => {
        return ` ${key}="${attributes[key]}"`;
    }).join('');
}

export { createAttributes as testCreateAttributes };

// -- Public Functions ---------------------------------------------------------

/**
 * Element
 *
 * @param {string} tag
 * @param {string} [content]
 * @param {Attrs} [attributes]
 *
 * @returns {string}
 */
export function element(tag, content = '', attributes = {}) {
    let elementAttributes = createAttributes(attributes);

    if (selfClosingElements.includes(tag)) {
        content && toss('Content is not allowed in self closing elements');
        return `<${tag}${elementAttributes} />`;
    }

    return `<${tag}${elementAttributes}>${content}</${tag}>`;
}
