// @ts-check

import { element } from '../utility/element.js';
import { toss } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Action} Action */
/** @typedef {import('../utility/element.js').Attributes} Attributes */

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
 *     active   ?: boolean;
 *     ariaLabel?: string;
 *     disabled ?: boolean;
 *     size     ?: "auto" | "large" | "small";
 *     target   ?: string;
 *     type     ?: "button" | "submit";
 *     value    ?: string;
 * }} [options]
 *
 * @throws
 *
 * @returns {string}
 */
export function button(label, action, {
    active,
    ariaLabel,
    disabled,
    size = 'small',
    target,
    type = 'button',
    value,
} = {}) {
    !label                && toss('label is required by button()');
    !action               && toss('action is required by button()');
    !validSizes.has(size) && toss('Invalid button size');

    let dataAttrs = {
        action,
        size,
        ...(active && { active }),
        ...(target && { target }),
        ...(value && { value }),
        ...(label === infoLabel && { 'info': '' }),
    };

    /** @type {import('./block.js').Attributes} */
    let attributes = Object.keys(dataAttrs).reduce((attrs, key) => {
        attrs[`data-${key}`] = dataAttrs[key];
        return attrs;
    }, {});

    attributes['type'] = type;

    if (ariaLabel) {
        attributes['aria-label'] = ariaLabel;
    }

    if (disabled) {
        // TODO test
        attributes.disabled = '';
    }

    return element('button', label, attributes);
}
