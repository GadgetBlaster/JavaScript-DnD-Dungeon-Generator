// @ts-check

import { element } from '../utility/element.js';
import { toss } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../utility/element.js').Attributes} Attributes */

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an HTML unordered list element strings with each item wrapped in an
 * HTML list item element string.
 *
 * @param {string[]} items
 * @param {Attributes} [attributes]
 *
 * @throws
 *
 * @returns {string}
 */
export function list(items, attributes) {
    (!items || !items.length) && toss('Items are required for lists');

    let content = items.map((item) => element('li', item)).join('');

    return element('ul', content, attributes);
}
