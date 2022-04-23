// @ts-check

import {
    // Config
    customDimensions,
    dimensionRanges,
    roomTypeSizes,
    testHallLengthMin as hallLengthMin,
    testHallWidthMax  as hallWidthMax,
    testHallWidthMin  as hallWidthMin,
} from '../dimensions.js';

import { roomTypes } from '../room.js';
import { sizes } from '../../attribute/size.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('dimensionRanges', () => {
        it('has an entry for each size', () => {
            assert(Object.keys(dimensionRanges)).equalsArray(sizes);
        });

        describe('each value', () => {
            Object.values(dimensionRanges).forEach((dimensions) => {
                it('is an array of two numbers', () => {
                    assert(dimensions.length).equals(2);
                    assert(dimensions[0]).isNumber();
                    assert(dimensions[1]).isNumber();
                });

                // TODO assert min <= max
            });
        });
    });

    describe('customDimensions', () => {
        describe('hallway()', () => {
            describe('given a room size of "massive"', () => {
                describe('given a falsy isHorizontal flag', () => {
                    const roomDimensions = customDimensions.hallway('massive', { isHorizontal: false });

                    it('returns a Dimensions object', () => {
                        assert(roomDimensions).isObject();
                        assert(roomDimensions.width).isNumber();
                        assert(roomDimensions.height).isNumber();
                    });

                    it('has a height greater than or equal to hallLengthMin', () => {
                        assert(roomDimensions.height >= hallLengthMin).isTrue();
                    });

                    it('has a height less than or equal to the room\'s max dimension', () => {
                        assert(roomDimensions.height <= dimensionRanges.massive[1]).isTrue();
                    });

                    it('has a width less than or equal to hallWidthMax', () => {
                        assert(roomDimensions.width <= hallWidthMax).isTrue();
                    });

                    it('has a width greater than or equal to hallWidthMin', () => {
                        assert(roomDimensions.width >= hallWidthMin).isTrue();
                    });

                    it('width is less than height', () => {
                        assert(roomDimensions.width < roomDimensions.height).isTrue();
                    });
                });

                describe('given a truthy isHorizontal flag', () => {
                    const roomDimensions = customDimensions.hallway('massive', { isHorizontal: true  });

                    it('returns a Dimensions object', () => {
                        assert(roomDimensions).isObject();
                        assert(roomDimensions.width).isNumber();
                        assert(roomDimensions.height).isNumber();
                    });

                    it('has a width greater than or equal to hallLengthMin', () => {
                        assert(roomDimensions.width >= hallLengthMin).isTrue();
                    });

                    it('has a width less than or equal to room\'s max dimension', () => {
                        assert(roomDimensions.width <= dimensionRanges.massive[1]).isTrue();
                    });

                    it('has a height less than or equal to hallWidthMax', () => {
                        assert(roomDimensions.height <= hallWidthMax).isTrue();
                    });

                    it('has a height great than or equal to hallWidthMin', () => {
                        assert(roomDimensions.height >= hallWidthMin).isTrue();
                    });

                    it('height is less than width', () => {
                        assert(roomDimensions.height < roomDimensions.width).isTrue();
                    });
                });
            });
        });
    });

    describe('roomTypeSizes', () => {
        it('has an entry for room type', () => {
            assert(Object.keys(roomTypeSizes)).equalsArray(roomTypes);
        });

        Object.entries(roomTypeSizes).forEach(([ room, allowedSizes ]) => {
            describe(`room size "${room}"`, () => {
                it('is an array', () => {
                    assert(allowedSizes).isArray();
                });

                it('contains only valid sizes', () => {
                    let invalidSizes = allowedSizes.find((roomSize) => {
                        !sizes.includes(roomSize);
                    });

                    assert(invalidSizes).isUndefined();
                });
            });
        });
    });
};
