// @ts-check

import { parseHtml } from '../../utility/element.js';
import { list } from '../list.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('list()', () => {
        describe('given no items', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => list()).throws('Items are required for lists');
            });
        });

        describe('given an empty array', () => {
            it('throws', () => {
                assert(() => list([])).throws('Items are required for lists');
            });
        });

        const body    = parseHtml(list([ 'Blasted!' ]));
        const element = body.children.item(0);

        it('returns an single element', () => {
            assert(body.children.length).equals(1);
        });

        it('returns an HTML unordered list element', () => {
            assert(element.tagName).equals('UL');
        });

        describe('given a single list item', () => {
            it('includes a single list item with the given content', () => {
                const html = list([ 'Pompous Wizards' ], { 'data-type': 'unknown' });
                const items = parseHtml(html).querySelectorAll('li');

                assert(items.length).equals(1);
                assert(items.item(0).textContent).equals('Pompous Wizards');
            });
        });

        describe('given attributes', () => {
            it('has the given attributes', () => {
                const html = list([ 'Pompous Wizards' ], {
                    'data-spells': 'many',
                    'data-type'  : 'unknown',
                });

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({
                        'data-spells': 'many',
                        'data-type'  : 'unknown',
                    });
            });
        });

        describe('given multiple list items', () => {
            it('contains each list item', () => {
                const html  = list([ 'Beavers', 'Gorillas', 'Guardians' ]);
                const items = parseHtml(html).querySelectorAll('li');

                assert(items.item(0).textContent).equals('Beavers');
                assert(items.item(1).textContent).equals('Gorillas');
                assert(items.item(2).textContent).equals('Guardians');
            });
        });
    });

};
