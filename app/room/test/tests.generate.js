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

/** @typedef {import('../../controller/knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../../controller/knobs.js').ItemConfigFields} ItemConfigFields */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('applyRoomRandomization()', () => {

        /** @type {ItemConfig} */
        const itemConfig = {
            itemCondition        : 'random',
            itemQuantity         : 'random',
            itemRarity           : 'random',
            itemType             : 'random',
        };

        /** @type {RoomConfig} */
        const roomConfig = {
            roomCondition        : 'random',
            roomCount            : 1,
            roomFurnitureQuantity: 'random',
            roomSize             : 'random',
            roomType             : 'random',
        };

        /** @type {DungeonConfig} */
        const dungeonConfig = {
            dungeonName       : '',
            dungeonComplexity : 12,
            dungeonConnections: 13,
            dungeonMaps       : 1,
            dungeonTraps      : 2,
        };

        Object.entries({
            RoomConfig   : { items: itemConfig, rooms: roomConfig },
            DungeonConfig: { items: itemConfig, rooms: roomConfig, maps: dungeonConfig },
        }).forEach(([ typeName, config ]) => {
            describe(`given a \`${typeName}\` object with "random" values`, () => {
                it('returns randomized item and room configs', () => {
                    const {
                        randomizedItemConfig,
                        randomizedRoomConfig,
                    } = applyRoomRandomization(config, {
                        isRandomItemConditionUniform: true,
                        isRandomItemRarityUniform: true,
                    });

                    assert(randomizedRoomConfig).isObject();

                    assert(randomizedItemConfig.itemCondition).isInArray(conditions);
                    assert(randomizedItemConfig.itemQuantity).isInArray(quantities);
                    assert(randomizedItemConfig.itemRarity).isInArray(rarities);
                    assert(randomizedItemConfig.itemType).equals('random'); // Not randomized

                    assert(randomizedRoomConfig.itemQuantity).isInArray(quantities);
                    assert(randomizedRoomConfig.roomCondition).isInArray(conditions);
                    assert(randomizedRoomConfig.roomFurnitureQuantity).isInArray(furnitureQuantities);
                    assert(randomizedRoomConfig.roomSize).isInArray(sizes);
                    assert(randomizedRoomConfig.roomType).isInArray(roomTypes);
                });
            });
        });

        Object.entries({
            roomCondition: 'exquisite',
            roomFurnitureQuantity: 'furnished',
            roomSize: 'small',
            roomType: 'armory',
        }).forEach(([ field, value ]) => {
            describe(`given a specific \`${field}\` value of "${value}"`, () => {
                it('returns the value unmodified', () => {
                    const { randomizedRoomConfig } = applyRoomRandomization({
                        rooms: {
                            ...roomConfig,
                            [field]: value,
                        },
                        items: itemConfig,
                    });

                    assert(randomizedRoomConfig[field]).equals(value);
                });
            });
        });

        Object.entries({
            itemCondition: 'decaying',
            itemQuantity : 'abundant',
            itemRarity   : 'rare',
        }).forEach(([ field, value ]) => {
            describe(`given a specific \`${field}\` value of "${value}"`, () => {
                it('returns the value unmodified', () => {
                    const { randomizedItemConfig } = applyRoomRandomization({
                        rooms: roomConfig,
                        items: {
                            ...itemConfig,
                            [field]: value,
                        },
                    });

                    assert(randomizedItemConfig[field]).equals(value);
                });
            });
        });

        describe('given an item condition of "random"', () => {
            describe('when `isRandomItemConditionUniform` is false', () => {
                it('returns an item condition of "random"', () => {
                    const { randomizedItemConfig } = applyRoomRandomization({
                        rooms: roomConfig,
                        items: itemConfig,
                    });

                    assert(randomizedItemConfig.itemCondition).equals('random');
                });
            });

            describe('when `isRandomItemConditionUniform` is true', () => {
                it('returns a randomized item condition', () => {
                    const { randomizedItemConfig } = applyRoomRandomization({
                        rooms: roomConfig,
                        items: itemConfig,
                    }, {
                        isRandomItemConditionUniform: true,
                    });

                    assert(randomizedItemConfig.itemCondition).isInArray(conditions);
                });
            });
        });

        describe('given an item rarity of "random"', () => {
            describe('when `isRandomItemRarityUniform` is falsy', () => {
                it('returns an undefined item rarity', () => {
                    const { randomizedItemConfig } = applyRoomRandomization({
                        rooms: roomConfig,
                        items: itemConfig,
                    });

                    assert(randomizedItemConfig.itemRarity).equals('random');
                });
            });

            describe('when `isRandomItemRarityUniform` is true', () => {
                it('returns a randomized item rarity', () => {
                    const { randomizedItemConfig } = applyRoomRandomization({
                        rooms: roomConfig,
                        items: itemConfig,
                    }, {
                        isRandomItemRarityUniform: true,
                    });

                    assert(randomizedItemConfig.itemRarity).isInArray(rarities);
                });
            });
        });

        describe('given a room type of "hallway" and an item quantity of "numerous"', () => {
            it('limits the item quantity to "several"', () => {
                const { randomizedItemConfig } = applyRoomRandomization({
                    rooms: {
                        ...roomConfig,
                        roomType: 'hallway',
                    },
                    items: {
                        ...itemConfig,
                        itemQuantity: 'numerous',
                    },
                });

                assert(randomizedItemConfig.itemQuantity).equals('several');
            });
        });
    });

    describe('rollRoomSize()', () => {
        roomTypes.forEach((roomType) => {
            describe(`give a room type of "${roomType}"`, () => {
                it('returns a size appropriate for the room type', () => {
                    assert(rollRoomSize(roomType)).isInArray(roomTypeSizes[roomType]);
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
                assert(rollRoomType('random')).isInArray(roomTypes);
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateRooms()', () => {
        /** @type {ItemConfig} */
        const itemConfig = {
            itemCondition: 'average',
            itemQuantity : 'zero',
            itemRarity   : 'exotic',
            itemType     : 'treasure',
        };

        /** @type {RoomConfig} */
        const roomConfig = {
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
                    const incompleteRoomConfig = { ...roomConfig };
                    delete incompleteRoomConfig[requiredConfig];

                    it('should throw', () => {
                        assert(() => generateRooms({ rooms: incompleteRoomConfig, items: itemConfig }))
                            .throws(`${requiredConfig} is required in generateRooms()`);
                    });
                });
            });

            describe('given a `roomCount` of 2', () => {
                it('returns an array with 2 room objects', () => {
                    const rooms = generateRooms({
                        rooms: {
                            ...roomConfig,
                            roomCount: 2,
                        },
                        items: itemConfig,
                    });

                    assert(rooms).isArray();
                    assert(rooms.length).equals(2);

                    rooms.forEach((room) => {
                        assert(room.config).isObject();
                        assert(room.itemSet).isObject();
                    });
                });
            });

            describe('given a `itemQuantity` of "couple"', () => {
                it('returns an array of room objects containing two items', () => {
                    const room = generateRooms({
                        rooms: roomConfig,
                        items: {
                            ...itemConfig,
                            itemQuantity: 'couple',
                        },
                    }).pop();

                    assert(room).isObject();

                    const itemCount = room?.itemSet?.items.reduce((total, { count }) => total + count, 0) || 0;
                    const containerCount = room?.itemSet?.containers.reduce((total, { count }) => total + count, 0) || 0;

                    assert(itemCount + containerCount).equals(2);
                });

                describe('given a roomFurnitureQuantity of "minimum"', () => {
                    it('returns an array of room objects with three items', () => {
                        const room = generateRooms({
                            rooms: {
                                ...roomConfig,
                                roomFurnitureQuantity: 'minimum',
                            },
                            items: {
                                ...itemConfig,
                                itemQuantity         : 'couple',
                            },
                        }).pop();

                        const itemCount = room?.itemSet?.items.reduce((total, { count }) => total + count, 0) || 0;

                        const {
                            containerCount,
                            containerContentCount,
                        } = room?.itemSet?.containers.reduce((totals, { count, contents }) => {
                            totals.containerCount = totals.containerCount + count;

                            totals.containerContentCount = totals.containerContentCount +
                                (contents?.reduce((total, { count: contentsCount }) => total + contentsCount, 0) || 0);

                            return totals;
                        }, { containerCount: 0, containerContentCount: 0 })
                            || { containerCount: 0, containerContentCount: 0 };

                        assert(itemCount + containerCount + containerContentCount).equals(3);
                    });
                });
            });
        });
    });
};

