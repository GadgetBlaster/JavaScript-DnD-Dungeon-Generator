// @ts-check

import { capitalize, sentenceList, toss } from '../utility/tools.js';
import { roll, rollPercentile, rollArrayItem } from '../utility/roll.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('./generate.js').RandomizedRoomConfig} RandomizedRoomConfig */

// -- Type Imports -------------------------------------------------------------

/** @typedef {typeof vegetationType[number]} VegetationType */

// -- Config -------------------------------------------------------------------

/** Percentile chance to include a vegetation description with a room. */
const vegetationChance = 60;

/** Maximum number of vegetation for a room. */
const maxVegetation = 3;

export const vegetationType = Object.freeze(/** @type {const} */ ([
    'ferns',
    'flowers',
    'grass',
    'moss',
    'mushrooms',
    'roots',
    'vines',
]));

// -- Private Functions --------------------------------------------------------

/**
 * Get vegetation description
 *
 * @private
 * @throws
 *
 * @param {VegetationType} type
 * @param {object} [options]
 *     @param {boolean} [options.variation = true | false]
 *
 * @returns {string}
 */
function getDescription(type, { variation = Boolean(roll()) } = {}) {
    switch (type) {
        case 'ferns':
        case 'flowers': {
            let description = variation
                ? 'are somehow growing here'
                : 'are growing from cracks in the walls';

            return `${type} ${description}`;
        }

        case 'grass':
            return variation
                ? 'grass pokes through cracks in the floor'
                : 'patches of grass decorate the ground';

        case 'moss':
            return variation
                ? 'moss covers the entire room'
                : 'damp moss clings to the walls';

        case 'mushrooms':
            return variation
                ? 'glowing mushrooms illuminate your surroundings'
                : 'strange mushrooms are scattered about';

        case 'roots':
            return variation
                ? 'roots push through the walls and ceiling'
                : 'roots disrupt the ground';

        case 'vines':
            return `vines ${variation ? 'cover' : 'cling to'} the walls`;

        default:
            toss(`Invalid vegetation type "${type}" in getDescription()`);
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
 * TODO hook up room settings
 *
 * @param {RandomizedRoomConfig} config
 * @param {object} [options]
 *     @param {number} [options.count = number]
 *
 * @returns {string}
 */
export function getRoomVegetationDescription(config, { count = roll(1, maxVegetation) } = {}) {
    if (!rollPercentile(vegetationChance)) {
        return;
    }

    if (count < 1 || count > maxVegetation) {
        throw new TypeError('Invalid vegetation count');
    }

    let types = new Set();

    for (let i = 0; i < count; i++) {
        types.add(rollArrayItem(vegetationType));
    }

    let roomVegetation = [ ...types ].map((type) => getDescription(type));

    return capitalize(sentenceList(roomVegetation));
}
