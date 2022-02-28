// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../dungeon/map.js').Connection} Connection */
/** @typedef {import('../dungeon/map.js').Connections} Connections */
/** @typedef {import('../dungeon/map.js').Door} Door */
/** @typedef {import('../dungeon/map.js').Doors} Doors */
/** @typedef {import('../utility/roll.js').Probability} Probability */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof doorTypes[number]} DoorType */

/**
 * @typedef {Object} DoorKey
 *
 * @prop {Connections} connections
 * @prop {string} type - Door type
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
 * Returns an array of room doors and keys.
 *
 * TODO move to generate.js
 *
 * @param {Door[]} doors
 *
 * @returns {{
 *     keys: DoorKey[];
 *     doors: Doors;
 * }}
 */
export function getRoomDoors(doors) {
    /** @type {Doors} */
    let roomDoors = {};

    /** @type {DoorKey[]} */
    let roomKeys  = [];

    doors.forEach((door) => {
        Object.keys(door.connections).forEach((roomNumber) => {
            if (!roomDoors[roomNumber]) {
                roomDoors[roomNumber] = [];
            }

            if (door.locked) {
                roomKeys.push({
                    type: door.type,
                    connections: door.connections,
                });
            }

            roomDoors[roomNumber].push(door);
        });
    });

    return {
        keys: roomKeys,
        doors: roomDoors,
    };
}
