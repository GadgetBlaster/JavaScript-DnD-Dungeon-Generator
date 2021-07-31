// @ts-check

import { element } from '../utility/element.js';

/** @typedef {import('../utility/element').Attributes} Attributes */

/** @type {(label: string, attributes?: Attributes) => string} */
export const em = (label, attributes) => element('em', label, attributes);

/** @type {(label: string, attributes?: Attributes) => string} */
export const paragraph = (label, attributes) => element('p', label, attributes);

/** @type {(label: string, attributes?: Attributes) => string} */
export const small = (label, attributes) => element('small', label, attributes);

/** @type {(label: string, attributes?: Attributes) => string} */
export const strong = (label, attributes) => element('strong', label, attributes);

/** @type {(label: string, attributes?: Attributes) => string} */
export const subtitle = (label, attributes) => element('h3', label, attributes);

/** @type {(label: string, attributes?: Attributes) => string} */
export const title = (label, attributes) => element('h2', label, attributes);
