
import { element } from '../utility/html.js';

/** @typedef {import('../typedefs.js').Attrs} Attrs */

/**
 * Link
 *
 * @param {string} [label=""]
 * @param {string} [href]
 * @param {Attrs} [attrs]
 *
 * @returns {string}
 */
export const link = (label = '', href, attrs) => element('a', label, {
    ...attrs,
    ...(href && { href }),
});
