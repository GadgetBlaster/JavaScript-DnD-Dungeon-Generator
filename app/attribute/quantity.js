// @ts-check

import { createProbability } from '../utility/roll.js';

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

/**
 * Maximum count of items for the "numerous" quantity.
 */
export const quantityMaximum = 100;

const range = [ ...Object.values(quantityMinimum), quantityMaximum ];

export const getRange = (value) => {
    let index = quantities.indexOf(value);

    if (index === -1) {
        throw new TypeError(`Invalid quantity, ${value}`);
    }

    let min = range[index];
    let max = (range[index + 1] - 1);

    return { min, max };
};
