// @ts-check

import { capitalize, listSentence, toss } from '../utility/tools.js';
import { roll, rollPercentile, rollArrayItem } from '../utility/roll.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */

// -- Config -------------------------------------------------------------------

/**
 * Percentile chance to include a vegetation description with a room.
 *
 * @type {number}
 */
const vegetationChance = 60;

/**
 * Maximum number of vegetation for a room.
 *
 * @type {number}
 */
const maxVegetation = 3;

/**
 * Vegetation types
 */
export const vegetation = {
    ferns    : 'ferns',
    flowers  : 'flowers',
    grass    : 'grass',
    moss     : 'moss',
    mushrooms: 'mushrooms',
    roots    : 'roots',
    vines    : 'vines',
};

// -- Private Functions --------------------------------------------------------

/**
 * Get vegetation description
 *
 * @private
 * @throws
 *
 * @param {string} type
 * @param {object} [options]
 *     @param {boolean} [options.variation = true | false]
 *
 * @returns {string}
 */
function getDescription(type, { variation = Boolean(roll()) } = {}) {
    switch (type) {
        case vegetation.ferns:
        case vegetation.flowers: {
            let description = variation
                ? 'are somehow growing here'
                : 'are growing from cracks in the walls';

            return `${type} ${description}`;
        }

        case vegetation.grass:
            return variation
                ? 'grass pokes through cracks in the floor'
                : 'patches of grass decorate the ground';

        case vegetation.moss:
            return variation
                ? 'moss covers the entire room'
                : 'damp moss clings to the walls';

        case vegetation.mushrooms:
            return variation
                ? 'glowing mushrooms illuminate your surroundings'
                : 'strange mushrooms are scattered about';

        case vegetation.roots:
            return variation
                ? 'roots push through the walls and ceiling'
                : 'roots disrupt the ground';

        case vegetation.vines:
            return `vines ${variation ? 'cover' : 'cling to'} the walls`;

        default:
            toss('Invalid vegetation type');
    }
}

export {
    getDescription as testGetDescription,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generate vegetation description
 *
 * TODO extract noop to caller
 * TODO rename to getRoomVegetation()
 * TODO hook up room settings
 *
 * @param {DungeonConfig | RoomConfig} config
 * @param {object} [options]
 *     @param {number} [options.count = number]
 *
 * @returns {string}
 */
export function getVegetationDescription(config, { count = roll(1, maxVegetation) } = {}) {
    if (!rollPercentile(vegetationChance)) {
        return;
    }

    if (count < 1 || count > maxVegetation) {
        throw new TypeError('Invalid vegetation count');
    }

    let types = new Set();

    for (let i = 0; i < count; i++) {
        types.add(rollArrayItem(Object.keys(vegetation)));
    }

    let roomVegetation = [ ...types ].map((type) => getDescription(type));

    return capitalize(listSentence(roomVegetation));
}
