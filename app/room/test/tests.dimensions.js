// @ts-check

import {
    // Config
    customDimensions,
    roomDimensionRanges,
    roomTypeSizes,
    testHallLengthMin as hallLengthMin,
    testHallWidthMax  as hallWidthMax,
    testHallWidthMin  as hallWidthMin,
    testRoomSizes     as roomSizes,
} from '../dimensions.js';

import { roomTypes } from '../room.js';
import { sizes } from '../../attribute/size.js';

/** @typedef {import('../../attribute/size.js').Size} Size */
/** @typedef {import('../room.js').RoomType} RoomType */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('roomDimensionRanges', () => {
        it('has an entry for each size', () => {
            assert(Object.keys(roomDimensionRanges)).equalsArray(sizes);
        });

        Object.entries(roomDimensionRanges).forEach(([ size, dimensions ]) => {
            describe(size, () => {
                it('is keyed by a size', () => {
                    assert(size).isInArray(sizes);
                });

                it('has min and max number properties', () => {
                    assert(dimensions.min).isNumber();
                    assert(dimensions.max).isNumber();
                });

                it('min is less than or equal to max', () => {
                    assert(dimensions.min <= dimensions.max).isTrue();
                });
            });
        });
    });

    describe('roomSizes', () => {
        Object.entries(roomSizes).forEach(([ roomType, allowedSizes ]) => {
            describe(roomType, () => {
                it('is keyed by a room type', () => {
                    assert(roomType).isInArray(roomTypes);
                });

                it('contains an array of sizes', () => {
                    assert(allowedSizes.find((size) => !sizes.includes(size))).isUndefined();
                });
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
                        assert(roomDimensions.height <= roomDimensionRanges.massive.max).isTrue();
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
                        assert(roomDimensions.width <= roomDimensionRanges.massive.max).isTrue();
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
                    const invalidSizes = allowedSizes.find((roomSize) => !sizes.includes(roomSize));
                    assert(invalidSizes).isUndefined();
                });
            });
        });
    });
};
