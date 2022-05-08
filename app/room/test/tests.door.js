// @ts-check

import {
    // Config
    appendDoorway,
    appendPassage,
    doorTypes,
    lockable,
    probability,
    secretProbability,

    // Private Functions
    getRoomDoors,
} from '../door.js';

/** @typedef {import('../../dungeon/map.js').Door} Door */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('appendDoorway', () => {
        it('should be a set of door types', () => {
            const invalidDoor = [ ...appendDoorway ].find((door) => !doorTypes.includes(door));
            assert(invalidDoor).isUndefined();
        });
    });

    describe('appendPassage', () => {
        it('should be a set of door types', () => {
            const invalidDoor = [ ...appendPassage ].find((door) => !doorTypes.includes(door));
            assert(invalidDoor).isUndefined();
        });
    });

    describe('doorTypes', () => {
        it('should be an array of strings', () => {
            assert(doorTypes).isArray();

            const invalidDoor = Object.values(doorTypes).find((value) => typeof value !== 'string');
            assert(invalidDoor).isUndefined();
        });
    });

    describe('lockable', () => {
        it('should be a set of door types', () => {
            const invalidDoor = [ ...lockable ].find((door) => !doorTypes.includes(door));
            assert(invalidDoor).isUndefined();
        });
    });

    describe('probability', () => {
        it('should be a probability object', () => {
            assert(probability.description).isString();
            assert(probability.roll).isFunction();
        });
    });


    describe('probability', () => {
        it('should be a probability object', () => {
            assert(probability.description).isString();
            assert(probability.roll).isFunction();
        });
    });

    describe('secretProbability', () => {
        it('should be a probability object', () => {
            assert(secretProbability.description).isString();
            assert(secretProbability.roll).isFunction();
        });
    });

    // -- Config ---------------------------------------------------------------

    describe('getRoomDoors()', () => {
        describe('given an array with a single room door', () => {
            /** @type {Door[]} */
            const dungeonDoors = [
                {
                    connection: new Map([
                        [ 1, { direction: 'north', to: 2 } ],
                        [ 2, { direction: 'south', to: 1 } ],
                    ]),
                    locked: false,
                    rectangle: { x: 1, y: 1, width: 1, height: 2 },
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
                        connection: new Map([
                            [ 1, { direction: 'north', to: 2 } ],
                            [ 2, { direction: 'south', to: 1 } ],
                        ]),
                    });
                });
            });
        });
    });
};
