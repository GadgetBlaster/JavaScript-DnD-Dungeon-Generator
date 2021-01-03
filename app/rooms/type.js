
import { createProbability } from '../utility/roll.js';
import { random } from '../utility/random.js';

/**
 * Room types
 *
 * @type {object.<string, string>}
 */
const roomTypes = {
    armory    : 'armory',
    atrium    : 'atrium',
    ballroom  : 'ballroom',
    bathhouse : 'bathhouse',
    bedroom   : 'bedroom',
    chamber   : 'chamber',
    dining    : 'dining',
    dormitory : 'dormitory',
    greatHall : 'greatHall',
    hallway   : 'hallway',
    kitchen   : 'kitchen',
    laboratory: 'laboratory',
    library   : 'library',
    pantry    : 'pantry',
    parlour   : 'parlour',
    prison    : 'prison',
    room      : 'room',
    shrine    : 'shrine',
    smithy    : 'smithy',
    storage   : 'storage',
    study     : 'study',
    throne    : 'throne',
    torture   : 'torture',
    treasury  : 'treasury',
};

export default roomTypes;

/**
 * Room type list
 *
 * @type {string[]}
 */
export const list = Object.keys(roomTypes);

/**
 * Set of room types that should have the word "room" appended to their
 * descriptions.
 *
 * @type {Set<string>}
 */
export const appendRoomTypes = new Set([
    roomTypes.dining,
    roomTypes.shrine,
    roomTypes.storage,
    roomTypes.throne,
    roomTypes.torture,
]);

/**
 * Probability distribution table of room types.
 *
 * @type {Probability}
 */
export const probability = createProbability([
    [ 40,  roomTypes.hallway ],
    [ 65,  roomTypes.room    ],
    [ 100, random  ],
]);
