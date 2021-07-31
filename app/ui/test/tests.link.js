// @ts-check

import { link } from '../link.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('link()', () => {
        it('should return an html anchor element string', () => {
            assert(link('')).isElementTag('a');
        });

        describe('given a label', () => {
            it('should contain the label', () => {
                assert(link('Home')).stringIncludes('Home');
            });
        });

        describe('given an href', () => {
            it('should contain the href', () => {
                assert(link('Home', 'https://www.mysticwaffle.com')).stringIncludes('href="https://www.mysticwaffle.com"');
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
