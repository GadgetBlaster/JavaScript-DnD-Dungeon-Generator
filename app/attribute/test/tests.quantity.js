// @ts-check

import {
    // Config
    quantities,
    probability,
    quantityMinimum,
    quantityMaximum,

    // Public Functions
    getRange,
} from '../quantity.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('quantities', () => {
        it('is an array of strings', () => {
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

    describe('quantityMinimum', () => {
        it('is an object of numbers with an entry for eah quantity', () => {
            assert(quantityMinimum).isObject();
            assert(Object.keys(quantityMinimum)).equalsArray(quantities);
            Object.values(quantityMinimum).forEach((min) => {
                assert(min).isNumber();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getRange()', () => {
        describe('given an invalid quantity', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getRange('no bueno'))
                    .throws('Invalid quantity "no bueno" in getRange()');
            });
        });

        let minimums = Object.values(quantityMinimum);
        minimums.shift();

        let maximums = [ ...minimums, quantityMaximum ].map((max) => max - 1);

        quantities.forEach((quantity, i) => {
            describe(`given "${quantity}"`, () => {
                it('returns a range object', () => {
                    const range = getRange(quantity);

                    assert(range).isObject();
                    range && assert(range.min).equals(quantityMinimum[quantity]);
                    range && assert(range.max).equals(maximums[i]);
                });
            });
        });
    });

};
