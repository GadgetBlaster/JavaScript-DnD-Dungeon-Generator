// @ts-check

import { small, span } from './typography.js';
import { link } from './link.js';

const ccUrl           = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
const mysticWaffleUrl = 'https://www.mysticwaffle.com';
const privacyUrl      = 'https://www.mysticwaffle.com/privacy-policy';
const repoUrl         = 'https://github.com/GadgetBlaster/JavaScript-DnD-Dungeon-Generator';

/**
 * Renders the application footer.
 *
 * @param {string} testSummary
 *
 * @returns {string}
 */
export function getFooter(testSummary) {
    return small(testSummary)
        + small(`D&D Generator by ${link('Mystic Waffle', mysticWaffleUrl, { target: '_blank' })}`)
        + small(
            [
                link('GitHub', repoUrl, { target: '_blank' }),
                link('CC License', ccUrl, { target: '_blank' }),
                link('Privacy Policy', privacyUrl, { target: '_blank' }),
            ].join(span('&bull;', { 'data-spacing': 'x-small' }))
        );
}
