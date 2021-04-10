
/** @typedef {import('../typedefs.js').Attrs} Attrs */

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
 * @param {string} content
 * @param {Attrs} [attrs]
 *
 * @returns {string}
 */
export function element(tag, content, attrs) {
    return `<${tag}${createAttrs(attrs)}>${content}</${tag}>`;
}
