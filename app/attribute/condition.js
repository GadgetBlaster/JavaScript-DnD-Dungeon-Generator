// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Types --------------------------------------------------------------------

/** @typedef {typeof conditions[number]} Condition */

// -- Config -------------------------------------------------------------------

export const conditions = Object.freeze(/** @type {const} */ ([
    'decaying',
    'busted',
    'poor',
    'average',
    'good',
    'exquisite',
]));

/**
 * Condition probability.
 *
 * @type {Readonly<{
 *   description: string;
 *   roll: () => Condition;
 * }>}
 */
export const probability = createProbability(new Map([
    [ 50,  'average'   ],
    [ 60,  'good'      ],
    [ 75,  'poor'      ],
    [ 85,  'busted'    ],
    [ 95,  'decaying'  ],
    [ 100, 'exquisite' ],
]));
