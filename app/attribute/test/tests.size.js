// @ts-check

import {
    // Config
    sizes,
} from '../size.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('sizes', () => {
        it('is an array of strings', () => {
            assert(sizes).isArray();

            sizes.forEach((size) => {
                assert(size).isString();
            });
        });
    });

};
