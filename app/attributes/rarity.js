
import { Probability } from '../utility/roll';

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

export const list = Object.keys(rarity);

let {
    abundant,
    common,
    uncommon,
    average,
    rare,
    exotic,
    legendary,
} = rarity;

export const probability = new Probability([
    [ 25,  abundant  ],
    [ 45,  common    ],
    [ 65,  average   ],
    [ 80,  uncommon  ],
    [ 93,  rare      ],
    [ 99,  exotic    ],
    [ 100, legendary ],
]);
