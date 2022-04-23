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

    // Public Functions
    getDoorwayDescriptions,
    getKeyDescription,
    getMapDescription,
    getRoomDescription,
    getRoomLabel,
} from '../description.js';

import { appendRoomTypes } from '../room.js';
import { cellFeet } from '../../dungeon/grid.js';
import { outside } from '../../dungeon/map.js';
import { conditions } from '../../attribute/condition.js';
import { furnitureQuantities } from '../../item/furnishing.js';
import { indicateRarity, rarities } from '../../attribute/rarity.js';
import { lockable, appendDoorway } from '../door.js';
import { quantities } from '../../attribute/quantity.js';

/** @typedef {import('../../controller/knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../../dungeon/map').Direction} Direction */
/** @typedef {import('../door.js').DoorType} DoorType */
/** @typedef {import('../generate').GeneratedRoomConfig} GeneratedRoomConfig */

/** @type {GeneratedRoomConfig} */
const config = {
    itemCondition        : 'average',
    itemQuantity         : 'one',
    itemRarity           : 'average',
    itemType             : 'armor',
    roomCondition        : 'average',
    roomCount            : 1,
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

        describe('given no roomType', () => {
            it('throws', () => {
                const missingRoomType = { ...config };
                delete missingRoomType.roomType;

                assert(() => getContentDescription(missingRoomType))
                    .throws('roomType is required in `getRoomContentDescription()`');
            });
        });

        describe('given no itemQuantity', () => {
            it('throws', () => {
                const missingItemQuantity = { ...config };
                delete missingItemQuantity.itemQuantity;

                assert(() => getContentDescription(missingItemQuantity))
                    .throws('Invalid itemQuantity in `getRoomContentDescription()`');
            });
        });

        describe('given an item quantity of "zero"', () => {
            it('returns undefined', () => {
                assert(getContentDescription({ ...config, itemQuantity: 'zero' }))
                    .isUndefined();
            });
        });

        describe('given an item quantity other than "zero"', () => {
            let positiveQuantities = quantities
                .filter((itemQuantity) => itemQuantity !== 'zero');

            positiveQuantities.forEach((itemQuantity) => {
                describe(`given an item quantity of "${itemQuantity}"`, () => {
                    it('contains the given room type', () => {
                        assert(getContentDescription({
                            ...config,
                            roomType    : 'atrium',
                            itemQuantity: itemQuantity,
                        })).stringIncludes('atrium');
                    });

                    describe('given an item rarity of "rare"', () => {
                        it('contains the word "rare"', () => {
                            assert(getContentDescription({
                                ...config,
                                itemRarity  : 'rare',
                                itemQuantity: itemQuantity,
                            })).stringIncludes('rare');
                        });
                    });

                    describe('given a roomFurnitureQuantity of "none"', () => {
                        it('excludes the word "furniture" or "furnishings"', () => {
                            const noFurnishingConfig = {
                                ...config,
                                itemQuantity: itemQuantity,
                            };

                            assert(getContentDescription(noFurnishingConfig))
                                .stringExcludes('furniture')
                                .stringExcludes('furnishings');
                        });
                    });

                    describe('given a room furnishing of "furnished"', () => {
                        it('contains the word "furniture"', () => {
                            assert(getContentDescription({
                                ...config,
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
        describe('given a rarity of `random`', () => {
            it('returns an empty string', () => {
                assert(getContentRarityDetail('random')).equals('');
            });
        });

        describe('given a rarity that should not be indicated', () => {
            let rarityNotIndicated = rarities.find((contentRarity) => !indicateRarity.has(contentRarity));

            it('returns "ordinary"', () => {
                assert(getContentRarityDetail(rarityNotIndicated)).equals('ordinary');
            });
        });

        describe('given a rarity that should be indicated', () => {
            let rarityIndicated = [ ...indicateRarity ].pop();

            it('returns the rarity', () => {
                assert(getContentRarityDetail(rarityIndicated)).equals(rarityIndicated);
            });
        });
    });

    describe('getDescriptionIntro()', () => {
        /** @type {GeneratedRoomConfig} */
        const roomConfig = {
            itemQuantity: 'one',
            itemCondition: 'average',
            itemRarity: 'random',
            itemType: 'random',
            roomCount: 1,
            roomType: 'room',
            roomSize: 'medium',
            roomCondition: 'average',
            roomFurnitureQuantity: 'none',
        };

        describe('given a room type of "room"', () => {}); // TODO

        describe('given a room type other than "room"', () => {
            it('returns a description including the room type', () => {
                assert(getDescriptionIntro({ ...config, roomType: 'library' }))
                    .stringIncludes('library');
            });
        });

        describe('given a room size', () => {
            it('returns a description including the room size', () => {
                assert(getDescriptionIntro({ ...config, roomSize: 'large' }))
                    .stringIncludes('large room');
            });
        });

        describe('given a room size of "medium"', () => {
            it('returns a description including "medium sized room"', () => {
                assert(getDescriptionIntro({ ...config, roomSize: 'medium' }))
                    .stringIncludes('medium sized room');
            });

            describe('given a room type other than "room"', () => {
                it('returns a description including "medium sized" and the room type', () => {
                    assert(getDescriptionIntro({
                        ...config,
                        roomType: 'smithy',
                        roomSize: 'medium',
                    })).stringIncludes('medium sized smithy');
                });
            });
        });

        describe('given an item quantity of "zero"', () => {
            it('returns a description including "empty room"', () => {
                assert(getDescriptionIntro({ ...roomConfig, itemQuantity: 'zero' }))
                    .stringIncludes('empty room');
            });

            describe('given a room type other than "room"', () => {
                it('returns a description including "empty" and the room type', () => {
                    assert(getDescriptionIntro({
                        ...config,
                        itemQuantity: 'zero',
                        roomType    : 'study',
                    })).stringIncludes('empty study');
                });
            });

            describe('given a room size', () => {
                it('returns a description including the size and "empty room"', () => {
                    assert(getDescriptionIntro({
                        ...config,
                        itemQuantity: 'zero',
                        roomSize    : 'massive',
                    })).stringIncludes('massive empty room');
                });
            });

            describe('given a room type other than "room" and a room size', () => {
                it('returns a description including the size, "empty", and the room type', () => {
                    assert(getDescriptionIntro({
                        ...config,
                        itemQuantity: 'zero',
                        roomSize    : 'large',
                        roomType    : 'treasury',
                    })).stringIncludes('large empty treasury');
                });
            });
        });

        describe('given a room condition', () => {
            describe('given a room condition of "average"', () => {
                it('excludes "condition" in the room description', () => {
                    assert(getDescriptionIntro({ ...config, roomCondition: 'average' }))
                        .stringExcludes('condition');
                });
            });

            describe('given a room condition other than "average"', () => {
                it(`returns a description including the condition`, () => {
                    assert(getDescriptionIntro({ ...config, roomCondition: 'busted' })).stringIncludes('busted');
                });
            });
        });
    });

    describe('getDoorwayDescription()', () => {
        const door = {
            size: 1,
            type: /** @type {DoorType} */ ('iron'),
            locked: false,
        };

        describe('when locked is true for a non-lockable door type', () => {
            it('throws', () => {
                assert(() => getDoorwayDescription({ ...door, type: 'archway', locked: true }))
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

        describe('given a size of 2', () => {
            it('contains the string "wide"', () => {
                assert(getDoorwayDescription({ ...door, size: 2 }))
                    .stringIncludes('wide');
            });
        });

        describe('given a size of 3', () => {
            it('contains a the string "large"', () => {
                assert(getDoorwayDescription({ ...door, size: 3 }))
                    .stringIncludes('large');
            });
        });

        describe('given a size larger than 3', () => {
            it('contains a the string "massive"', () => {
                assert(getDoorwayDescription({ ...door, size: 12 }))
                    .stringIncludes('massive');
            });
        });

        describe('given a door type included in `appendDoorway`', () => {
            let appendDoorwayType = [ ...appendDoorway ].pop();

            it('contains the string "doorway"', () => {
                assert(getDoorwayDescription({
                    ...door,
                    type: appendDoorwayType,
                })).stringIncludes('doorway');
            });

            describe('given a size of 2', () => {
                it('contains the string `double wide`', () => {
                    assert(getDoorwayDescription({
                        ...door,
                        type: appendDoorwayType,
                        size: 2,
                    })).stringIncludes('double wide');
                });
            });
        });

        describe('given an object with a truthy `locked` property', () => {
            it('contains the string "locked"', () => {
                assert(getDoorwayDescription({ ...door, locked: true }))
                    .stringIncludes('locked');
            });
        });

        describe('given an object with a falsy `locked` property', () => {
            it('excludes the string "locked"', () => {
                assert(getDoorwayDescription({ ...door, locked: false }))
                    .stringExcludes('locked');
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

    describe('getItemConditionDescription()', () => {
        describe('given no item quantity', () => {
            it('returns undefined', () => {
                assert(getItemConditionDescription({})).isUndefined();
            });
        });

        describe('given an item quantity of "zero"', () => {
            it('returns undefined', () => {
                assert(getItemConditionDescription({ itemQuantity: 'zero' }))
                    .isUndefined();
            });
        });

        describe('given an item with "average"', () => {
            it('returns undefined', () => {
                assert(getItemConditionDescription({
                    itemQuantity : 'one',
                    itemCondition: 'average',
                })).isUndefined();
            });
        });

        describe('given an item with condition other than "average"', () => {
            let nonAverageConditions = conditions
                .filter((itemCondition) => itemCondition !== 'average');

            nonAverageConditions.forEach((itemCondition) => {
                it('returns a string including the condition', () => {
                    assert(getItemConditionDescription({
                        itemQuantity : 'one',
                        itemCondition: itemCondition,
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
                assert(getKeyDetail('Undefined key type')).stringIncludes('Key');
            });
        });
    });

    describe('getRoomDoorwayDescription()', () => {
        const door = {
            connections: {
                1: { direction: 'south', to: 2 },
                2: { direction: 'north', to: 1 },
            },
            locked: false,
            size: 1,
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
                    .throws('Invalid door connections for roomNumber in getRoomDoorwayDescription()');
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
            const config = [{
                ...door,
                connections: {
                    4: { direction: 'south', to: outside },
                    5: { direction: 'north', to: 4 },
                },
            }];

            it('includes a description of the door to the outside', () => {
                assert(getRoomDoorwayDescription(config, 4))
                    .stringIncludes('leads south out of the dungeon');
            });
        });

        describe('given two door configs', () => {
            const config = [
                {
                    connections: {
                        1: { direction: 'south', to: 2 },
                        2: { direction: 'north', to: 1 },
                    },
                    locked: false,
                    size: 1,
                    type: 'archway',
                },
                {
                    connections: {
                        1: { direction: 'east', to: 3 },
                        3: { direction: 'west', to: 1 },
                    },
                    locked: false,
                    size: 1,
                    type: 'passageway',
                },
            ];

            const desc = getRoomDoorwayDescription(config, 1);

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
            const config = [
                {
                    connections: {
                        1: { direction: 'south', to: 2 },
                        2: { direction: 'north', to: 1 },
                    },
                    locked: false,
                    size: 1,
                    type: 'archway',
                },
                {
                    connections: {
                        1: { direction: 'north', to: 3 },
                        3: { direction: 'south', to: 1 },
                    },
                    locked: false,
                    type: 'passageway',
                    size: 1,
                },
                {
                    connections: {
                        1: { direction: 'east', to: 4 },
                        4: { direction: 'west', to: 1 },
                    },
                    locked: false,
                    type: 'hole',
                    size: 1,
                },
            ];

            it('separates each description with a comma and the last with `and`', () => {
                assert(getRoomDoorwayDescription(config, 1))
                    .stringIncludes(' archway leads south,')
                    .stringIncludes(' passageway leads north,')
                    .stringIncludes(', and a hole leads east');
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

    // -- Public Functions -----------------------------------------------------

    describe('getDoorwayDescriptions()', () => {
        describe('given no room number', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getDoorwayDescriptions([]))
                    .throws('roomNumber is required in getDoorwayDescriptions()');
            });
        });

        describe('given a door config with an invalid connection', () => {
            it('throws', () => {
                const config = [{
                    type: 'archway',
                    connections: {
                        12: { direction: 'south', to: 4 },
                        4 : { direction: 'north', to: 12 },
                    },
                }];

                // @ts-expect-error
                assert(() => getDoorwayDescriptions(config, 216))
                    .throws('Invalid roomNumber for door connections in getDoorwayDescriptions()');
            });
        });

        describe('given two door configs', () => {
            const config = [
                {
                    type: 'archway',
                    connections: {
                        12: { direction: 'south', to: 4 },
                        4 : { direction: 'north', to: 12 },
                    },
                },
                {
                    type: 'passageway',
                    connections: {
                        12: { direction: 'north', to: 3 },
                        3: { direction: 'south', to: 12 },
                    },
                },
            ];

            const doorwayList = getDoorwayDescriptions(config, 12);

            it('includes an html subtitle with the number of doorways in parenthesis', () => {
                assert(doorwayList).stringIncludes('<h3>Doorways (2)</h3>');
            });

            it('includes an html list', () => {
                assert(doorwayList).stringIncludes('<ul><li>').stringIncludes('</li></ul>');
            });

            it('includes an html list item for each doorway', () => {
                assert(doorwayList)
                    .stringIncludes('<li>South to Room 4 (<em>archway</em>)</li>')
                    .stringIncludes('<li>North to Room 3 (<em>passageway</em>)</li>');
            });
        });

        describe('given a door that connects to the outside', () => {
            const config = [{
                type: 'archway',
                connections: {
                    3: { direction: 'south', to: outside },
                },
            }];

            it('includes "leading out of the dungeon"', () => {
                assert(getDoorwayDescriptions(config, 3)).stringIncludes('leading out of the dungeon');
            });
        });

        describe('given a secret or concealed door', () => {
            [ 'concealed', 'secret' ].forEach((type) => {
                const config = [{
                    type,
                    connections: {
                        2: { direction: 'east', to: 1 },
                        1: { direction: 'west', to: 2 },
                    },
                }];

                it('emphasizes the list item with `<strong>`', () => {
                    assert(getDoorwayDescriptions(config, 2))
                        .stringIncludes(`<strong>East to Room 1 (<em>${type}</em>)</strong>`);
                });
            });
        });
    });

    describe('getKeyDescription()', () => {
        describe('given am array with two key configs', () => {
            const keys = [
                {
                    type: 'Any',
                    connections: {
                        1: { direction: 'north', to: 2 },
                        2: { direction: 'south', to: 1 },
                    },
                },
                {
                    type: 'Any',
                    connections: {
                        1 : { direction: 'east', to: 23 },
                        23: { direction: 'west', to: 1 },
                    },
                },
            ];

            const result = getKeyDescription(keys);

            it('returns a string', () => {
                assert(result).isString();
            });

            it('includes a sub title with the number of keys', () => {
                assert(result).stringIncludes('<h3>Keys (2)</h3>');
            });

            it('includes am html list with items for each key and the correct room connections', () => {
                const snapshot = '<ul><li>Key to room 1 / 2</li><li>Key to room 1 / 23</li></ul>';
                assert(result).stringIncludes(snapshot);
            });
        });
    });

    describe('getMapDescription()', () => {
        it('includes a title', () => {
            assert(getMapDescription()).stringIncludes('<h3>Map</h3>');
        });

        it('includes a list with a single item', () => {
            assert(getMapDescription())
                .stringIncludes('<ul><li>')
                .stringIncludes('</li></ul>')
                .stringExcludes('</li><li>');
        });
    });

    describe('getRoomDescription()', () => {
        const roomConfig = {
            roomCount   : 1,
            roomType    : 'room',
            itemQuantity: 'zero',
        };

        it('returns an object with a title and description', () => {
            const room = getRoomDescription({
                config,
                itemSet: { items: [], containers: [] },
                roomNumber: 1,
            });

            assert(room).isObject();
            room && assert(room.title).equals('Room');
        });

        describe('given `roomCount` of `1` and a `roomType` of "room"', () => {
            const room = getRoomDescription({
                config,
                itemSet: { items: [], containers: [] },
                roomNumber: 1,
            });

            it('excludes the room number in the title', () => {
                assert(room.title).equals('Room');
            });

            it('excludes a room type', () => {
                assert(room.type).isUndefined();
            });
        });

        describe('given roomCount greater than 1', () => {
            it('includes the room number in the title', () => {
                const room = getRoomDescription({
                    config: {
                        ...config,
                        roomCount: 2,
                    },
                    itemSet: { items: [], containers: [] },
                    roomNumber: 1,
                });

                assert(room.title).equals('Room 1');
            });
        });

        describe('given a roomType other than "room"', () => {
            it('returns a capitalized room type', () => {
                const room = getRoomDescription({
                    config: {
                        ...config,
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
                    config,
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

            describe('given an item quantity', () => {
                it('includes a description of the room contents', () => {
                    const room = getRoomDescription({
                        config: {
                            ...config,
                            itemQuantity: 'one',
                        },
                        itemSet: { items: [], containers: [] },
                        roomNumber: 1,
                    });

                    assert(room.description)
                        .stringIncludes('single ordinary item');
                });
            });

            describe('given an item condition', () => {
                it('includes a description of the room content\'s condition', () => {
                    const room = getRoomDescription({
                        config: {
                            ...config,
                            itemQuantity : 'one',
                            itemCondition: 'busted',
                        },
                        itemSet: { items: [], containers: [] },
                        roomNumber: 1,
                    });

                    assert(room.description).stringIncludes('busted');
                });
            });

            describe('given room doors', () => {
                it('includes a description of the room\'s doors', () => {
                    const room = {
                        config,
                        itemSet: { items: [], containers: [] },
                        roomNumber: 1,
                    };

                    const roomDoors = [{
                        connections: {
                            1: { direction: /** @type {Direction} */ ('south'), to: outside },
                        },
                        locked: false,
                        rect: '<rect></rect>',
                        size: 1,
                        type: /** @type {DoorType} */ ('passageway'),
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
