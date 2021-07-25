
import { element } from '../utility/element.js';

/** @type {import('../utility/element.js').Attributes} Attributes */

/**
 * List
 *
 * @param {string} content
 * @param {Attributes} attributes
 *
 * @throws
 *
 * @returns {string}
 */
export function list(items, attributes) {
    if (!items || !items.length) {
        throw new TypeError('Items are required for list');
    }

    let content = `<li>${items.join('</li><li>')}</li>`;

    return element('ul', content, attributes);
}
