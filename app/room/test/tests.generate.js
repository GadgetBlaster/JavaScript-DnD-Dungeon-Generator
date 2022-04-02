// @ts-check

import {
    // Config
    testRoomRandomizations as roomRandomizations,

    // Private Functions
    testApplyRoomRandomization as applyRoomRandomization,
    testRollRoomType           as rollRoomType,
    testRollUniformity         as rollUniformity,

    // Public Functions
    generateRooms,
} from '../generate.js';

import { conditions } from '../../attribute/condition.js';
import { furnitureQuantities } from '../../item/furnishing.js';
import { quantities } from '../../attribute/quantity.js';
import { rarities } from '../../attribute/rarity.js';
import { roomTypes } from '../room.js';
import { sizes } from '../../attribute/size.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('applyRoomRandomization()', () => {
        describe('given a `KnobSettings` object', () => {
            it('should return a `RoomConfig` object', () => {
                const roomConfig = applyRoomRandomization({
                    itemCondition        : 'random',
                    itemQuantity         : 'random',
                    itemRarity           : 'random',
                    roomCondition        : 'random',
                    roomFurnitureQuantity: 'random',
                    roomSize             : 'random',
                    roomType             : 'random',
                }, roomRandomizations);

                assert(roomConfig).isObject();

                assert([ ...conditions, 'random' ].includes(roomConfig.itemCondition)).isTrue();
                assert(conditions.includes(roomConfig.roomCondition)).isTrue();
                assert(furnitureQuantities.includes(roomConfig.roomFurnitureQuantity)).isTrue();
                assert(quantities.includes(roomConfig.itemQuantity)).isTrue();
                assert([ ...rarities, 'random' ].includes(roomConfig.itemRarity)).isTrue();
                assert(roomTypes.includes(roomConfig.roomType)).isTrue();
                assert(sizes.includes(roomConfig.roomSize)).isTrue();
            });

            describe('given a room type of "hallway" and an item quantity of `quantity.numerous`', () => {
                it('should limit the item quantity to `quantity.several`', () => {
                    const roomConfig = applyRoomRandomization({
                        itemQuantity: 'numerous',
                        roomType    : 'hallway',
                    }, roomRandomizations);

                    assert(roomConfig.itemQuantity).equals('several');
                });
            });
        });
    });

    describe('rollRoomType()', () => {
        describe('given a room type other than "random"', () => {
            it('should return it', () => {
                assert(rollRoomType('smithy')).equals('smithy');
            });
        });

        describe('given a room type of `random`', () => {
            it('should return a random room type', () => {
                assert(roomTypes.includes(rollRoomType('random'))).isTrue();
            });
        });
    });

    describe('rollUniformity()', () => {
        const fakeProbability = { roll: () => 'fake result', description: 'fake' };

        describe('given a uniformity condition of 100%', () => {
            it('should call roll() on the probability object', () => {
                const result = rollUniformity(100, fakeProbability);
                assert(result).equals('fake result');
            });
        });

        describe('given a uniformity condition of 0%', () => {
            it('should return undefined', () => {
                assert(rollUniformity(0, fakeProbability)).isUndefined();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateRooms()', () => {
        const config = {
            itemCondition        : 'average',
            itemQuantity         : 'zero',
            itemRarity           : 'exotic',
            itemType             : 'treasure',
            roomCondition        : 'average',
            roomCount            : 1,
            roomSize             : 'medium',
            roomType             : 'room',
            roomFurnitureQuantity: 'none',
        };

        describe('required configs', () => {
            [
                'roomCondition',
                'roomCount',
                'roomSize',
                'roomType',
            ].forEach((requiredConfig) => {
                describe(`given no \`${requiredConfig}\``, () => {
                    const incompleteConfig = { ...config };
                    delete incompleteConfig[requiredConfig];

                    it('should throw', () => {
                        // @ts-expect-error
                        assert(() => generateRooms(incompleteConfig))
                            .throws(`${requiredConfig} is required in generateRooms()`);
                    });
                });
            });

            describe('given a `roomCount` of 2', () => {
                it('should return an array with 2 `Room`s', () => {
                    const rooms = generateRooms({
                        ...config,
                        roomCount: 2,
                    });

                    assert(rooms).isArray();
                    assert(rooms.length).equals(2);

                    rooms && rooms.forEach((roomConfig) => {
                        assert(roomConfig.settings).isObject();
                        assert(roomConfig.items).isArray();
                    });
                });
            });

            describe('given a `knobs.itemQuantity` of "couple"', () => {
                it('should return an array of `Room` objects with two items', () => {
                    const rooms = generateRooms({
                        ...config,
                        itemQuantity: 'couple',
                    }).pop();

                    assert(rooms.items[0]).stringIncludes('Items (2)');
                });

                describe('given a `roomFurnitureQuantity` of `minimum`', () => {
                    it('should return an array of `Room` objects with three items', () => {
                        const rooms = generateRooms({
                            ...config,
                            itemQuantity         : 'couple',
                            roomFurnitureQuantity: 'minimum',
                        }).pop();

                        assert(rooms.items[0]).stringIncludes('Items (3)');
                    });
                });
            });
        });
    });
};

