// @ts-check

import {
    // Config
    appendDoorway,
    appendPassage,
    doorTypes,
    lockable,
    probability,
    secretProbability,

    // Public Functions
    getDoorKeys,
    getDoorsByRoomNumber,
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

    // -- Public Functions -----------------------------------------------------

    /** @type {Door[]} */
    const dungeonDoors = [
        {
            connect: {
                0: { direction: 'east', to: 1 },
                1: { direction: 'west', to: 0 },
            },
            locked: false,
            rectangle: { x: 0, y: 8, width: 1, height: 2 },
            type: 'brass',
        },
        {
            connect: {
                1: { direction: 'north', to: 2 },
                2: { direction: 'south', to: 1 },
            },
            locked: true,
            rectangle: { x: 4, y: 9, width: 2, height: 1 },
            type: 'archway',
        },
        {
            connect: {
                1: { direction: 'east', to: 3 },
                3: { direction: 'west', to: 1 },
            },
            locked: true,
            rectangle: { x: 6, y: 7, width: 1, height: 1 },
            type: 'secret',
        },
    ];


    describe('getDoorKeys()', () => {
        describe('given an array of doors', () => {
            it('returns an array of keys for each locked door', () => {
                const keys = getDoorKeys(dungeonDoors);

                assert(keys).equalsArray([
                    {
                        type: dungeonDoors[1].type,
                        connect: dungeonDoors[1].connect,
                    },
                    {
                        type: dungeonDoors[2].type,
                        connect: dungeonDoors[2].connect,
                    },
                ]);
            });
        });
    });

    describe('getDoorsByRoomNumber()', () => {
        describe('given an array of doors', () => {
            describe('when the door is not locked', () => {
                it('should return a DungeonDoors object with Door arrays keyed by room number', () => {
                    const doors = getDoorsByRoomNumber(dungeonDoors);

                    assert(doors).equalsObject({
                        0: [ dungeonDoors[0] ],
                        1: [ dungeonDoors[0], dungeonDoors[1], dungeonDoors[2] ],
                        2: [ dungeonDoors[1] ],
                        3: [ dungeonDoors[2] ],
                    });
                });
            });
        });
    });
};
