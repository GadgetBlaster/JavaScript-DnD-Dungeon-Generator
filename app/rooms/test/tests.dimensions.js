// @ts-check

import {
    testHallLengthMin as hallLengthMin,
    testHallWidthMax  as hallWidthMax,
    testHallWidthMin  as hallWidthMin,
    customDimensions,
    dimensionRanges,
    roomTypeSizes,
} from '../dimensions.js';

import size, { list as sizes } from '../../attributes/size.js';
import { list as roomTypes } from '../type.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('`dimensionRanges`', () => {
        it('should have an entry for each size', () => {
            assert(Object.keys(dimensionRanges)).equalsArray(sizes);
        });

        describe('each value in `dimensionRanges`', () => {
            Object.values(dimensionRanges).forEach((dimensions) => {
                it('should be an array of two numbers', () => {
                    assert(dimensions.length).equals(2);
                    assert(dimensions[0]).isNumber();
                    assert(dimensions[1]).isNumber();
                });

                // TODO assert min <= max
            });
        });
    });

    describe('`customDimensions`', () => {
        describe('hallway()', () => {
            describe('given a room size of `size.massive`', () => {
                describe('given a falsy `isHorizontal` flag', () => {
                    const roomDimensions = customDimensions.hallway(size.massive, { isHorizontal: false });

                    it('should return an object containing `roomWidth` and `roomHeight`', () => {
                        assert(roomDimensions).isObject();
                        assert(roomDimensions.roomWidth).isNumber();
                        assert(roomDimensions.roomHeight).isNumber();
                    });

                    it('should not have a height less than `hallLengthMin`', () => {
                        assert(roomDimensions.roomHeight >= hallLengthMin).isTrue();
                    });

                    it('should not have a height greater than the room\'s max dimension', () => {
                        assert(roomDimensions.roomHeight <= dimensionRanges.massive[1]).isTrue();
                    });

                    it('should not have a width greater than `hallWidthMax`', () => {
                        assert(roomDimensions.roomWidth <= hallWidthMax).isTrue();
                    });

                    it('should not have a width less than `hallWidthMin`', () => {
                        assert(roomDimensions.roomWidth >= hallWidthMin).isTrue();
                    });

                    it('width should be less than height', () => {
                        assert(roomDimensions.roomWidth < roomDimensions.roomHeight).isTrue();
                    });
                });

                describe('given a truthy `isHorizontal` flag', () => {
                    const roomDimensions = customDimensions.hallway(size.massive, { isHorizontal: true  });

                    it('should return an object containing `roomWidth` and `roomHeight`', () => {
                        assert(roomDimensions).isObject();
                        assert(roomDimensions.roomWidth).isNumber();
                        assert(roomDimensions.roomHeight).isNumber();
                    });

                    it('should not have a width less than `hallLengthMin`', () => {
                        assert(roomDimensions.roomWidth >= hallLengthMin).isTrue();
                    });

                    it('should not have a width greater than the room\'s max dimension', () => {
                        assert(roomDimensions.roomWidth <= dimensionRanges.massive[1]).isTrue();
                    });

                    it('should not have a height greater than `hallWidthMax`', () => {
                        assert(roomDimensions.roomHeight <= hallWidthMax).isTrue();
                    });

                    it('should not have a height less than `hallWidthMin`', () => {
                        assert(roomDimensions.roomHeight >= hallWidthMin).isTrue();
                    });

                    it('height should be less than width', () => {
                        assert(roomDimensions.roomHeight < roomDimensions.roomWidth).isTrue();
                    });
                });
            });
        });
    });

    describe('`roomTypeSizes`', () => {
        it('should hae an entry for room type', () => {
            assert(Object.keys(roomTypeSizes)).equalsArray(roomTypes);
        });

        describe('each entry in `roomTypeSizes`', () => {
            Object.entries(roomTypeSizes).forEach(([ room, allowedSizes ]) => {
                describe(`entry with key \`${room}\``, () => {
                    it('should be an array', () => {
                        assert(allowedSizes).isArray();
                    });

                    it('should contain only valid sizes', () => {
                        let invalidSizes = allowedSizes.find((roomSize) => {
                            !sizes.includes(roomSize);
                        });

                        assert(invalidSizes).isUndefined();
                    });
                });
            });
        });
    });
};
