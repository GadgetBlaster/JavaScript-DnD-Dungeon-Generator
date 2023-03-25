// @ts-check

import { parseHtml } from '../../utility/element.js';
import { getFooter } from '../footer.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('getFooter()', () => {
        const body = parseHtml(getFooter('Fake test summary'));

        it('returns valid HTML', () => {
            assert(Boolean(body)).isTrue();
        });

        it('contains the test summary', () => {
            assert(body.textContent).stringIncludes('Fake test summary');
        });

        it('contains attribution', () => {
            assert(body.textContent).stringIncludes('D&D Generator by Mystic Waffle');
        });

        it('contains footer links', () => {
            const expectLinks = [
                'Comments',
                'Mystic Waffle',
                'Privacy Policy',
                'Release Notes',
            ];

            body.querySelectorAll('a').forEach((link) => {
                assert(link.textContent).isInArray(expectLinks);
            });
        });
    });

};
