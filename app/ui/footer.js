// @ts-check

import { link } from './link.js';
import { small, span } from './typography.js';
import { currentVersion } from '../pages/notes.js';

// -- Config --------------------------------------------------------

const mysticWaffleUrl    = 'https://www.mysticwaffle.com';
const commentsUrl        = mysticWaffleUrl + '/dnd-generator#comments';
const privacyUrl         = 'https://www.mysticwaffle.com/privacy-policy';

const copyright = `D&D Generator by ${link('Mystic Waffle', mysticWaffleUrl, { target: '_blank' })}`;

// -- Private Functions --------------------------------------------------------

/**
 * Returns a list of HTML items spaced by bullets.
 *
 * @param {string[]} items
 *
 * @returns {string}
 */
const spacedItems = (items) => items.join(span('&bull;', { 'data-spacing': 'x-small' }));

// -- Public Functions ---------------------------------------------------------

/**
 * Content and format for the application footer.
 *
 * @param {string} testSummary
 *
 * @returns {string}
 */
export const getFooter = (testSummary) =>
    small(spacedItems([ `Alpha ${currentVersion}` ]))
    + small(copyright)
    + small(spacedItems([
        link('Comments', commentsUrl, { target: '_blank' }),
        link('Release Notes', '', { 'data-action': 'navigate', href: '/release-notes' }),
        link('Privacy Policy', privacyUrl, { target: '_blank' }),
    ]));
