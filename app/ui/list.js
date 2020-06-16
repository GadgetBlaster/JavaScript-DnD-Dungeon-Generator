
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
export const list = (items, attrs) => {
    if (!items || !items.length) {
        throw new Error('Items are required for lists');
    }

    let content = `<li>${items.join('</li><li>')}</li>`;

    return element('ul', content, attrs);
};
