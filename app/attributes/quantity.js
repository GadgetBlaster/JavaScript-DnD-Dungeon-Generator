
import { Probability } from '../utility/roll';

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

export const list = Object.keys(quantity);

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

export const probability = new Probability([
    [ 5,   zero     ],
    [ 10,  one      ],
    [ 20,  couple   ],
    [ 30,  few      ],
    [ 50,  some     ],
    [ 65,  several  ],
    [ 96,  many     ],
    [ 100, numerous ],
]);

const range = [ 0, 1, 2, 3, 5, 7, 13, 26, 99 ];

export const getRange = (value) => {
    let index = list.indexOf(value);

    if (index === -1) {
        throw `Invalid quantity value: ${value}`;
    }

    let min = range[index];
    let max = (range[index + 1] - 1);

    return { min, max };
};
