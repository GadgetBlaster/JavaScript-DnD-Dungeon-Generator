// @ts-check

import { list } from '../list.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('list()', () => {
        describe('given no `items` param', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => list()).throws('Items are required for lists');
            });
        });

        describe('given an empty array', () => {
            it('should throw', () => {
                assert(() => list([])).throws('Items are required for lists');
            });
        });

        describe('given a single list item', () => {
            const results = list([ 'Pompous Wizards' ]);

            it('should return an html unordered list element string', () => {
                assert(results).stringIncludes('<ul>')
                    .stringIncludes('</ul>');
            });

            it('should include a single html list item element string with the given content', () => {
                assert(results).stringIncludes('<li>Pompous Wizards</li>');
            });
        });

        describe('given a attributes object', () => {
            it('should include the attributes on the unordered list html string', () => {
                assert(list([ 'Gorzo' ], { 'data-type': 'unknown' })).stringIncludes('<ul data-type="unknown">');
            });
        });

        describe('given multiple list item', () => {
            const results = list([ 'Beavers', 'Gorillas', 'Guardians' ]);

            it('should include each item as an html list item string', () => {
                assert(results)
                    .stringIncludes('<li>Beavers</li>')
                    .stringIncludes('<li>Gorillas</li>')
                    .stringIncludes('<li>Guardians</li>');
            });
        });
    });
};
