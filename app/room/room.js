// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../utility/roll.js').Probability} Probability */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof roomTypes[number]} RoomType */
/** @typedef {"hallway" | "room" | "random"} RoomTypeProbabilities */

// -- Config -------------------------------------------------------------------

export const roomTypes = Object.freeze(/** @type {const} */ ([
    'armory',
    'atrium',
    'ballroom',
    'bathhouse',
    'bedroom',
    'chamber',
    'dining',
    'dormitory',
    'greatHall',
    'hallway',
    'kitchen',
    'laboratory',
    'library',
    'pantry',
    'parlour',
    'prison',
    'room',
    'shrine',
    'smithy',
    'storage',
    'study',
    'throne',
    'torture',
    'treasury',
]));

/**
 * Set of room types that should have the word "room" appended to their
 * descriptions.
 *
 * @type {Set<RoomType>}
 */
export const appendRoomTypes = new Set([
    'dining',
    'shrine',
    'storage',
    'throne',
    'torture',
]);

/**
 * Probability distribution table of room types.
 *
 * @type {Pick<Probability, "description"> & {
 *   roll: () => RoomTypeProbabilities;
 * }}
 */
export const probability = createProbability([
    [ 40,  'hallway' ],
    [ 65,  'room'    ],
    [ 100, 'random'  ],
]);
