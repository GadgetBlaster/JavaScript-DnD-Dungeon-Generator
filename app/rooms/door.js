
import { createProbability } from '../utility/roll.js';

/**
 * Key
 *
 * @typedef {Object} Key
 *
 * @property {Object<number, Connection>} connections
 * @property {string} type - Door type
 */

/**
 * Room door
 *
 * @typedef {object} RoomDoors
 *
 * @property {Key[]} keys
 * @property {object.<number, Door[]>} doors
 */

/**
 * @typedef {import('../dungeons/map.js').Door} Door
 * @typedef {import('../utility/roll.js').Probability} Probability
 */

// -- Config -------------------------------------------------------------------

/**
 * Door types
 */
const door = {
    archway   : 'archway',
    brass     : 'brass',
    concealed : 'concealed',
    hole      : 'hole',
    iron      : 'iron',
    mechanical: 'mechanical',
    passageway: 'passageway',
    portal    : 'portal',
    portcullis: 'portcullis',
    secret    : 'secret',
    steel     : 'steel',
    stone     : 'stone',
    wooden    : 'wooden',
};

export default door;

export const list = Object.keys(door);

// TODO Move to directions?
export const outside = 'outside';

/**
 * Set of doorway types that should have "doorway" appended to their
 * description.
 *
 * @type {Set<string>}
 */
export const appendDoorway = new Set([
    door.brass,
    door.iron,
    door.mechanical,
    door.steel,
    door.stone,
    door.wooden,
]);

/**
 * Set of doorway types that can be locked and hae an associated key.
 *
 * @type {Set<string>}
 */
export const lockable = new Set([
    door.brass,
    door.iron,
    door.mechanical,
    door.portcullis,
    door.steel,
    door.stone,
    door.wooden,
]);

/**
 * Probability distribution table of door types.
 *
 * @type {Probability}
 */
export const probability = createProbability([
    [ 20,  door.passageway ],
    [ 40,  door.archway    ],
    [ 55,  door.hole       ],
    [ 60,  door.mechanical ],
    [ 65,  door.portcullis ],
    [ 75,  door.wooden     ],
    [ 80,  door.steel      ],
    [ 85,  door.iron       ],
    [ 90,  door.brass      ],
    [ 95,  door.stone      ],
    [ 100, door.portal     ],
]);

/**
 * Probability distribution table for secret doors.
 *
 * @type {Probability}
 */
export const secretProbability = createProbability([
    [ 15, door.concealed ],
    [ 30, door.secret    ],
]);

/**
 * Percentile chance that a lockable door will be locked.
 *
 * @type {number}
 */
export const lockedChance = 25;

// -- Public Functions ---------------------------------------------------------

/**
 * Get room door
 *
 * TODO rename & simplify?
 *
 * @param {import('../dungeons/map.js').Door[]}
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
                    connections: door.connections
                });
            }

            lookup[roomNumber].push(roomDoor);
        });
    });

    return {
        keys,
        doors: lookup,
    };
}
