// @ts-check

import {
    // Config
    quantities,
    probability,
    quantityRanges,
} from '../quantity.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('quantities', () => {
        it('is an array of strings', () => {
            assert(quantities).isArray();

            quantities.forEach((quantity) => {
                assert(quantity).isString();
            });
        });
    });

    describe('probability', () => {
        it('is a probability object that rolls a condition', () => {
            assert(probability).isObject();
            assert(probability.description).isString();
            assert(probability.roll()).isInArray(quantities);
        });
    });

    describe('quantityRanges', () => {
        it('is an object of ranges with a key for each quantity', () => {
            assert(quantityRanges).isObject();

            assert(Object.keys(quantityRanges)).equalsArray(quantities);
            Object.values(quantityRanges).forEach(({ min, max }) => {
                assert(min).isNumber();
                assert(max).isNumber();
            });
        });
    });

};
