// @ts-check

import {
    appendDoorway,
    doorTypes,
    getRoomDoors,
    lockable,
    probability,
} from '../door.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('`doorTypes`', () => {
        it('should be an array of strings', () => {
            assert(doorTypes).isArray();

            const invalidDoor = Object.values(doorTypes).find((value) => typeof value !== 'string');
            assert(invalidDoor).isUndefined();
        });
    });

    describe('`appendDoorway`', () => {
        it('should be a set of door types', () => {
            const invalidDoor = [ ...appendDoorway ].find((door) => !doorTypes.includes(door));
            assert(invalidDoor).isUndefined();
        });
    });

    describe('`lockable`', () => {
        it('should be a set of door types', () => {
            const invalidDoor = [ ...lockable ].find((door) => !doorTypes.includes(door));
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

    describe('getRoomDoors()', () => {
        describe('given an array with a single room door', () => {
            const dungeonDoors = [
                {
                    connections: {
                        1: { direction: 'north', to: 2 },
                        2: { direction: 'south', to: 1 },
                    },
                    locked: false,
                    size: 2,
                    type: 'archway',
                },
            ];

            describe('when the door is not locked', () => {
                it('should return a RoomDoors object with no keys', () => {
                    const roomDoors = getRoomDoors(dungeonDoors);
                    assert(roomDoors.keys).equalsArray([]);
                });

                it('should return a RoomDoors object with a doors lookup', () => {
                    const roomDoors = getRoomDoors(dungeonDoors).doors;

                    assert(roomDoors).equalsObject({
                        1: [ dungeonDoors[0] ],
                        2: [ dungeonDoors[0] ],
                    });
                });
            });

            describe('when the door is locked', () => {
                const lockedDungeonDoors = { ...dungeonDoors };

                lockedDungeonDoors[0].locked = true;
                lockedDungeonDoors[0].type   = 'wooden';

                it('should return a RoomDoors object with an array of Keys', () => {
                    const roomDoorKeys = getRoomDoors(dungeonDoors).keys;

                    assert(roomDoorKeys[0]).equalsObject({
                        type: 'wooden',
                        connections: {
                            1: { direction: 'north', to: 2 },
                            2: { direction: 'south', to: 1 },
                        },
                    });
                });
            });
        });
    });
};
