// @ts-check

import { element } from '../utility/element.js';
import { toss } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./action.js').Action} Action */

// -- Config -------------------------------------------------------------------

export const infoLabel = '?';

/**
 * Valid button sizes
 */
const validSizes = new Set([ 'auto', 'large', 'small' ]);

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an HTML element button string.
 *
 * @param {string} label
 * @param {Action} action
 * @param {{
 *     active ?: boolean;
 *     size   ?: "auto" | "large" | "small";
 *     target ?: string;
 *     type   ?: "button" | "submit";
 *     value  ?: string;
 * }} [options]
 *
 * @throws
 *
 * @returns {string}
 */
export function button(label, action, options = {}) {
    let {
        active,
        size = 'small',
        target,
        type = 'button',
        value,
    } = options;

    !label                && toss('label is required by button()');
    !action               && toss('action is required by button()');
    !validSizes.has(size) && toss('Invalid button size');

    let dataAttrs = {
        action,
        size,
        ...(active && { active }),
        ...(target && { target }),
        ...(value && { value }),
        ...(label === infoLabel && { 'info': 'true' }),
    };

    let attributes = Object.keys(dataAttrs).reduce((attrs, key) => {
        attrs[`data-${key}`] = dataAttrs[key];
        return attrs;
    }, {});

    attributes['type'] = type;

    return element('button', label, attributes);
}
