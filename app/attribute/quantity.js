// @ts-check

import { createProbability } from '../utility/roll.js';
import { createRangeLookup } from '../utility/tools.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../utility/tools.js').Range} Range */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof quantities[number]} Quantity */

// -- Config -------------------------------------------------------------------

export const quantities = Object.freeze(/** @type {const} */ ([
    'zero',
    'one',
    'couple',
    'few',
    'some',
    'several',
    'many',
    'numerous',
]));

/**
 * Quantity probability.
 *
 * @type {Readonly<{
 *   description: string;
 *   roll: () => Quantity;
 * }>}
 */
export const probability = createProbability(new Map([
    [ 5,   'zero'     ],
    [ 10,  'one'      ],
    [ 15,  'couple'   ],
    [ 20,  'few'      ],
    [ 40,  'some'     ],
    [ 65,  'several'  ],
    [ 96,  'many'     ],
    [ 100, 'numerous' ],
]));

/**
 * A lookup of range counts for each quantity.
 */
export const quantityRanges = Object.freeze(
    /** @type {{ [quantity in Quantity]: Range }} */ (
        createRangeLookup({
            zero    : 0,
            one     : 1,
            couple  : 2,
            few     : 3,
            some    : 5,
            several : 8,
            many    : 14,
            numerous: 25,
        }, 100)
    )
);
