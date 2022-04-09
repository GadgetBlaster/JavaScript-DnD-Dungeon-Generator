// @ts-check

import {
    getConditionDescription,
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
