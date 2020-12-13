
/**
 * Create html attributes
 *
 * @param {Object<string, string>} [attrs]
 *     An object with html attribute names as the keys and attribute values as
 *     the values.
 *
 * @returns {string}
 */
export const createAttrs = (attrs = {}) => {
    return Object.keys(attrs).map((key) => {
        return ` ${key}="${attrs[key]}"`;
    }).join('');
};

/**
 * Element
 *
 * @param {string} tag
 * @param {string} content
 * @param {Object<string, string>} [attrs]
 *
 * @returns {string}
 */
export const element = (tag, content, attrs) => {
    return `<${tag}${createAttrs(attrs)}>${content}</${tag}>`;
};
