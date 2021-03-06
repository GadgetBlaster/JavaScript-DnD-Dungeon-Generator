
import { element } from '../utility/html.js';

/**
 * List
 *
 * @param {string} content
 * @param {Object<string, string>} attrs
 *
 * @throws
 *
 * @returns {string}
 */
export function list(items, attrs) {
    if (!items || !items.length) {
        throw new TypeError('Items are required for list');
    }

    let content = `<li>${items.join('</li><li>')}</li>`;

    return element('ul', content, attrs);
}
