
import { element } from '../utility/element.js';

/** @typedef {import('../typedefs.js').Attrs} Attrs */

/** @type {(label: string, attrs: Attrs) => string} */
export const em = (label, attrs) => element('em', label, attrs);

/** @type {(label: string, attrs: Attrs) => string} */
export const paragraph = (label, attrs) => element('p', label, attrs);

/** @type {(label: string, attrs: Attrs) => string} */
export const small = (label, attrs) => element('small', label, attrs);

/** @type {(label: string, attrs: Attrs) => string} */
export const strong = (label, attrs) => element('strong', label, attrs);

/** @type {(label: string, attrs: Attrs) => string} */
export const subtitle = (label, attrs) => element('h3', label, attrs);

/** @type {(label: string, attrs: Attrs) => string} */
export const title = (label, attrs) => element('h2', label, attrs);
