// @ts-check

import { element } from '../utility/element.js';

/** @typedef {import('../utility/element.js').Attributes} Attributes */

/**
 * Returns an HTML anchor element string.
 *
 * @param {string} label
 * @param {string} [href]
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export const link = (label, href, attributes) => element('a', label, {
    ...attributes,
    ...(href && { href }),
});
