// @ts-check

import {
    // Private Functions
    testGetDescription as getDescription,

    // Public Functions
    getRoomVegetationDescription, // TODO
    vegetationType,
} from '../vegetation.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getDescription()', () => {
        vegetationType.forEach((roomVegetation) => {
            describe(`given a room vegetation of \`${roomVegetation}\``, () => {
                it('should return a string', () => {
                    assert(getDescription(roomVegetation, { variation: false }))
                        .isString();
                });
            });

            describe('variations', () => {
                it('should return a string', () => {
                    assert(getDescription(roomVegetation, { variation: true }))
                        .isString();
                });
            });
        });

        describe('given an invalid room vegetation', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => getDescription('bowling balls'))
                    .throws('Invalid vegetation type "bowling balls" in getDescription()');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getRoomVegetationDescription()', () => {
        // TODO inject probability before adding test coverage.
        /*
        describe('given a count of one', () => {
            it('should return a single vegetation description', () => {
                assert(getVegetationDescription({}, { count: 1 })).stringExcludes(',');
            });
        });

        describe('given a count of two', () => {
            it('should return two vegetation descriptions', () => {
                assert(getVegetationDescription({}, { count: 2 })).stringIncludes('and');
            });
        });

        describe('given a count of three', () => {
            it('should return three vegetation descriptions', () => {
                assert(getVegetationDescription({}, { count: 3 }))
                    .stringIncludes(', ')
                    .stringIncludes('and');
            });
        });
        */
    });
};
