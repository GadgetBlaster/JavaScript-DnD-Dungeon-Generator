
import {
    getConditionDescription,
    getItemDescription,
    getRarityDescription,
} from '../description.js';
import condition from '../../attributes/condition.js';
import rarity from '../../attributes/rarity.js';

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('getItemDescription()', () => {
        describe('given an item count of 1', () => {
            it('should return the item label', () => {
                assert(getItemDescription({
                    label: 'Bubbling goblin juice',
                    count: 1,
                })).equals('Bubbling goblin juice');
            });
        });

        describe('given an item count larger than 1', () => {
            it('should return the item label with the count appended', () => {
                assert(getItemDescription({
                    label: 'Bubbling goblin juice',
                    count: 12,
                })).equals('Bubbling goblin juice (12)');
            });
        });
    });

    describe('getConditionDescription()', () => {
        describe('given an item condition of `condition.average`', () => {
            it('should return undefined', () => {
                assert(getConditionDescription(condition.average)).isFalse();
            });
        });

        describe('given an item condition other than `condition.average`', () => {
            it('should return a string containing the condition', () => {
                assert(getConditionDescription(condition.exquisite)).stringIncludes(condition.exquisite);
            });
        });
    });

    describe('getRarityDescription()', () => {
        describe('given an item rarity that should not be indicated', () => {
            it('should return undefined', () => {
                assert(getRarityDescription(rarity.average)).isFalse();
            });
        });

        describe('given an item rarity that should be indicated', () => {
            it('should return a string containing the rarity', () => {
                assert(getRarityDescription(rarity.rare)).stringIncludes(rarity.rare);
            });
        });
    });
};
