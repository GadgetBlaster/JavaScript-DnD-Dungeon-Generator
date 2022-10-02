// @ts-check

import {
    // Private Functions
    testGetContentDescription        as getContentDescription,
    testGetContentRarityDetail       as getContentRarityDetail,
    testGetDescriptionIntro          as getDescriptionIntro,
    testGetDoorwayDescription        as getDoorwayDescription,
    testGetFurnitureDetail           as getFurnitureDetail,
    testGetItemConditionDescription  as getItemConditionDescription,
    testGetKeyDetail                 as getKeyDetail,
    testGetRoomDimensionsDescription as getRoomDimensionsDescription,
    testGetRoomDoorwayDescription    as getRoomDoorwayDescription,
    testSortDoorways                 as sortDoorways,

    // Public Functions
    getDoorwayDescriptionList,
    getKeyDescription,
    getMapDescription,
    getRoomDescription,
    getRoomLabel,
} from '../description.js';

import { appendRoomTypes } from '../room.js';
import { cellFeet } from '../../dungeon/grid.js';
import { conditions } from '../../attribute/condition.js';
import { furnitureQuantities } from '../../item/furnishing.js';
import { indicateRarity, rarities } from '../../attribute/rarity.js';
import { lockable, appendDoorway } from '../door.js';
import { outside } from '../../dungeon/map.js';
import { quantities } from '../../attribute/quantity.js';

/** @typedef {import('../../controller/knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../../dungeon/map.js').Direction} Direction */
/** @typedef {import('../../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../../dungeon/map.js').Door} Door */
/** @typedef {import('../door.js').DoorKey} DoorKey */
/** @typedef {import('../door.js').DoorType} DoorType */
/** @typedef {import('../generate').RandomizedRoomConfig} RandomizedRoomConfig */

