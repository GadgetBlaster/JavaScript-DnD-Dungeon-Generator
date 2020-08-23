
import {
    _getContentDescription,
    _getContentRarityDetail,
    _getDescription,
    _getDoorwayDescription,
    _getFurnitureDetail,
    _getItemConditionDescription,
    _getKeyDetail,
    _getRoomDimensions,
    _getRoomDoorwayDescription,
    getDoorwayList,
    getKeyDescription,
    getMapDescription,
    getRoomDescription,
    getRoomTypeLabel,
} from '../description.js';

import { cellFeet } from '../../dungeons/grid.js';
import { directions } from '../../dungeons/map.js';
import { furnitureQuantity } from '../../items/types/furnishing.js';
import { knobs } from '../../knobs.js';
import { random } from '../../utility/random.js';
import condition from '../../attributes/condition.js';
import doorType, { lockable, appendDoorway, outside } from '../door.js';
import quantity, { quantities } from '../../attributes/quantity.js';
import rarity, { indicateRarity, rarities } from '../../attributes/rarity.js';
import roomType, { appendRoomTypes } from '../../rooms/type.js';
import size from '../../attributes/size.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('_getContentsDescription()', () => {
        describe('given no settings', () => {
            it('should return `undefined`', () => {
                assert(_getContentDescription()).isUndefined();
            });
        });

        describe('given no item quantity', () => {
            it('should return `undefined`', () => {
                assert(_getContentDescription({})).isUndefined();
            });
        });

        describe('given an item quantity of `zero`', () => {
            it('should return `undefined`', () => {
                assert(_getContentDescription({ [knobs.itemQuantity]: quantity.zero })).isUndefined();
            });
        });

        describe('given an item quantity other than `zero`', () => {
            let positiveQuantities = quantities.filter((itemQuantity) => itemQuantity !== quantity.zero);
            positiveQuantities.forEach((itemQuantity) => {
                describe(`given an item rarity and an item quantity of \`${itemQuantity}\``, () => {
                    it('should contain the word `rare`', () => {
                        assert(_getContentDescription({
                            [knobs.itemRarity]: rarity.rare,
                            [knobs.itemQuantity]: itemQuantity,
                        })).stringIncludes(rarity.rare);
                    });
                });

                describe(`given a room furnishing of \`furnished\` and an item quantity of \`${itemQuantity}\``, () => {
                    it('should contain the word `furniture`', () => {
                        assert(_getContentDescription({
                            [knobs.roomFurnishing]: furnitureQuantity.furnished,
                            [knobs.itemQuantity]: itemQuantity,
                        })).stringIncludes('furniture');
                    });
                });

                describe(`given a room type and an item quantity of \`${itemQuantity}\``, () => {
                    it('should contain the room type', () => {
                        assert(_getContentDescription({
                            [knobs.roomType]: roomType.atrium,
                            [knobs.itemQuantity]: itemQuantity,
                        })).stringIncludes(roomType.atrium);
                    });
                });
            });
        });
    });

    describe('_getContentRarityDetail()', () => {
        describe('given a rarity of `random`', () => {
            it('should return an empty string', () => {
                assert(_getContentRarityDetail(random)).equals('');
            });
        });

        describe('given a rarity that should not be indicated', () => {
            let notIndicated = rarities.filter((contentRarity) => !indicateRarity.has(contentRarity));
            notIndicated.forEach((contentRarity) => {
                it('should return `ordinary`', () => {
                    assert(_getContentRarityDetail(contentRarity)).equals('ordinary');
                });
            });
        });

        describe('given a rarity that should be indicated', () => {
            let indicated = rarities.filter((contentRarity) => indicateRarity.has(contentRarity));
            indicated.forEach((contentRarity) => {
                it('should return the rarity', () => {
                    assert(_getContentRarityDetail(contentRarity)).equals(contentRarity);
                });
            });
        });
    });

    describe('_getDescription()', () => {
        describe('given no settings', () => {
            it('should return `You enter a room`', () => {
                assert(_getDescription()).equals('You enter a room');
            });
        });

        describe('given a room type', () => {
            it('should return a description including the room type', () => {
                assert(_getDescription({ [knobs.roomType]: roomType.library })).stringIncludes('library');
            });
        });

        describe('given a room size', () => {
            it('should return a description including the room size', () => {
                assert(_getDescription({ [knobs.roomSize]: size.large })).stringIncludes('large room');
            });
        });

        describe('given a room size of `medium`', () => {
            it('should return a description including `medium sized room`', () => {
                assert(_getDescription({ [knobs.roomSize]: size.medium })).stringIncludes('medium sized room');
            });

            describe('given a room type', () => {
                it('should return a description including `medium sized` and the room type', () => {
                    const settings = { [knobs.roomType]: roomType.smithy, [knobs.roomSize]: size.medium };
                    assert(_getDescription(settings)).stringIncludes('medium sized smithy');
                });
            });
        });

        describe('given an item quantity of `zero`', () => {
            it('should return a description including `an empty room`', () => {
                assert(_getDescription({ [knobs.itemQuantity]: quantity.zero })).stringIncludes('an empty room');
            });

            describe('given a room type', () => {
                it('should return a description including `empty` and the room type', () => {
                    const settings = { [knobs.roomType]: roomType.study, [knobs.itemQuantity]: quantity.zero };
                    assert(_getDescription(settings)).stringIncludes('empty study');
                });
            });

            describe('given a room size', () => {
                it('should return a description including the size and `empty room`', () => {
                    const settings = {
                        [knobs.itemQuantity]: quantity.zero,
                        [knobs.roomSize]: size.massive,
                    };

                    assert(_getDescription(settings)).stringIncludes('massive empty room');
                });
            });

            describe('given a room type and size', () => {
                it('should return a description including the size, `empty`, and the room type', () => {
                    const settings = {
                        [knobs.itemQuantity]: quantity.zero,
                        [knobs.roomSize]: size.large,
                        [knobs.roomType]: roomType.treasury,
                    };

                    assert(_getDescription(settings)).stringIncludes('large empty treasury');
                });
            });
        });

        describe('given a room condition', () => {
            describe('given a room condition of `average`', () => {
                it('should not include condition in the room description', () => {
                    assert(_getDescription({ [knobs.roomCondition]: condition.average })).stringExcludes('condition');
                });
            });

            describe('given a room condition other than `average`', () => {
                Object.values(condition).filter((roomCondition) => roomCondition !== condition.average).forEach((roomCondition) => {
                    let expect = `in ${roomCondition} condition`;
                    it(`should return a description including \`${expect}\``, () => {
                        const settings = { [knobs.roomCondition]: roomCondition };
                        assert(_getDescription(settings)).stringIncludes(expect);
                    });
                });
            });
        });
    });

    describe('_getDoorwayDescription()', () => {
        describe('given a size of `1`', () => {
            it('should not contain a size description', () => {
                assert(_getDoorwayDescription({ size: 1 }))
                    .stringExcludes('double wide')
                    .stringExcludes('large')
                    .stringExcludes('massive');
            });
        });

        describe('given a size of `2`', () => {
            it('should contain the string `wide`', () => {
                assert(_getDoorwayDescription({ size: 2 })).stringIncludes('wide');
            });
        });

        describe('given a size of `3`', () => {
            it('should contain a the string `large`', () => {
                assert(_getDoorwayDescription({ size: 3 })).stringIncludes('large');
            });
        });

        describe('given a size larger than `3`', () => {
            it('should contain a the string `massive`', () => {
                assert(_getDoorwayDescription({ size: 12 })).stringIncludes('massive');
            });
        });

        describe('given a door type included in `appendDoorway`', () => {
            [ ...appendDoorway ].forEach((type) => {
                it('should contain the string `doorway`', () => {
                    assert(_getDoorwayDescription({ type }))
                        .stringIncludes('doorway');
                });

                describe('given a size of `2`', () => {
                    it('should contain the string `double wide`', () => {
                        assert(_getDoorwayDescription({ type, size: 2 })).stringIncludes('double wide');
                    });
                });
            });
        });

        describe('given an object with a truthy `locked` property', () => {
            it('should contain the string `locked`', () => {
                assert(_getDoorwayDescription({ locked: true })).stringIncludes('locked');
            });
        });

        describe('given an object with a falsy `locked` property', () => {
            it('should not contain the string `locked`', () => {
                assert(_getDoorwayDescription({ locked: false })).stringExcludes('locked');
            });
        });
    });

    describe('_getFurnitureDetail()', () => {
        let details = {
            [furnitureQuantity.none]: '',
            [furnitureQuantity.minimum]: 'minimal furnishings',
            [furnitureQuantity.sparse]: 'sparse furnishings',
            [furnitureQuantity.average]: 'some furniture',
            [furnitureQuantity.furnished]: 'some furniture',
        };

        Object.values(furnitureQuantity).forEach((roomFurnishing) => {
            let expect = details[roomFurnishing];
            it(`should return \`${expect}\``, () => {
                assert(_getFurnitureDetail(roomFurnishing)).equals(expect);
            });
        });
    });

    describe('_getItemConditionDescription()', () => {
        describe('given no settings', () => {
            it('should return `undefined`', () => {
                assert(_getItemConditionDescription()).isUndefined();
            });
        });

        describe('given no item quantity', () => {
            it('should return `undefined`', () => {
                assert(_getItemConditionDescription({})).isUndefined();
            });
        });

        describe('given an item quantity of `zero`', () => {
            it('should return `undefined`', () => {
                assert(_getItemConditionDescription({ [knobs.itemQuantity]: quantity.zero })).isUndefined();
            });
        });

        describe('given an item condition of `average`', () => {
            it('should return `undefined`', () => {
                assert(_getItemConditionDescription({
                    [knobs.itemQuantity]: quantity.one,
                    [knobs.itemCondition]: condition.average,
                })).isUndefined();
            });
        });

        describe('given an item condition other than `average`', () => {
            Object.values(condition).filter((itemCondition) => itemCondition !== condition.average).map((itemCondition) => {
                it('should return a string including the condition', () => {
                    assert(_getItemConditionDescription({
                        [knobs.itemQuantity]: quantity.one,
                        [knobs.itemCondition]: itemCondition,
                    })).stringIncludes(itemCondition);
                });
            });
        });
    });

    describe('_getKeyDetail()', () => {
        describe('given a lockable door type other than `mechanical`', () => {
            [ ... [ ...lockable ].filter((type) => type !== doorType.mechanical), 'Undefined key description for door type' ].forEach((type) => {
                describe(`door type \`${type}\``, () => {
                    it('should include the word `key`', () => {
                        assert(_getKeyDetail(type).toLowerCase()).stringIncludes('key');
                    });
                });
            });
        });

        describe('given a door type of `mechanical`', () => {
            it('should contain the word `leaver`', () => {
                assert(_getKeyDetail(doorType.mechanical)).stringIncludes('leaver');
            });
        });
    });

    describe('_getRoomDoorwayDescription()', () => {
        describe('give only a concealed door', () => {
            it('should return undefined', () => {
                assert(_getRoomDoorwayDescription([ { type: doorType.concealed } ])).isUndefined();
            });
        });

        describe('give only a secret door', () => {
            it('should return undefined', () => {
                assert(_getRoomDoorwayDescription([ { type: doorType.secret } ])).isUndefined();
            });
        });

        describe('given a single door object', () => {
            const config = {
                type: doorType.passageway,
                size: 1,
                connection: { direction: directions.north, to: 2 },
            };

            const desc = _getRoomDoorwayDescription([ config ]);

            it('should include the door description', () => {
                assert(desc).stringIncludes(_getDoorwayDescription(config));
            });

            it('should include the word `single`', () => {
                assert(desc).stringIncludes('single');
            });

            it('should include the door direction', () => {
                assert(desc).stringIncludes('north');
            });

            it('should include the door type', () => {
                assert(desc).stringIncludes(doorType.passageway);
            });

            it('should capitalize the sentence', () => {
                assert(desc.startsWith('A')).isTrue();
            });
        });

        describe('given a door object connected to the outside on the south wall', () => {
            const config = [{
                type: doorType.passageway,
                size: 1,
                connection: { direction: directions.south, to: outside },
            }];

            it('should include a description of the door to the outside', () => {
                assert(_getRoomDoorwayDescription(config))
                    .stringIncludes('leads south out of the dungeon');
            });
        });

        describe('given two door objects', () => {
            const config = [
                {
                    type: doorType.archway,
                    size: 1,
                    connection: { direction: directions.south, to: 2 },
                },
                {
                    type: doorType.passageway,
                    size: 1,
                    connection: { direction: directions.north, to: 1 },
                }
            ];

            const desc = _getRoomDoorwayDescription(config);

            describe('when the first door is of type `archway`', () => {
                it('should prefix the doorway description type with `An`', () => {
                    assert(desc.startsWith('An')).isTrue();
                });
            });

            describe('when the first door is of type `archway`', () => {
                it('should join the descriptions with `and` and contain no commas', () => {
                    assert(desc)
                        .stringIncludes(' and ')
                        .stringExcludes(',');
                });
            });
        });

        describe('given an array of three doors objects', () => {
            const config = [
                {
                    type: doorType.archway,
                    size: 1,
                    connection: { direction: directions.south, to: 2 },
                },
                {
                    type: doorType.passageway,
                    size: 1,
                    connection: { direction: directions.north, to: 3 },
                },
                {
                    type: doorType.hole,
                    size: 1,
                    connection: { direction: directions.east, to: 4 },
                }
            ];

            describe('when the first door is of type `archway`', () => {
                it('should separate each description with a comma and the last with `and`', () => {
                    assert(_getRoomDoorwayDescription(config))
                        .stringIncludes(` ${doorType.archway} leads south,`)
                        .stringIncludes(` ${doorType.passageway} leads north,`)
                        .stringIncludes(`, and a ${doorType.hole} leads east`);
                });
            });
        });
    });

    describe('_getRoomDimensions()', () => {
        describe('given no room size', () => {
            it('should return an empty string', () => {
                assert(_getRoomDimensions()).equals('');
            });
        });

        describe('given a room size of 2 x 3', () => {
            it('should return a string with the dimensions multiplied by `cellFeet`', () => {
                assert(_getRoomDimensions([ 2, 3]))
                    .stringIncludes(`${2 * cellFeet}`)
                    .stringIncludes(`${3 * cellFeet}`);
            });
        });
    });

    describe('getDoorwayList()', () => {
        describe('given two door objects', () => {
            const config = [
                {
                    type: doorType.archway,
                    connection: { direction: directions.south, to: 2 },
                },
                {
                    type: doorType.passageway,
                    connection: { direction: directions.north, to: 3 },
                },
            ];

            const doorwayList = getDoorwayList(config);

            it('should include an html subtitle with the number of doorways in parenthesis', () => {
                assert(doorwayList).stringIncludes('<h3>Doorways (2)</h3>');
            });

            it('should include an html list', () => {
                assert(doorwayList).stringIncludes('<ul><li>').stringIncludes('</li></ul>');
            });

            it('should include an html list item for each doorway', () => {
                assert(doorwayList)
                    .stringIncludes(`<li>South to Room 2 (<em>${doorType.archway}</em>)</li>`)
                    .stringIncludes(`<li>North to Room 3 (<em>${doorType.passageway}</em>)</li>`);
            });
        });

        describe('given a door that connects to outside', () => {
            const config = [{
                type: doorType.archway,
                connection: { direction: directions.south, to: outside },
            }];

            it('should include `leading out of the dungeon`', () => {
                assert(getDoorwayList(config)).stringIncludes('leading out of the dungeon');
            });
        });

        describe('given a secret or concealed door', () => {
            [ doorType.concealed, doorType.secret ].forEach((type) => {
                const config = [{
                    type,
                    connection: { direction: directions.east, to: 1 },
                }];

                it('should emphasize the list item with `<strong>`', () => {
                    assert(getDoorwayList(config))
                        .stringIncludes(`<strong>East to Room 1 (<em>${type}</em>)</strong>`);
                });
            });
        });
    });

    describe('getKeyDescription()', () => {
        describe('given am array with two key objects', () => {
            const keys = [
                {
                    type: 'Any',
                    connections: {
                        1: { direction: directions.north, to: 2 },
                        2: { direction: directions.south, to: 1 },
                    },
                },
                {
                    type: 'Any',
                    connections: {
                        1: { direction: directions.east, to: 23 },
                        23: { direction: directions.west, to: 1 },
                    },
                },
            ];

            const result = getKeyDescription(keys);

            it('should return a string', () => {
                assert(result).isString();
            });

            it('should include a sub title with the number of keys', () => {
                assert(result).stringIncludes('<h3>Keys (2)</h3>');
            });

            it('should include am html list string with items for each key and the correct room connections', () => {
                const snapshot = '<ul><li>Key to room 1 / 2</li><li>Key to room 1 / 23</li></ul>';
                assert(result).stringIncludes(snapshot);
            });
        });
    });

    describe('getMapDescription()', () => {
        it('should include a title', () => {
            assert(getMapDescription()).stringIncludes('<h3>Map</h3>');
        });

        it('should include a list with a single item', () => {
            assert(getMapDescription())
                .stringIncludes('<ul><li>')
                .stringIncludes('</li></ul>')
                .stringExcludes('</li><li>');
        });
    });

    describe('getRoomDescription()', () => {
        describe('header', () => {
            it('should include an html header', () => {
                const room = { settings: { [knobs.roomCount]: 1, [knobs.roomType]: roomType.room }, };
                assert(getRoomDescription(room)).stringIncludes('<header><h2>Room</h2></header>');
            });

            describe('subtitle', () => {
                it('should include an html subtitle', () => {
                    const room = { settings: { [knobs.roomCount]: 1, [knobs.roomType]: roomType.room }, };
                    assert(getRoomDescription(room)).stringIncludes('<h3>Description</h3>');
                });
            });

            describe('given `roomCount` of `1` and a `roomType` of `room`', () => {
                it('should not include the room number or the room type in the html title', () => {
                    const room = {
                        settings: { [knobs.roomCount]: 1, [knobs.roomType]: roomType.room },
                        roomNumber: 1,
                    };

                    assert(getRoomDescription(room)).stringIncludes('<h2>Room</h2>');
                });
            });

            describe('given `roomCount` greater than `1`', () => {
                it('should include the room number in the html title', () => {
                    const room = {
                        settings: { [knobs.roomCount]: 2, [knobs.roomType]: roomType.room },
                        roomNumber: 1,
                    };

                    assert(getRoomDescription(room)).stringIncludes('<h2>Room 1</h2>');
                });
            });

            describe('given a `roomType` other than `room`', () => {
                it('should include the room type in the html title', () => {
                    const room = {
                        settings: { [knobs.roomCount]: 1, [knobs.roomType]: roomType.atrium },
                        roomNumber: 1,
                    };

                    assert(getRoomDescription(room)).stringIncludes(`<h2>Room - Atrium</h2>`);
                });
            });

            describe('given room dimensions', () => {
                it('should include a span containing the room dimensions', () => {
                    const room = {
                        settings: { [knobs.roomCount]: 1, [knobs.roomType]: roomType.room },
                        size: [ 12, 8 ],
                    };

                    assert(getRoomDescription(room))
                        .stringIncludes(`<span>${_getRoomDimensions(room.size)}</span>`);
                });
            });
        });

        describe('description', () => {
            it('should include the room description in an html paragraph', () => {
                const room = { settings: { [knobs.roomCount]: 1, [knobs.roomType]: roomType.room }, };
                assert(getRoomDescription(room))
                    .stringIncludes('<p>')
                    .stringIncludes('</p>');
            });

            // TODO it('should include a description of the environment', () => {});

            describe('given an item quantity', () => {
                it('should include a description of the room contents', () => {
                    const room = { settings: {
                        [knobs.roomCount]: 1,
                        [knobs.roomType]: roomType.room,
                        [knobs.itemQuantity]: quantity.one,
                    }};

                    assert(getRoomDescription(room)).stringIncludes('single ordinary item');
                });
            });

            describe('given an item condition ', () => {
                it('should include a description of the room content\'s condition', () => {
                    const room = { settings: {
                        [knobs.roomCount]: 1,
                        [knobs.roomType]: roomType.room,
                        [knobs.itemQuantity]: quantity.one,
                        [knobs.itemCondition]: condition.busted,
                    }};

                    assert(getRoomDescription(room)).stringIncludes(condition.busted);
                });
            });

            describe('given room doors', () => {
                it('should include a description of the room\'s doors', () => {
                    const room = { settings: { [knobs.roomCount]: 1, [knobs.roomType]: roomType.room }};
                    const roomDoors = [{
                        type: doorType.passageway,
                        size: 1,
                        connection: { direction: directions.south, to: outside },
                    }];

                    assert(getRoomDescription(room, roomDoors))
                        .stringIncludes('out of the dungeon');
                });
            });
        });
    });

    describe('getRoomTypeLabel()', () => {
        Object.values(roomType).forEach((type) => {
            describe(`room type \`${type}\``, () => {
                const result = getRoomTypeLabel(type);

                it('should be a string', () => {
                    assert(result).isString();
                });
            });
        });

        describe('given a camel cased room type', () => {
            it('should return lowercased, formatted words', () => {
                assert(getRoomTypeLabel('greatHall')).equals('great hall');
            });
        });

        describe('given a room type not included in `appendRoomTypes`', () => {
            it('should not include the word `room`', () => {
                assert(getRoomTypeLabel('oubliette')).stringExcludes('room');
            });
        });

        describe('given a room type included in `appendRoomTypes`', () => {
            appendRoomTypes.forEach((type) => {
                describe(`room type \`${type}\``, () => {
                    it('should include the word ` room`', () => {
                        assert(getRoomTypeLabel(type)).stringIncludes(' room');
                    });
                });
            });
        });
    });
};
