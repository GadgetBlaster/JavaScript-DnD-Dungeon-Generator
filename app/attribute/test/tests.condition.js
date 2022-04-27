// @ts-check

import {
    // Config
    conditions,
    probability,
} from '../condition.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('conditions', () => {
        it('is an array of strings', () => {
            assert(conditions).isArray();

            conditions.forEach((condition) => {
                assert(condition).isString();
            });
        });
    });

    describe('probability', () => {
        it('is a probability object that rolls a condition', () => {
            assert(probability.description).isString();
            assert(probability.roll()).isInArray(conditions);
        });
    });

};
