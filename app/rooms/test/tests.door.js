// @ts-check

import door, {
    appendDoorway,
    getRoomDoor,
    lockable,
    probability,
} from '../door.js';

import { directions } from '../../dungeons/map.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('`door`', () => {
        it('should be an object of strings', () => {
            assert(door).isObject();

            const invalidDoor = Object.values(door).find((value) => typeof value !== 'string');
            assert(invalidDoor).isUndefined();
        });
    });

    describe('`appendDoorway`', () => {
        it('should be a set of door types', () => {
            const invalidDoor = [ ...appendDoorway ].find((appendDoor) => !door[appendDoor]);
            assert(invalidDoor).isUndefined();
        });
    });

    describe('`lockable`', () => {
        it('should be a set of door types', () => {
            const invalidDoor = [ ...lockable ].find((lockedDoor) => !door[lockedDoor]);
            assert(invalidDoor).isUndefined();
        });
    });

    describe('`probability`', () => {
        it('should be a probability object', () => {
            assert(probability.description).isString();
            assert(probability.roll).isFunction();
        });
    });

    describe('`secretProbability`', () => {
        it('should be a probability object', () => {
            assert(probability.description).isString();
            assert(probability.roll).isFunction();
        });
    });

    describe('getRoomDoor()', () => {
        describe('given an array with a single room door', () => {
            const dungeonDoors = [
                {
                    connections: {
                        1: { direction: directions.north, to: 2 },
                        2: { direction: directions.south, to: 1 },
                    },
                    locked: false,
                    size: 2,
                    type: door.archway,
                },
            ];

            describe('when the door is not locked', () => {
                it('should return a RoomDoors object with no keys', () => {
                    const roomDoors = getRoomDoor(dungeonDoors);
                    assert(roomDoors.keys).equalsArray([]);
                });

                it('should return a RoomDoors object with a doors lookup', () => {
                    const roomDoors = getRoomDoor(dungeonDoors).doors;

                    assert(roomDoors).equalsObject({
                        1: [ { ...dungeonDoors[0], connection: { direction: directions.north, to: 2 } } ],
                        2: [ { ...dungeonDoors[0], connection: { direction: directions.south, to: 1 } } ],
                    });
                });
            });

            describe('when the door is locked', () => {
                const lockedDungeonDoors = { ...dungeonDoors };

                lockedDungeonDoors[0].locked = true;
                lockedDungeonDoors[0].type = door.wooden;

                it('should return a RoomDoors object with an array of Keys', () => {
                    const roomDoorKeys = getRoomDoor(dungeonDoors).keys;

                    assert(roomDoorKeys[0]).equalsObject({
                        type: door.wooden,
                        connections: {
                            1: { direction: directions.north, to: 2 },
                            2: { direction: directions.south, to: 1 },
                        },
                    });
                });
            });
        });
    });
};
