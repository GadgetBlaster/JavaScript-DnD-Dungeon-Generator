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

        it('returns an unordered list html element string', () => {
            const body = parseHtml(list([ 'Blasted!' ]));
            assert(Boolean(body.querySelector('ul'))).isTrue();
        });

        describe('given a single list item', () => {
            const body = parseHtml(list([ 'Pompous Wizards' ], { 'data-type': 'unknown' }));

            it('includes a single list item with the given content', () => {
                const items = body.querySelectorAll('li');

                assert(items.length).equals(1);
                assert(items[0].textContent).equals('Pompous Wizards');
            });

            describe('given attributes', () => {
                it('has the given attributes', () => {
                    assert(body.querySelector('ul')).hasAttributes({ 'data-type': 'unknown' });
                });
            });
        });

        describe('given multiple list items', () => {
            it('contains each list item', () => {
                const body  = parseHtml(list([ 'Beavers', 'Gorillas', 'Guardians' ]));
                const items = body.querySelectorAll('li');

                assert(items[0].textContent).equals('Beavers');
                assert(items[1].textContent).equals('Gorillas');
                assert(items[2].textContent).equals('Guardians');
            });
        });
    });

};
