// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Types --------------------------------------------------------------------

/** @typedef {typeof roomTypes[number]} RoomType */

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
]);

/**
 * Set of room types that should have the word "room" appended to their
 * descriptions.
 *
 * @type {{ [key in RoomType]?: string }}
 */
export const customRoomLabels = Object.freeze({
    torture: 'torture chamber',
});

/**
 * Generic room type distribution.
 *
 * @type {{
 *   description: string;
 *   roll: () => "hallway" | "room" | "random";
 * }}
 */
export const probability = createProbability(new Map([
    [ 40,  'hallway' ],
    [ 65,  'room'    ],
    [ 100, 'random'  ],
]));
