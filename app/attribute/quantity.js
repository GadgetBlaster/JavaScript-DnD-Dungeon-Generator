// @ts-check

import { createProbability } from '../utility/roll.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../utility/tools.js').NumberRange} NumberRange */

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
 * Minimum count of items for each quantity.
 *
 * @type {{ [quantity in Quantity]?: number }}
 */
export const quantityMinimum = {
    zero    : 0,
    one     : 1,
    couple  : 2,
    few     : 3,
    some    : 5,
    several : 8,
    many    : 14,
    numerous: 25,
};

/** Maximum count of items for the "numerous" quantity. */
export const quantityMaximum = 100;

const range = [ ...Object.values(quantityMinimum), quantityMaximum ];


// TODO: WIP to replace getRange()
export const quantityRanges = Object.entries({
    zero    : 0,
    one     : 1,
    couple  : 2,
    few     : 3,
    some    : 7,
    several : 13,
    many    : 25,
    numerous: 100,
}).reduce((ranges, [ quantity, max ], i, entries) => {
    let [ , prevMax ] = entries[i - 1] || [ 'zero', 0 ];
    let min = Math.min(prevMax + 1, max);

    ranges[quantity] = { min, max };

    return ranges;
}, {});

console.log(quantityRanges);

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a numerical range for the given quantity.
 *
 * @param {Quantity} value
 *
 * @returns {NumberRange}
 */
export const getRange = (value) => {
    let index = quantities.indexOf(value);

    if (index === -1) {
        // TODO toss()
        throw new TypeError(`Invalid quantity "${value}" in getRange()`);
    }

    let min = range[index];
    let max = (range[index + 1] - 1);

    return { min, max };
};
