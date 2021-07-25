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

// -- Public Functions ---------------------------------------------------------

/**
 * Create html attributes
 *
 * @param {Attrs} [attributes]
 *     An object with HTML attribute names as the keys and attribute values as
 *     the values.
 *
 * @returns {string}
 */
export function createAttrs(attributes = {}) {
    return Object.keys(attributes).map((key) => {
        return ` ${key}="${attributes[key]}"`;
    }).join('');
}

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
    if (selfClosingElements.includes(tag)) {
        content && toss('Content is not allowed in self closing elements');
        return `<${tag}${createAttrs(attributes)} />`;
    }

    return `<${tag}${createAttrs(attributes)}>${content}</${tag}>`;
}
