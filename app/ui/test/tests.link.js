// @ts-check

import { parseHtml } from '../../utility/element.js';
import { link } from '../link.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('link()', () => {
        const result  = link('Home');
        const element = parseHtml(result).querySelector('a');

        it('returns an html anchor element string', () => {
            assert(result).isElementTag('a');
        });

        it('contains the given label', () => {
            assert(element.textContent).equals('Home');
        });

        describe('given an href', () => {
            it('should contain the href', () => {
                let linkHtml = link('Home', 'https://www.mysticwaffle.com');
                assert(linkHtml).stringIncludes('href="https://www.mysticwaffle.com"');
            });
        });

        describe('given no href', () => {
            it('should not contain an href', () => {
                assert(link('Home')).stringExcludes('href');
            });
        });

        describe('given an `attrs` param', () => {
            it('should contain the content string', () => {
                assert(link('Home', '/', { 'data-active': true })).stringIncludes('data-active="true"');
            });
        });
    });

};
