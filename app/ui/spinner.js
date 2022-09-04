// @ts-check

import { div } from './block.js';
import { paragraph } from './typography.js';

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a loading indicator as an HTML string.
 *
 * @param {string} [label]
 *
 * @returns {string}
 */
export const spinner = (label = 'Mumbling incantations...') => div(
    paragraph(label),
    {
        'data-spinner': '',
    }
);
