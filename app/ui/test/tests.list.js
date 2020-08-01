
import { list } from '../list.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('list()', () => {
        describe('given no `items` param', () => {
            it('should throw', () => {
                assert(() => list()).throws('Items are required for list');
            });
        });

        describe('given an empty array', () => {
            it('should throw', () => {
                assert(() => list([])).throws('Items are required for list');
            });
        });

        describe('given a single list item', () => {
            const results = list([ 'Pompous Wizards' ]);

            it('should return a string', () => {
                assert(results).isString();
            });

            it('should return an unordered list html string', () => {
                assert(results).isHtmlTag('ul');
            });

            it('should include a single html list item string with the given content', () => {
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
