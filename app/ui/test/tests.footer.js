// @ts-check

import { parseHtml } from '../../utility/element.js';
import { getFooter } from '../footer.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('getFooter()', () => {
        const result = getFooter('Fake test summary');
        const body   = parseHtml(result);

        it('contains the test summary', () => {
            assert(body.textContent).stringIncludes('Fake test summary');
        });

        it('contains attribution', () => {
            assert(body.textContent).stringIncludes('D&D Generator by Mystic Waffle');
        });

        it('contains footer links', () => {
            const expectLinks = [
                'Mystic Waffle',
                'GitHub',
                'CC License',
                'Privacy Policy',
            ];

            body.querySelectorAll('a').forEach((link) => {
                assert(link.textContent).isInArray(expectLinks);
            });
        });
    });

};
