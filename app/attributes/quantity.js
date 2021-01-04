
import { createProbability } from '../utility/roll.js';

const quantity = {
    zero    : 'zero',
    one     : 'one',
    couple  : 'couple',
    few     : 'few',
    some    : 'some',
    several : 'several',
    many    : 'many',
    numerous: 'numerous',
};

export default quantity;

export const list = Object.keys(quantity); // deprecated TODO remove
export const quantities = Object.values(quantity);

let {
    zero,
    one,
    couple,
    few,
    some,
    several,
    many,
    numerous,
} = quantity;

export const probability = createProbability([
    [ 5,   zero     ],
    [ 10,  one      ],
    [ 15,  couple   ],
    [ 20,  few      ],
    [ 40,  some     ],
    [ 65,  several  ],
    [ 96,  many     ],
    [ 100, numerous ],
]);

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

export const quantityMaximum = 100;

const range = [ ...Object.values(quantityMinimum), quantityMaximum ];

export const getRange = (value) => {
    let index = list.indexOf(value);

    if (index === -1) {
        throw new TypeError(`Invalid quantity, ${value}`);
    }

    let min = range[index];
    let max = (range[index + 1] - 1);

    return { min, max };
};
