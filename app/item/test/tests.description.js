// @ts-check

import {
    getConditionDescription,
    getItemDescription,
    getRarityDescription,
} from '../description.js';

/** @typedef {import('../generate.js').Item} Item */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('getConditionDescription()', () => {
        describe('given an item condition of "average"', () => {
            it('should return undefined', () => {
                assert(getConditionDescription('average')).isFalse();
            });
        });

        describe('given an item condition other than "average"', () => {
            it('should return a string containing the condition', () => {
                assert(getConditionDescription('exquisite')).stringIncludes('exquisite');
            });
        });
    });

    describe('getItemDescription()', () => {
        /** @type {Item} item */
        const item = {
            condition: 'average',
            count: 1,
            label: 'Bubbling goblin juice',
            name: 'Goblin juice',
            rarity: 'abundant',
            size: 'medium',
            type: 'miscellaneous',
        };

        describe('given an item count of 1', () => {
            it('should return the item label', () => {
                assert(getItemDescription(item)).equals('Bubbling goblin juice');
            });
        });

        describe('given an item count larger than 1', () => {
            it('should return the item label with the count appended', () => {
                assert(getItemDescription({
                    ...item,
                    count: 12,
                })).equals('Bubbling goblin juice (12)');
            });
        });
    });

    describe('getRarityDescription()', () => {
        describe('given an item rarity that should not be indicated', () => {
            it('should return undefined', () => {
                assert(getRarityDescription('average')).isFalse();
            });
        });

        describe('given an item rarity that should be indicated', () => {
            it('should return a string containing the rarity', () => {
                assert(getRarityDescription('rare')).stringIncludes('rare');
            });
        });
    });
};
