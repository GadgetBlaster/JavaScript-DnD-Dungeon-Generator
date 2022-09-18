// @ts-check

import { createProbability } from '../utility/roll.js';

// TODO move to dungeon/*

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../dungeon/map.js').Connection} Connection */
/** @typedef {import('../dungeon/map.js').Door} Door */
/** @typedef {import('../dungeon/map.js').DungeonDoors} DungeonDoors */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof doorTypes[number]} DoorType */

/**
 * @typedef {Object} DoorKey
 *
 * @prop {Connection} connect
 * @prop {DoorType} type
 */

/** @typedef {() => DoorType} RollDoorType */
/** @typedef {() => "concealed" | "secret" | undefined} RollSecretDoorType */

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
 * Set of door types that should have "doorway" appended to their descriptions.
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
 * Set of door types that should have "passage" appended to their descriptions.
 *
 * @type {Set<DoorType>}
 */
export const appendPassage = new Set([
    'concealed',
    'secret',
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
 * Door type probability.
 *
 * @type {Readonly<{
 *   description: string;
 *   roll: RollDoorType;
 * }>}
 */
export const probability = createProbability(new Map([
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
]));

/**
 * Secret door type probability.
 *
 * @type {Readonly<{
 *   description: string;
 *   roll: RollSecretDoorType;
 * }>}
 */
export const secretProbability = createProbability(new Map([
    [ 15, 'concealed' ],
    [ 30, 'secret'    ],
]));

/**
 * Percentile chance that a lockable door will be locked.
 */
export const lockedChance = 25;

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an array of DoorKey objects for the given doors.
 *
 * TODO move to generate.js
 * TODO tests
 *
 * @param {Door[]} doors
 *
 * @returns {DoorKey[]}
 */
export function getDoorKeys(doors) {
    /** @type {DoorKey[]} */
    let doorKeys = [];

    doors.forEach((door) => {
        if (door.locked) {
            doorKeys.push({
                type: door.type,
                connect: door.connect,
            });
        }
    });

    return doorKeys;
}

/**
 * Returns a lookup of Doors keyed by room number.
 *
 * TODO move to generate.js
 *
 * @param {Door[]} doors
 *
 * @returns {DungeonDoors}
 */
export function getDoorsByRoomNumber(doors) {
    /** @type {DungeonDoors} */
    let roomDoors = {};

    doors.forEach((door) => {
        Object.keys(door.connect).forEach((roomNumber) => {
            if (!roomDoors[roomNumber]) {
                roomDoors[roomNumber] = [];
            }

            roomDoors[roomNumber].push(door);
        });
    });

    return roomDoors;
}
