
import size, { list as sizes } from '../../attributes/size.js';
import { list as roomTypes } from '../type.js';
import {
    _hallLengthMin,
    _hallWidthMax,
    _hallWidthMin,
    customDimensions,
    dimensionRanges,
    roomTypeSizes,
} from '../dimensions.js';

/**
 * @param {import('../../unit/unit.js').Utility}
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
            });
        });
    });

    describe('`customDimensions`', () => {
        describe('hallway()', () => {
            describe('given a room size of `size.massive`', () => {
                describe('given a falsy `isHorizontal` flag', () => {
                    const roomDimensions = customDimensions.hallway(size.massive, { isHorizontal: false  });

                    it('should return an object containing `roomWidth` and `roomHeight`', () => {
                        assert(roomDimensions).isObject();
                        assert(roomDimensions.roomWidth).isNumber();
                        assert(roomDimensions.roomHeight).isNumber();
                    });

                    it('should not have a height less than `_hallLengthMin`', () => {
                        assert(roomDimensions.roomHeight >= _hallLengthMin).isTrue();
                    });

                    it('should not have a height greater than the room\'s max dimension', () => {
                        assert(roomDimensions.roomHeight <= dimensionRanges.massive[1]).isTrue();
                    });

                    it('should not have a width greater than `_hallWidthMax`', () => {
                        assert(roomDimensions.roomWidth <= _hallWidthMax).isTrue();
                    });

                    it('should not have a width less than `_hallWidthMin`', () => {
                        assert(roomDimensions.roomWidth >= _hallWidthMin).isTrue();
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

                    it('should not have a width less than `_hallLengthMin`', () => {
                        assert(roomDimensions.roomWidth >= _hallLengthMin).isTrue();
                    });

                    it('should not have a width greater than the room\'s max dimension', () => {
                        assert(roomDimensions.roomWidth <= dimensionRanges.massive[1]).isTrue();
                    });

                    it('should not have a height greater than `_hallWidthMax`', () => {
                        assert(roomDimensions.roomHeight <= _hallWidthMax).isTrue();
                    });

                    it('should not have a height less than `_hallWidthMin`', () => {
                        assert(roomDimensions.roomHeight >= _hallWidthMin).isTrue();
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