/** @type {RandomizedRoomConfig} */
const randomizedRoomConfig = {
    itemQuantity         : 'one',
    roomCondition        : 'average',
    roomFurnitureQuantity: 'none',
    roomSize             : 'medium',
    roomType             : 'room',
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getRoomContentDescription()', () => {
        describe('given no `roomType`', () => {
            it('throws', () => {
                const missingRoomType = { ...randomizedRoomConfig };

                // @ts-expect-error
                delete missingRoomType.roomType;

                assert(() => getContentDescription(missingRoomType))
                    .throws('roomType is required in getRoomContentDescription()');
            });
        });

        describe('given no `itemQuantity`', () => {
            it('throws', () => {
                const missingItemQuantity = { ...randomizedRoomConfig };

                // @ts-expect-error
                delete missingItemQuantity.itemQuantity;

                assert(() => getContentDescription(missingItemQuantity))
                    .throws('Invalid itemQuantity in getRoomContentDescription()');
            });
        });

        describe('given an `itemQuantity` of "zero"', () => {
            it('returns undefined', () => {
                assert(getContentDescription({ ...randomizedRoomConfig, itemQuantity: 'zero' }))
                    .isUndefined();
            });
        });

        describe('given an `itemQuantity` other than "zero"', () => {
            let positiveQuantities = quantities
                .filter((itemQuantity) => itemQuantity !== 'zero');

            positiveQuantities.forEach((itemQuantity) => {
                describe(`given an \`itemQuantity\` of "${itemQuantity}"`, () => {
                    it('contains the given room type', () => {
                        assert(getContentDescription({
                            ...randomizedRoomConfig,
                            roomType    : 'atrium',
                            itemQuantity: itemQuantity,
                        })).stringIncludes('atrium');
                    });

                    describe('given a `uniformItemRarity` of "rare"', () => {
                        it('contains the word "rare"', () => {
                            assert(getContentDescription({
                                ...randomizedRoomConfig,
                                uniformItemRarity: 'rare',
                                itemQuantity,
                            })).stringIncludes('rare');
                        });
                    });

                    describe('given a `roomFurnitureQuantity` of "none"', () => {
                        it('excludes the word "furniture" or "furnishings"', () => {
                            const noFurnishingConfig = {
                                ...randomizedRoomConfig,
                                itemQuantity: itemQuantity,
                            };

                            assert(getContentDescription(noFurnishingConfig))
                                .stringExcludes('furniture')
                                .stringExcludes('furnishings');
                        });
                    });

                    describe('given a `roomFurnitureQuantity` of "furnished"', () => {
                        it('contains the word "furniture"', () => {
                            assert(getContentDescription({
                                ...randomizedRoomConfig,
                                roomFurnitureQuantity: 'furnished',
                                itemQuantity  : itemQuantity,
                            })).stringIncludes('furniture');
                        });
                    });
                });
            });
        });
    });

    describe('getContentRarityDetail()', () => {
        describe('given a `rarity` of "random"', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getContentRarityDetail('random'))
                    .throws('rarity cannot be "random" in getContentRarityDetail()');
            });
        });

        describe('given a `rarity` that should not be indicated', () => {
            let rarityNotIndicated = /** @type {Rarity} */ (rarities.find((contentRarity) => !indicateRarity.has(contentRarity)));

            it('returns "ordinary"', () => {
                assert(rarityNotIndicated).isString();
                assert(getContentRarityDetail(rarityNotIndicated)).equals('ordinary');
            });
        });

        describe('given a `rarity` that should be indicated', () => {
            let rarityIndicated = [ ...indicateRarity ][0];

            it('returns the rarity', () => {
                assert(getContentRarityDetail(rarityIndicated)).equals(rarityIndicated);
            });
        });
    });

    describe('getDescriptionIntro()', () => {
        /** @type {RandomizedRoomConfig} */
        const roomConfig = {
            itemQuantity: 'one',
            roomType: 'room',
            roomSize: 'medium',
            roomCondition: 'average',
            roomFurnitureQuantity: 'none',
        };

        describe('given a `roomType` of "room"', () => {}); // TODO

        describe('given a `roomType` other than "room"', () => {
            it('returns a description including the room type', () => {
                assert(getDescriptionIntro({ ...randomizedRoomConfig, roomType: 'library' }))
                    .stringIncludes('library');
            });
        });

        describe('given a `roomSize`', () => {
            it('returns a description including the room size', () => {
                assert(getDescriptionIntro({ ...randomizedRoomConfig, roomSize: 'large' }))
                    .stringIncludes('large room');
            });
        });

        describe('given a `roomSize` of "medium"', () => {
            it('returns a description including "medium sized room"', () => {
                assert(getDescriptionIntro({ ...randomizedRoomConfig, roomSize: 'medium' }))
                    .stringIncludes('medium sized room');
            });

            describe('given a `roomType` other than "room"', () => {
                it('returns a description including "medium sized" and the room type', () => {
                    assert(getDescriptionIntro({
                        ...randomizedRoomConfig,
                        roomType: 'smithy',
                        roomSize: 'medium',
                    })).stringIncludes('medium sized smithy');
                });
            });
        });

        describe('given an `itemQuantity` of "zero"', () => {
            it('returns a description including "empty room"', () => {
                assert(getDescriptionIntro({ ...roomConfig, itemQuantity: 'zero' }))
                    .stringIncludes('empty room');
            });

            describe('given a `roomType` other than "room"', () => {
                it('returns a description including "empty" and the room type', () => {
                    assert(getDescriptionIntro({
                        ...randomizedRoomConfig,
                        itemQuantity: 'zero',
                        roomType    : 'study',
                    })).stringIncludes('empty study');
                });
            });

            describe('given a `roomSize`', () => {
                it('returns a description including the size and "empty room"', () => {
                    assert(getDescriptionIntro({
                        ...randomizedRoomConfig,
                        itemQuantity: 'zero',
                        roomSize    : 'massive',
                    })).stringIncludes('massive empty room');
                });
            });

            describe('given a `roomType` other than "room" and a room size', () => {
                it('returns a description including the size, "empty", and the room type', () => {
                    assert(getDescriptionIntro({
                        ...randomizedRoomConfig,
                        itemQuantity: 'zero',
                        roomSize    : 'large',
                        roomType    : 'treasury',
                    })).stringIncludes('large empty treasury');
                });
            });
        });

        describe('given a `roomCondition`', () => {
            describe('given a room condition of "average"', () => {
                it('excludes "condition" in the room description', () => {
                    assert(getDescriptionIntro({ ...randomizedRoomConfig, roomCondition: 'average' }))
                        .stringExcludes('condition');
                });
            });

            describe('given a `roomCondition` other than "average"', () => {
                it(`returns a description including the condition`, () => {
                    assert(getDescriptionIntro({ ...randomizedRoomConfig, roomCondition: 'busted' })).stringIncludes('busted');
                });
            });
        });
    });

    describe('getDoorwayDescription()', () => {
        /** @type {Door} */
        const door = {
            connect: {
                1: { direction: 'north', to: 2 },
                2: { direction: 'south', to: 1 },
            },
            locked: false,
            rectangle: { x: 1, y: 1, width: 1, height: 1 },
            type: 'archway',
        };

        const appendDoorwayType = [ ...appendDoorway ].pop();

        describe('when locked is true for a non-lockable door type', () => {
            it('throws', () => {
                assert(() => getDoorwayDescription({ ...door, locked: true }))
                    .throws(`Invalid locked setting for non-lockable door type "archway" in getDoorwayDescription()`);
            });
        });

        describe('given a size of 1', () => {
            it('excludes a size description', () => {
                assert(getDoorwayDescription(door))
                    .stringExcludes('double wide')
                    .stringExcludes('large')
                    .stringExcludes('massive');
            });
        });

        /** @type {Direction[]} */
        const verticalDirections = [ 'north', 'south' ];

        /** @type {Direction[]} */
        const horizontalDirections = [ 'east', 'west' ];

        verticalDirections.forEach((direction) => {
            const verticalDoor = {
                ...door,
                direction,
                rectangle: {
                    ...door.rectangle,
                    width: 2,
                },
            };

            describe(`given a direction of ${direction} and a width of 2`, () => {
                it('contains the string "wide"', () => {
                    assert(getDoorwayDescription(verticalDoor)).stringIncludes('wide');
                });

                describe('when the door type should have "doorway" appended', () => {
                    it('contains the string "double wide"', () => {
                        assert(getDoorwayDescription({
                            ...verticalDoor,
                            type: appendDoorwayType,
                        })).stringIncludes('double wide');
                    });
                });
            });

            describe('given a width of 3', () => {
                it('contains a the string "large"', () => {
                    assert(getDoorwayDescription({
                        ...verticalDoor,
                        rectangle: {
                            ...door.rectangle,
                            width: 3,
                        },
                    })).stringIncludes('large');
                });
            });

            describe('given a width larger than 3', () => {
                it('contains a the string "massive"', () => {
                    assert(getDoorwayDescription({
                        ...verticalDoor,
                        rectangle: {
                            ...door.rectangle,
                            width: 4,
                        },
                    })).stringIncludes('massive');
                });
            });
        });

        horizontalDirections.forEach((direction) => {
            const horizontalDoor = {
                ...door,
                direction,
                rectangle: {
                    ...door.rectangle,
                    height: 2,
                },
            };

            describe(`given a direction of ${direction} and a height of 2`, () => {
                it('contains the string "wide"', () => {
                    assert(getDoorwayDescription(horizontalDoor)).stringIncludes('wide');
                });

                describe('when the door type should have "doorway" appended', () => {
                    it('contains the string "double wide"', () => {
                        assert(getDoorwayDescription({
                            ...horizontalDoor,
                            type: appendDoorwayType,
                        })).stringIncludes('double wide');
                    });
                });
            });


            describe('given a height of 3', () => {
                it('contains a the string "large"', () => {
                    assert(getDoorwayDescription({
                        ...horizontalDoor,
                        rectangle: {
                            ...door.rectangle,
                            height: 3,
                        },
                    })).stringIncludes('large');
                });
            });

            describe('given a height larger than 3', () => {
                it('contains a the string "massive"', () => {
                    assert(getDoorwayDescription({
                        ...horizontalDoor,
                        rectangle: {
                            ...door.rectangle,
                            height: 4,
                        },
                    })).stringIncludes('massive');
                });
            });
        });

        describe('given a door type included in appendDoorway', () => {
            it('contains the string "doorway"', () => {
                assert(getDoorwayDescription({
                    ...door,
                    type: appendDoorwayType,
                })).stringIncludes('doorway');
            });
        });

        describe('given an unlocked door', () => {
            it('excludes the string "locked"', () => {
                assert(getDoorwayDescription(door))
                    .stringExcludes('locked');
            });
        });

        describe('given a locked door', () => {
            it('contains the string "locked"', () => {
                assert(getDoorwayDescription({
                    ...door,
                    locked: true,
                    type: [ ...lockable ].pop(),
                })).stringIncludes('locked');
            });
        });

    });

    describe('getFurnitureDetail()', () => {
        describe('given `none`', () => {
            it('returns an empty string', () => {
                assert(getFurnitureDetail('none')).equals('');
            });
        });

        describe('given a furniture quantity other than `none`', () => {
            let positiveFurnitureQuantities = furnitureQuantities
                .filter((quantity) => quantity !== 'none');

            positiveFurnitureQuantities.forEach((quantity) => {
                it('returns a string including "furniture" or "furnishings"', () => {
                    let detail = getFurnitureDetail(quantity);
                    let isOk = detail.includes('furniture') || detail.includes('furnishings');
                    assert(isOk).isTrue();
                });
            });
        });
    });

    // TODO fix config objects
    describe('getItemConditionDescription()', () => {
        describe('given no `itemQuantity`', () => {
            it('returns undefined', () => {
                const incompleteRandomizedRoomConfig = { ...randomizedRoomConfig };

                // @ts-expect-error
                delete incompleteRandomizedRoomConfig.itemQuantity;

                assert(() => getItemConditionDescription(incompleteRandomizedRoomConfig))
                    .throws('itemQuantity is required in getItemConditionDescription()');
            });
        });

        describe('given an `itemQuantity` of "zero"', () => {
            it('returns undefined', () => {
                assert(getItemConditionDescription({
                    ...randomizedRoomConfig,
                    itemQuantity: 'zero',
                })).isUndefined();
            });
        });

        describe('given a `uniformItemCondition` of "average"', () => {
            it('returns undefined', () => {
                assert(getItemConditionDescription({
                    ...randomizedRoomConfig,
                    uniformItemCondition: 'average',
                })).isUndefined();
            });
        });

        describe('given a `uniformItemCondition` other than "average"', () => {
            let nonAverageConditions = conditions
                .filter((itemCondition) => itemCondition !== 'average');

            nonAverageConditions.forEach((itemCondition) => {
                it('returns a string including the condition', () => {
                    assert(getItemConditionDescription({
                        ...randomizedRoomConfig,
                        uniformItemCondition: itemCondition,
                    })).stringIncludes(itemCondition);
                });
            });
        });
    });

    describe('getKeyDetail()', () => {
        describe('given a door type of `mechanical`', () => {
            it('contains the word "leaver"', () => {
                assert(getKeyDetail('mechanical')).stringIncludes('leaver');
            });
        });

        describe('given a lockable door type other than `mechanical`', () => {
            let lockableNonMechanicalDoorTypes = [ ...lockable ]
                .filter((type) => type !== 'mechanical');

            lockableNonMechanicalDoorTypes.forEach((type) => {
                describe(`door type \`${type}\``, () => {
                    it('includes the word "key"', () => {
                        assert(getKeyDetail(type)).stringIncludes('key');
                    });
                });
            });
        });

        describe('given an undefined door type', () => {
            it('includes the word "Key"', () => {
                // @ts-expect-error // TODO throws()
                assert(getKeyDetail()).stringIncludes('Key');
            });
        });
    });

    describe('getRoomDoorwayDescription()', () => {
        /** @type {Door} */
        const door = {
            connect: {
                1: { direction: 'south', to: 2 },
                2: { direction: 'north', to: 1 },
            },
            locked: false,
            rectangle: { x: 1, y: 1, width: 1, height: 1 },
            type: 'passageway',
        };

        describe('given no room number', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getRoomDoorwayDescription([ door ]))
                    .throws('roomNumber is required in getRoomDoorwayDescription()');
            });
        });

        describe('given a door which does not connect to the room number', () => {
            it('throws', () => {
                assert(() => getRoomDoorwayDescription([ door ], 3))
                    .throws('Invalid door connection for roomNumber in getRoomDoorwayDescription()');
            });
        });

        describe('given a single concealed door', () => {
            it('returns undefined', () => {
                assert(getRoomDoorwayDescription([ { ...door, type: 'concealed' } ], 1))
                    .isUndefined();
            });
        });

        describe('given a single door with type "secret"', () => {
            it('returns undefined', () => {
                assert(getRoomDoorwayDescription([ { ...door, type: 'secret' } ], 1))
                    .isUndefined();
            });
        });

        describe('given a single door config', () => {
            const desc = getRoomDoorwayDescription([ door ], 2);

            it('includes the door description', () => {
                assert(desc).stringIncludes(getDoorwayDescription(door));
            });

            it('includes the word "single"', () => {
                assert(desc).stringIncludes('single');
            });

            it('includes the door direction', () => {
                assert(desc).stringIncludes('north');
            });

            it('includes the door type', () => {
                assert(desc).stringIncludes('passageway');
            });

            it('capitalizes the sentence', () => {
                assert(desc.startsWith('A')).isTrue();
            });
        });

        describe('given a door object connected to the outside on the south wall', () => {
            /** @type {Door[]} */
            const doors = [{
                ...door,
                connect: {
                    4: { direction: 'south', to: outside },
                    5: { direction: 'north', to: 4       },
                },
            }];

            it('includes a description of the door to the outside', () => {
                assert(getRoomDoorwayDescription(doors, 4))
                    .stringIncludes('leads south out of the dungeon');
            });
        });

        describe('given two door configs', () => {
            /** @type {Door[]} */
            const doors = [
                {
                    ...door,
                    connect: {
                        1: { direction: 'south', to: 2 },
                        2: { direction: 'north', to: 1 },
                    },
                    type: 'archway',
                },
                {
                    ...door,
                    connect: {
                        1: { direction: 'east', to: 3 },
                        3: { direction: 'west', to: 1 },
                    },
                    type: 'passageway',
                },
            ];

            const desc = getRoomDoorwayDescription(doors, 1);

            it('joins the descriptions with "and" and contain no commas', () => {
                assert(desc)
                    .stringIncludes(' and ')
                    .stringExcludes(',');
            });

            it('includes both door types', () => {
                assert(desc)
                    .stringIncludes('archway')
                    .stringIncludes('passageway');
            });

            it('includes both directions leading out of the room', () => {
                assert(desc)
                    .stringIncludes('south')
                    .stringIncludes('east');
            });

            describe('when the first door is of type `archway`', () => {
                it('prefixes the doorway description type with "An"', () => {
                    assert(desc.startsWith('An')).isTrue();
                });
            });
        });

        describe('given three doors configs', () => {
            /** @type {Door[]} */
            const doors = [
                {
                    ...door,
                    connect: {
                        1: { direction: 'south', to: 2 },
                        2: { direction: 'north', to: 1 },
                    },
                    type: 'archway',
                },
                {
                    ...door,
                    connect: {
                        1: { direction: 'north', to: 3 },
                        3: { direction: 'south', to: 1 },
                    },
                    type: 'passageway',
                },
                {
                    ...door,
                    connect: {
                        1: { direction: 'east', to: 4 },
                        4: { direction: 'west', to: 1 },
                    },
                    type: 'hole',
                },
            ];

            it('separates each description with a comma and the last item with "and"', () => {
                assert(getRoomDoorwayDescription(doors, 1))
                    .equals('An archway leads south, a passageway leads north, and a hole leads east');
            });
        });
    });

    describe('getRoomDimensionsDescription()', () => {
        describe('given a room size of 2 x 3', () => {
            it('returns a string with the dimensions multiplied by `cellFeet`', () => {
                assert(getRoomDimensionsDescription({ width: 2, height: 3 }))
                    .equals(`${2 * cellFeet} x ${3 * cellFeet} feet`);
            });
        });
    });

    describe('sortDoorways()', () => {
        /** @type {Pick<Door, "rectangle" | "locked">} */
        const doorPartial = {
            locked: false,
            rectangle: { x: 1, y: 1, width: 1, height: 1 },
        };

        it('sorts the doors by direction first and room connection second, based on the current roomNumber', () => {
            /** @type {Door[]} */
            const doors = [
                {
                    ...doorPartial,
                    connect: {
                        1: { direction: 'south', to: 3 },
                        3: { direction: 'north', to: 1 },
                    },
                    type: 'archway',
                },
                {
                    ...doorPartial,
                    connect: {
                        1: { direction: 'south', to: 2 },
                        2: { direction: 'north', to: 1 },
                    },
                    type: 'iron',
                },
                {
                    ...doorPartial,
                    connect: {
                        1: { direction: 'north', to: 4 },
                        4: { direction: 'south', to: 1 },
                    },
                    type: 'wooden',
                },
                {
                    ...doorPartial,
                    connect: {
                        1: { direction: 'west', to: 5 },
                        5: { direction: 'east', to: 1 },
                    },
                    type: 'secret',
                },
                {
                    ...doorPartial,
                    connect: {
                        1: { direction: 'east', to: 6 },
                        6: { direction: 'west', to: 1 },
                    },
                    type: 'passageway',
                },
            ];

            const result = sortDoorways(doors, 1);

            assert(result).isArray();

            result && assert(result.length).equals(5);
            result && assert(result.shift().type).equals('wooden');
            result && assert(result.shift().type).equals('passageway');
            result && assert(result.shift().type).equals('iron');
            result && assert(result.shift().type).equals('archway');
            result && assert(result.shift().type).equals('secret');
        });

        describe('given an roomNumber not connected to the doorway', () => {
            it('throws', () => {
                /** @type {Door} */
                const door = {
                    ...doorPartial,
                    connect: {
                        1: { direction: 'south', to: 3 },
                        3: { direction: 'north', to: 1 },
                    },
                    type: 'archway',
                };

                assert(() => sortDoorways([ door, door ], 216))
                    .throws('Invalid roomNumber "216" for door connection in sortDoorways()');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getDoorwayDescriptionList()', () => {
        /** @type {Door} */
        const door = {
            connect: {
                12: { direction: 'south', to: 4  },
                4 : { direction: 'north', to: 12 },
            },
            locked: false,
            rectangle: { x: 1, y: 2, width: 1, height: 1 },
            type: 'archway',
        };

        describe('given no room number', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getDoorwayDescriptionList([]))
                    .throws('roomNumber is required in getDoorwayDescriptionList()');
            });
        });

        describe('given a door config with an invalid connection', () => {
            it('throws', () => {
                assert(() => getDoorwayDescriptionList([ door ], 216))
                    .throws('Invalid roomNumber for door connection in getDoorwayDescriptionList()');
            });
        });

        describe('given two door configs', () => {
            /** @type {Door[]} */
            const doors = [
                door,
                {
                    ...door,
                    connect: {
                        12: { direction: 'north', to: 3  },
                        3 : { direction: 'south', to: 12 },
                    },
                    type: 'iron',
                },
            ];

            const doorwayList = getDoorwayDescriptionList(doors, 12);

            it('returns a list of doorway description objects for each door', () => {
                assert(doorwayList).isArray();

                doorwayList && assert(doorwayList.length).equals(2);
                doorwayList && doorwayList.forEach((doorway, i) => {
                    const doorObj = doors[i];

                    assert(doorway.connection).equals(`to room ${doorObj.connect[12].to}`);
                    assert(doorway.desc).stringIncludes(doorObj.type);
                    assert(doorway.direction).equals(doorObj.connect[12].direction);
                });
            });
        });

        describe('given a door that connects to the outside', () => {
            /** @type {Door[]} */
            const doors = [{
                ...door,
                connect: {
                    3: { direction: 'south', to: outside },
                },
            }];

            describe('the doorway connection', () => {
                it('is "leading out of the dungeon"', () => {
                    assert(getDoorwayDescriptionList(doors, 3).pop()?.connection)
                        .equals('leading out of the dungeon');
                });
            });
        });

        /** @type {DoorType[]} */
        const secretDors = [ 'concealed', 'secret' ];

        secretDors.forEach((type) => {
            describe(`given a ${type} door`, () => {
                /** @type {Door[]} */
                const doors = [{
                    ...door,
                    connect: {
                        2: { direction: 'east', to: 1 },
                        1: { direction: 'west', to: 2 },
                    },
                    type,
                }];

                it(`includes ${type} passage in the description`, () => {
                    assert(getDoorwayDescriptionList(doors, 2)?.pop()?.desc)
                        .stringIncludes(`${type} passage`);
                });
            });
        });
    });

    describe('getKeyDescription()', () => {
        describe('given am array with two key configs', () => {
            /** @type {DoorKey[]} */
            const keys = [
                {
                    type: 'iron',
                    connect: {
                        1: { direction: 'north', to: 2 },
                        2: { direction: 'south', to: 1 },
                    },
                },
                {
                    type: 'secret',
                    connect: {
                        1 : { direction: 'east', to: 23 },
                        23: { direction: 'west', to: 1  },
                    },
                },
            ];

            const result = getKeyDescription(keys);

            it('returns a string', () => {
                assert(result).isString();
            });

            it('includes a sub title with the number of keys', () => {
                assert(result).stringIncludes('<h2>Keys (2)</h2>');
            });

            it('includes am html list with items for each key and the correct room connection', () => {
                const snapshot = '<ul><li>Iron key to room 1 / 2</li><li>Key to room 1 / 23</li></ul>';
                assert(result).stringIncludes(snapshot);
            });
        });
    });

    describe('getMapDescription()', () => {
        it('includes a title', () => {
            assert(getMapDescription()).stringIncludes('<h2>Map</h2>');
        });

        it('includes a list with a single item', () => {
            assert(getMapDescription())
                .stringIncludes('<ul><li>')
                .stringIncludes('</li></ul>')
                .stringExcludes('</li><li>');
        });
    });

    describe('getRoomDescription()', () => {
        it('returns an object with a title and description', () => {
            const room = getRoomDescription({
                config: randomizedRoomConfig,
                itemSet: { items: [], containers: [] },
                roomNumber: 1,
            });

            assert(room).isObject();
            assert(room.title).equals('Room 1');
            assert(room.description).isString();
        });

        it('includes the room number in the title', () => {
            const room = getRoomDescription({
                config: randomizedRoomConfig,
                itemSet: { items: [], containers: [] },
                roomNumber: 12,
            });

            assert(room.title).equals('Room 12');
        });

        describe('given a `roomType` of "room"', () => {
            const room = getRoomDescription({
                config: randomizedRoomConfig,
                itemSet: { items: [], containers: [] },
                roomNumber: 1,
            });

            it('excludes a room type', () => {
                assert(room.type).isUndefined();
            });
        });

        describe('given a `roomType` other than "room"', () => {
            it('returns a capitalized room type', () => {
                const room = getRoomDescription({
                    config: {
                        ...randomizedRoomConfig,
                        roomType : 'atrium',
                    },
                    itemSet: { items: [], containers: [] },
                    roomNumber: 1,
                });

                assert(room.type).equals('Atrium');
            });
        });

        describe('given room dimensions', () => {
            it('returns the room dimensions', () => {
                const room = {
                    config: randomizedRoomConfig,
                    itemSet: { items: [], containers: [] },
                    roomNumber: 1,
                    size: [ 12, 8 ],
                };

                const dimensions = {
                    width: room.size[0],
                    height: room.size[1],
                };

                assert(getRoomDescription(room).dimensions)
                    .equals(getRoomDimensionsDescription(dimensions));
            });
        });

        describe('description', () => {
            // TODO Inject environment
            // it('includes a description of the environment', () => {});

            describe('given an `itemQuantity` of "one"', () => {
                it('includes a description of the room contents', () => {
                    const room = getRoomDescription({
                        config: {
                            ...randomizedRoomConfig,
                            itemQuantity: 'one',
                        },
                        itemSet: { items: [], containers: [] },
                        roomNumber: 1,
                    });

                    assert(room.description)
                        .stringIncludes('a single  item');
                });

                describe('given a `uniformItemRarity` of "ordinary"', () => {
                    it('includes a description of the room contents', () => {
                        const room = getRoomDescription({
                            config: {
                                ...randomizedRoomConfig,
                                itemQuantity: 'one',
                                uniformItemRarity: 'average',
                            },
                            itemSet: { items: [], containers: [] },
                            roomNumber: 1,
                        });

                        assert(room.description)
                            .stringIncludes('single ordinary item');
                    });
                });

                describe('given a `uniformItemCondition`', () => {
                    it('includes a description of the room content\'s condition', () => {
                        const room = getRoomDescription({
                            config: {
                                ...randomizedRoomConfig,
                                itemQuantity : 'one',
                                uniformItemCondition: 'busted',
                            },
                            itemSet: { items: [], containers: [] },
                            roomNumber: 1,
                        });

                        assert(room.description).stringIncludes('busted');
                    });
                });
            });

            describe('given room doors', () => {
                it('includes a description of the room\'s doors', () => {
                    const room = {
                        config: randomizedRoomConfig,
                        itemSet: { items: [], containers: [] },
                        roomNumber: 1,
                    };

                    /** @type {Door[]} */
                    const roomDoors = [{
                        connect: {
                            1: { direction: 'south', to: outside },
                        },
                        locked: false,
                        rectangle: { x: 1, y: 1, width: 1, height: 2 },
                        type: 'passageway',
                    }];

                    assert(getRoomDescription(room, roomDoors).description)
                        .stringIncludes('out of the dungeon');
                });
            });
        });
    });

    describe('getRoomLabel()', () => {
        it('returns a string', () => {
            assert(getRoomLabel('armory')).isString();
        });

        describe('given a camel cased room type', () => {
            it('returns lowercase formatted words', () => {
                assert(getRoomLabel('greatHall')).equals('great hall');
            });
        });

        describe('given a room type not included in `appendRoomTypes`', () => {
            it('excludes the word "room"', () => {
                assert(getRoomLabel('atrium')).stringExcludes('room');
            });
        });

        describe('given a room type included in `appendRoomTypes`', () => {
            it('includes the word " room"', () => {
                assert(getRoomLabel([ ...appendRoomTypes ].pop())).stringIncludes(' room');
            });
        });

        describe('given a room with a custom room label', () => {
            it('returns the custom label', () => {
                assert(getRoomLabel('torture')).stringIncludes('torture chamber');
            });
        });
    });
};
