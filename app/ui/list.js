// @ts-check

import { element } from '../utility/element.js';
import { toss } from '../utility/tools.js';

/** @typedef {import('../utility/element.js').Attributes} Attributes */

/**
 * List
 *
 * @param {string[]} items
 * @param {Attributes} [attributes]
 *
 * @throws
 *
 * @returns {string}
 */
export function list(items, attributes) {
    if (!items || !items.length) {
        toss('Items are required for lists');
    }

    let content = items.map((item) => element('li', item)).join('');

    return element('ul', content, attributes);
}
