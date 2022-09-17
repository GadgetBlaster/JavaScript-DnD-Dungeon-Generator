// @ts-check

import { createProbability } from '../utility/roll.js';

// TODO move to dungeon/*

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../dungeon/map.js').Connection} Connection */
/** @typedef {import('../dungeon/map.js').Door} Door */
/** @typedef {import('../dungeon/map.js').RoomDoors} RoomDoors */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof doorTypes[number]} DoorType */

/**
 * @typedef {Object} DoorKey
 *
 * @prop {Connection} connection
 * @prop {string} type - Door type
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
 * Returns a Door lookup keyed by room number and an array of DoorKeys.
 *
 * TODO move to generate.js
 * TODO rework/rename
 *
 * @param {Door[]} doors
 *
 * @returns {RoomDoors}
 */
export function getRoomDoors(doors) {
    /** @type {RoomDoors} */
    let roomDoors = {};

    doors.forEach((door) => {
        [ ...door.connection.keys() ].forEach((roomNumber) => {
            if (!roomDoors[roomNumber]) {
                roomDoors[roomNumber] = [];
            }

            roomDoors[roomNumber].push(door);
        });
    });

    return roomDoors;
}

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
                connection: door.connection,
            });
        }
    });

    return doorKeys;
}
