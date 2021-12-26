// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Types --------------------------------------------------------------------

/** @typedef {typeof rarities[number]} Rarity */

// -- Config -------------------------------------------------------------------

export const rarities = Object.freeze(/** @type {const} */ ([
    'abundant',
    'common',
    'average',
    'uncommon',
    'rare',
    'exotic',
    'legendary',
]));

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
