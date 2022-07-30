// @ts-check

// TODO move parts to `/ui`

import { toss } from './tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {{ [attribute: string]: string | number | boolean | undefined }} Attributes */

// -- Config -------------------------------------------------------------------

const domParser = new DOMParser();

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
 * @param {Attributes} [attributes]
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
 * @param {string | number} [content]
 * @param {Attributes} [attributes]
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

/**
 * Parses and returns an HTMLDocument fro the given HTML string, or null if the
 * string cannot be parsed.
 *
 * TODO move to dom.js
 *
 * @throws
 *
 * @param {string} string
 *
 * @returns {HTMLBodyElement}
 */
export function parseHtml(string) {
    typeof string !== 'string' && toss('A string is required in parseHtml()');

    let doc  = domParser.parseFromString(string, 'text/html');
    let body = doc.querySelector('body');

    if (!body || (!body.children.length && !body.textContent)) {
        toss(`Invalid HTML string "${string}"`);
    }

    return body;

}
/**
 * Parses and returns an XMLDocument fro the given SVG string, or null if the
 * string cannot be parsed.
 *
 * TODO move to dom.js
 *
 * @throws
 *
 * @param {string} string
 *
 * @returns {XMLDocument}
 */
export function parseSvg(string) {
    typeof string !== 'string' && toss('A string is required in parseSvg()');

    let doc = domParser.parseFromString(string, 'image/svg+xml');
    let errorNode = doc.querySelector('parsererror');

    errorNode && toss(`Invalid SVG string "${string}"`);

    return doc;
}
