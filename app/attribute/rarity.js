// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Types --------------------------------------------------------------------

/** @typedef {typeof rarity[number]} Rarity */

// -- Config -------------------------------------------------------------------

const rarity = Object.freeze(/** @type {const} */ ([
    'abundant',
    'common',
    'average',
    'uncommon',
    'rare',
    'exotic',
    'legendary',
]));

let rarityTmp = rarity.reduce((obj, rarity) => {
    obj[rarity] = rarity;
    return obj;
}, {});

export default rarityTmp;

// deprecated TODO remove
export const list = rarity;
export const rarities = rarity;

/**
 * Indicate rarity
 *
 * @type {Set<Rarity>}
 */
export const indicateRarity = new Set([
    'exotic',
    'legendary',
    'rare',
    'uncommon',
]);

export const probability = createProbability([
    [ 25,  'abundant'  ],
    [ 45,  'common'    ],
    [ 65,  'average'   ],
    [ 80,  'uncommon'  ],
    [ 93,  'rare'      ],
    [ 99,  'exotic'    ],
    [ 100, 'legendary' ],
]);
