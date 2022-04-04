// @ts-check

import {
    // Private Functions
    testApplyRoomRandomization as applyRoomRandomization,
    testRollRoomSize           as rollRoomSize,
    testRollRoomType           as rollRoomType,

    // Public Functions
    generateRooms,
} from '../generate.js';

import { conditions } from '../../attribute/condition.js';
import { furnitureQuantities } from '../../item/furnishing.js';
import { quantities } from '../../attribute/quantity.js';
import { rarities } from '../../attribute/rarity.js';
import { roomTypes } from '../room.js';
import { roomTypeSizes } from '../dimensions.js';
import { sizes } from '../../attribute/size.js';

/** @typedef {import('../../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../../controller/knobs.js').ItemConfigFields} ItemConfigFields */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('applyRoomRandomization()', () => {
        /** @type {RoomConfig} */
        const roomConfig = {
            itemCondition        : 'random',
            itemQuantity         : 'random',
            itemRarity           : 'random',
            itemType             : 'random',
            roomCondition        : 'random',
            roomCount            : 1,
            roomFurnitureQuantity: 'random',
            roomSize             : 'random',
            roomType             : 'random',
        };

        /** @type {DungeonConfig} */
        const dungeonConfig = {
            ...roomConfig,
            dungeonComplexity : 12,
            dungeonConnections: 13,
            dungeonMaps       : 1,
            dungeonTraps      : 2,
        };

        Object.entries({ RoomConfig: roomConfig, DungeonConfig: dungeonConfig }).forEach(([ typeName, config ]) => {
            describe(`given a ${typeName} object with "random" values`, () => {
                it('returns randomized item and room configs', () => {
                    const randomizedRoomConfig = applyRoomRandomization(config, {
                        isRandomItemConditionUniform: true,
                        isRandomItemRarityUniform: true,
                    });

                    assert(randomizedRoomConfig).isObject();

                    // @ts-expect-error
                    assert(conditions.includes(randomizedRoomConfig.itemCondition)).isTrue();
                    // @ts-expect-error
                    assert(rarities.includes(randomizedRoomConfig.itemRarity)).isTrue();
                    assert(quantities.includes(randomizedRoomConfig.itemQuantity)).isTrue();
                    assert(conditions.includes(randomizedRoomConfig.roomCondition)).isTrue();
                    assert(furnitureQuantities.includes(randomizedRoomConfig.roomFurnitureQuantity)).isTrue();
                    assert(roomTypes.includes(randomizedRoomConfig.roomType)).isTrue();
                    assert(sizes.includes(randomizedRoomConfig.roomSize)).isTrue();
                });
            });
        });

        describe('given a specific room condition', () => {
            it('returns the room condition un-modified', () => {
                const randomizedRoomConfig = applyRoomRandomization({ ...roomConfig, roomFurnitureQuantity: 'furnished' });
                assert(randomizedRoomConfig.roomFurnitureQuantity).equals('furnished');
            });
        });

        describe('given a specific room furniture quantity', () => {
            it('returns the room furniture quantity un-modified', () => {
                const randomizedRoomConfig = applyRoomRandomization({ ...roomConfig, roomCondition: 'exquisite' });
                assert(randomizedRoomConfig.roomCondition).equals('exquisite');
            });
        });

        describe('given a specific room type', () => {
            it('returns the room type un-modified', () => {
                const randomizedRoomConfig = applyRoomRandomization({ ...roomConfig, roomType: 'armory' });
                assert(randomizedRoomConfig.roomType).equals('armory');
            });
        });

        describe('given a specific room size', () => {
            it('returns the room type un-modified', () => {
                const randomizedRoomConfig = applyRoomRandomization({ ...roomConfig, roomSize: 'small' });
                assert(randomizedRoomConfig.roomSize).equals('small');
            });
        });

        describe('given a specific item condition', () => {
            it('returns the item condition un-modified', () => {
                const randomizedItemConfig = applyRoomRandomization({ ...roomConfig, itemCondition: 'decaying' });
                assert(randomizedItemConfig.itemCondition).equals('decaying');
            });
        });

        describe('given an item condition of "random"', () => {
            describe('when `isRandomItemConditionUniform` is falsy', () => {
                it('returns "random"', () => {
                    const randomizedItemConfig = applyRoomRandomization({ ...roomConfig, itemCondition: 'random' });
                    assert(randomizedItemConfig.itemCondition).equals('random');
                });
            });

            describe('when `isRandomItemConditionUniform` is true', () => {
                it('returns a randomized item condition', () => {
                    const randomizedItemConfig = applyRoomRandomization({ ...roomConfig, itemCondition: 'random' }, {
                        isRandomItemConditionUniform: true,
                    });

                    // @ts-expect-error
                    assert(conditions.includes(randomizedItemConfig.itemCondition)).isTrue();
                });
            });
        });

        describe('given a specific item rarity', () => {
            it('returns the item rarity un-modified', () => {
                const randomizedItemConfig = applyRoomRandomization({ ...roomConfig, itemRarity: 'rare' });
                assert(randomizedItemConfig.itemRarity).equals('rare');
            });
        });

        describe('given an item rarity of "random"', () => {
            describe('when `isRandomItemRarityUniform` is falsy', () => {
                it('returns "random"', () => {
                    const randomizedItemConfig = applyRoomRandomization({ ...roomConfig, itemRarity: 'random' });
                    assert(randomizedItemConfig.itemRarity).equals('random');
                });
            });

            describe('when `isRandomItemRarityUniform` is true', () => {
                it('returns a randomized item rarity', () => {
                    const randomizedItemConfig = applyRoomRandomization({ ...roomConfig, itemRarity: 'random' }, {
                        isRandomItemRarityUniform: true,
                    });

                    // @ts-expect-error
                    assert(rarities.includes(randomizedItemConfig.itemRarity)).isTrue();
                });
            });
        });

        describe('given a room type of "hallway" and an item quantity of "numerous"', () => {
            it('limits the item quantity to "several"', () => {
                const randomizedItemConfig = applyRoomRandomization({
                    ...roomConfig,
                    roomType: 'hallway',
                    itemQuantity: 'numerous',
                });

                assert(randomizedItemConfig.itemQuantity).equals('several');
            });
        });
    });

    describe('rollRoomSize()', () => {
        roomTypes.forEach((roomType) => {
            describe(`give a room type of "${roomType}"`, () => {
                it('returns a size appropriate for the room type', () => {
                    assert(roomTypeSizes[roomType].includes(rollRoomSize(roomType))).isTrue();
                });
            });
        });
    });

    describe('rollRoomType()', () => {
        describe('given a room type other than "random"', () => {
            it('returns the room type', () => {
                assert(rollRoomType('smithy')).equals('smithy');
            });
        });

        describe('given a room type of "random"', () => {
            it('returns a random room type', () => {
                assert(roomTypes.includes(rollRoomType('random'))).isTrue();
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

