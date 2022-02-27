// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../dungeon/map.js').Connection} Connection */
/** @typedef {import('../utility/roll.js').Probability} Probability */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof doorTypes[number]} DoorType */

/**
 * TODO RoomDoor
 */

/**
 * @typedef {Object} DoorKey
 *
 * @prop {{ [key: number]: Connection }} connections
 * @prop {string} type - Door type
 */

/**
 * @typedef {object} RoomDoors
 *
 * @prop {DoorKey[]} keys
 * @prop {{ [key: number]: RoomDoor[] }} doors
 */

// -- Config -------------------------------------------------------------------

export const doorTypes = Object.freeze(/** @type {const} */ ([
    'archway',
    'brass',
    'concealed',
    'hole',
    'iron',
    'mechanical',
    'passageway',
    'portal',
    'portcullis',
    'secret',
    'steel',
    'stone',
    'wooden',
]));

// TODO Move to directions?
export const outside = 'outside';

/**
 * Set of doorway types that should have "doorway" appended to their
 * description.
 *
 * @type {Set<DoorType>}
 */
export const appendDoorway = new Set([
    'brass',
    'iron',
    'mechanical',
    'steel',
    'stone',
    'wooden',
]);

/**
 * Set of doorway types that can be locked and hae an associated key.
 *
 * @type {Set<DoorType>}
 */
export const lockable = new Set([
    'brass',
    'iron',
    'mechanical',
    'portcullis',
    'steel',
    'stone',
    'wooden',
]);

/**
 * Probability distribution table of door types.
 */
export const probability = createProbability([
    [ 20,  'passageway' ],
    [ 40,  'archway'    ],
    [ 55,  'hole'       ],
    [ 60,  'mechanical' ],
    [ 65,  'portcullis' ],
    [ 75,  'wooden'     ],
    [ 80,  'steel'      ],
    [ 85,  'iron'       ],
    [ 90,  'brass'      ],
    [ 95,  'stone'      ],
    [ 100, 'portal'     ],
]);

/**
 * Probability distribution table for secret doors.
 */
export const secretProbability = createProbability([
    [ 15, 'concealed' ],
    [ 30, 'secret'    ],
]);

/**
 * Percentile chance that a lockable door will be locked.
 */
export const lockedChance = 25;

// -- Public Functions ---------------------------------------------------------

/**
 * Get room door
 *
 * TODO rename to plural & simplify?
 *
 * @param {RoomDoor[]} doors
 *
 * @returns {RoomDoors}
 */
export function getRoomDoor(doors) {
    let lookup = {};
    let keys   = [];

    doors.forEach((door) => {
        Object.keys(door.connections).forEach((roomNumber) => {
            if (!lookup[roomNumber]) {
                lookup[roomNumber] = [];
            }

            let roomDoor = {
                // TODO safe to drop unnecessary `connections` from config?
                // Is it already there?
                ...door,
                connection: door.connections[roomNumber],
            };

            if (door.locked) {
                keys.push({
                    type: door.type,
                    connections: door.connections,
                });
            }

            lookup[roomNumber].push(roomDoor);
        });
    });

    return {
        keys,
        doors: lookup, // TODO
    };
}
