// @ts-check

import {
    // Private Functions
    testGetItemDescription as getItemDescription,
} from '../formatter.js';

/** @typedef {import('../../item/generate').Item} Item */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getItemDescription()', () => {
        /** @type {Item} item */
        const item = {
            condition: 'average',
            count: 1,
            name: 'Goblin juice',
            rarity: 'abundant',
            size: 'medium',
            type: 'miscellaneous',
        };

        describe('given an item count of 1', () => {
            it('should return the item label', () => {
                assert(getItemDescription(item)).equals('Goblin juice');
            });
        });

        describe('given an item count larger than 1', () => {
            it('should return the item label with the count appended', () => {
                assert(getItemDescription({
                    ...item,
                    count: 12,
                })).equals('Goblin juice (12)');
            });
        });
    });
};
