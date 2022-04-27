// @ts-check

import {
    // Config
    rarities,
    indicateRarity,
    probability,
} from '../rarity.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('rarities', () => {
        it('is an array of strings', () => {
            assert(rarities).isArray();

            rarities.forEach((rarity) => {
                assert(rarity).isString();
            });
        });
    });

    describe('indicateRarity', () => {
        it('is a set of rarity strings', () => {
            assert(indicateRarity).isSet();

            indicateRarity.forEach((rarity) => {
                assert(rarity).isInArray(rarities);
            });
        });
    });

    describe('probability', () => {
        it('is a probability object that rolls a rarity', () => {
            assert(probability.description).isString();
            assert(probability.roll()).isInArray(rarities);
        });
    });

};
