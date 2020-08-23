
import { createProbability } from '../utility/roll.js';

const rarity = {
    abundant : 'abundant',
    common   : 'common',
    average  : 'average',
    uncommon : 'uncommon',
    rare     : 'rare',
    exotic   : 'exotic',
    legendary: 'legendary',
};

export default rarity;

export const list = Object.keys(rarity); // deprecated TODO remove
export const rarities = Object.values(rarity);

/**
 * Indicate rarity
 *
 * @type {Set<string>}
 */
export const indicateRarity = new Set([
    rarity.exotic,
    rarity.legendary,
    rarity.rare,
    rarity.uncommon,
]);

let {
    abundant,
    common,
    uncommon,
    average,
    rare,
    exotic,
    legendary,
} = rarity;

export const probability = createProbability([
    [ 25,  abundant  ],
    [ 45,  common    ],
    [ 65,  average   ],
    [ 80,  uncommon  ],
    [ 93,  rare      ],
    [ 99,  exotic    ],
    [ 100, legendary ],
]);
