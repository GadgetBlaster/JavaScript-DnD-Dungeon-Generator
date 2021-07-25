// @ts-check

import { toss } from './tools.js';

// -- Config -------------------------------------------------------------------

/** @typedef {import('../typedefs.js').Attrs} Attrs */
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
 * @param {Attrs} [attrs]
 *     An object with HTML attribute names as the keys and attribute values as
 *     the values.
 *
 * @returns {string}
 */
export function createAttrs(attrs = {}) {
    return Object.keys(attrs).map((key) => {
        return ` ${key}="${attrs[key]}"`;
    }).join('');
}

/**
 * Element
 *
 * @param {string} tag
 * @param {string} [content]
 * @param {Attrs} [attrs]
 *
 * @returns {string}
 */
export function element(tag, content = '', attrs = {}) {
    if (selfClosingElements.includes(tag)) {
        content && toss('Content is not allowed in self closing elements');
        return `<${tag}${createAttrs(attrs)} />`;
    }

    return `<${tag}${createAttrs(attrs)}>${content}</${tag}>`;
}
