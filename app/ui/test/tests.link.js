// @ts-check

import { parseHtml } from '../../utility/element.js';
import { link } from '../link.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('link()', () => {
        const body    = parseHtml(link('Home'));
        const element = body.children.item(0);

        it('returns an single element', () => {
            assert(body.children.length).equals(1);
        });

        it('returns an HTML anchor element', () => {
            assert(element).isElementTag('a');
        });

        it('contains the given label', () => {
            assert(element).hasTextContent('Home');
        });

        describe('given no href', () => {
            it('should not contain an href', () => {
                assert(link('Home')).stringExcludes('href');
            });
        });

        describe('given an href', () => {
            it('has the given href attribute', () => {
                const html = link('Home', 'https://www.mysticwaffle.com');

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({ href: 'https://www.mysticwaffle.com' });
            });
        });

        describe('given attributes', () => {
            it('has the given attributes', () => {
                const html = link('Home', '/', {
                    'data-active': true,
                    'id': 'home',
                });

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({ 'data-active': 'true', id: 'home' });
            });
        });
    });

};
