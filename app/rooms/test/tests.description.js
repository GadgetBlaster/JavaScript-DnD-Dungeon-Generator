
import {
    _getKeyDetail,
    getKeyDescription,
    getMapDescription,
    getRoomTypeLabel,
    _getDescription,
} from '../description.js';

import { lockable } from '../door.js';
import { directions } from '../../dungeons/map.js';
import roomTypes, { appendRoomTypes } from '../../rooms/type.js';
import { knobs } from '../../knobs.js';
import sizes from '../../attributes/size.js';
import quantity from '../../attributes/quantity.js';
import conditions from '../../attributes/condition.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
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

    describe('_getKeyDetail()', () => {
        [ ...lockable, 'Undefined key description for door type' ].forEach((type) => {
            describe(`key type \`${type}\``, () => {
                const result = _getKeyDetail(type);

                it('should return a string', () => {
                    assert(result).isString();
                });

                it('should not be an empty string', () => {
                    assert(result === '').isFalse();
                });
            });
        });
    });

    describe('getKeyDescription()', () => {
        describe('given am array with two Key objects', () => {
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

    describe('getRoomTypeLabel()', () => {
        Object.values(roomTypes).forEach((type) => {
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

    describe('_getDescription()', () => {
        describe('given no parameters', () => {
            it('should return `You enter a room`', () => {
                assert(_getDescription()).equals('You enter a room');
            });
        });

        describe('given a room type', () => {
            it('should return a description including the room type', () => {
                assert(_getDescription({ [knobs.roomType]: roomTypes.library })).stringIncludes('library');
            });
        });

        describe('given a room size', () => {
            it('should return a description including the room size', () => {
                assert(_getDescription({ [knobs.roomSize]: sizes.large })).stringIncludes('large room');
            });
        });

        describe('given a room size of medium', () => {
            it('should return a description including `medium sized room`', () => {
                assert(_getDescription({ [knobs.roomSize]: sizes.medium })).stringIncludes('medium sized room');
            });

            describe('given a room type', () => {
                it('should return a description including `medium sized` and the room type', () => {
                    const settings = { [knobs.roomType]: roomTypes.smithy, [knobs.roomSize]: sizes.medium };
                    assert(_getDescription(settings)).stringIncludes('medium sized smithy');
                });
            });
        });

        describe('given an item quantity of zero', () => {
            it('should return a description including `an empty room`', () => {
                assert(_getDescription({ [knobs.itemQuantity]: quantity.zero })).stringIncludes('an empty room');
            });

            describe('given a room type', () => {
                it('should return a description including `empty` and the room type', () => {
                    const settings = { [knobs.roomType]: roomTypes.study, [knobs.itemQuantity]: quantity.zero };
                    assert(_getDescription(settings)).stringIncludes('empty study');
                });
            });

            describe('given a room size', () => {
                it('should return a description including the size and `empty room`', () => {
                    const settings = {
                        [knobs.itemQuantity]: quantity.zero,
                        [knobs.roomSize]: sizes.massive,
                    };

                    assert(_getDescription(settings)).stringIncludes('massive empty room');
                });
            });

            describe('given a room type and size', () => {
                it('should return a description including the size, `empty`, and the room type', () => {
                    const settings = {
                        [knobs.itemQuantity]: quantity.zero,
                        [knobs.roomSize]: sizes.large,
                        [knobs.roomType]: roomTypes.treasury,
                    };

                    assert(_getDescription(settings)).stringIncludes('large empty treasury');
                });
            });
        });

        describe('given a room condition', () => {
            describe('given a room condition of average', () => {
                it('should not include condition in the room description', () => {
                    assert(_getDescription({ [knobs.roomCondition]: conditions.average })).stringExcludes('condition');
                });
            });

            describe('given a room condition other than average', () => {
                it('should return a description including `in`, the condition, and `condition`', () => {
                    const settings = { [knobs.roomCondition]: conditions.busted };
                    assert(_getDescription(settings)).stringIncludes('in busted condition');
                });
            });
        });
    });
};
