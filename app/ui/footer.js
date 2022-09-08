// @ts-check

import { link } from './link.js';
import { small, span } from './typography.js';
import { currentVersion } from '../pages/notes.js';

// -- Config --------------------------------------------------------

const creativeCommonsUrl = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
const mysticWaffleUrl    = 'https://www.mysticwaffle.com';
const privacyUrl         = 'https://www.mysticwaffle.com/privacy-policy';
const gitHubUrl          = 'https://github.com/GadgetBlaster/JavaScript-DnD-Dungeon-Generator';

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
    small(spacedItems([ `Alpha ${currentVersion}`, testSummary ]))
    + small(copyright)
    + small(spacedItems([
        link('Release Notes', '', { 'data-action': 'navigate', href: '/release-notes' }),
        link('GitHub', gitHubUrl, { target: '_blank' }),
        link('License', creativeCommonsUrl, { target: '_blank' }),
        link('Privacy Policy', privacyUrl, { target: '_blank' }),
    ]));
