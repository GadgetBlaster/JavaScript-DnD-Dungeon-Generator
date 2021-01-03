
import door, {
    appendDoorway,
    getRoomDoor,
    lockable,
    probability,
} from '../door.js';

import { directions } from '../../dungeons/map.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('`appendDoorway`', () => {
        it('should be a set of door types', () => {
            let invalidDoor = [ ...appendDoorway ].find((appendDoor) => !door[appendDoor]);
            assert(invalidDoor).isUndefined();
        });
    });

    describe('`lockable`', () => {
        it('should be a set of door types', () => {
            let invalidDoor = [ ...lockable ].find((lockedDoor) => !door[lockedDoor]);
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
            let dungeonDoors = [
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
                    let roomDoors = getRoomDoor(dungeonDoors);
                    assert(roomDoors.keys).equalsArray([]);
                });

                it('should return a RoomDoors object with a doors lookup', () => {
                    let roomDoors = getRoomDoor(dungeonDoors).doors;

                    assert(roomDoors).equalsObject({
                        1: [ { ...dungeonDoors[0], connection: { direction: directions.north, to: 2 } } ],
                        2: [ { ...dungeonDoors[0], connection: { direction: directions.south, to: 1 } } ],
                    });
                });
            });

            describe('when the door is locked', () => {
                let lockedDungeonDoors = { ...dungeonDoors };
                lockedDungeonDoors[0].locked = true;
                lockedDungeonDoors[0].type = door.wooden;

                it('should return a RoomDoors object with an array of Keys', () => {
                    let roomDoorKeys = getRoomDoor(dungeonDoors).keys;

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
