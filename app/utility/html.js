
/**
 * Create attrs
 *
 * @param {Object<string, string>} [obj]
 *
 * @returns {string}
 */
export const createAttrs = (obj = {}) => {
    return Object.keys(obj).map((key) => {
        return ` ${key}="${obj[key]}"`;
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
