
import { Probability } from '../utility/roll';

const quantity = {
    zero: 'zero',
    one: 'one',
    couple: 'couple',
    few: 'few',
    some: 'some',
    several: 'several',
    many: 'many',
    numerous: 'numerous',
};

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
    [ 10, zero ],
    [ 20, one ],
    [ 30, couple ],
    [ 40, few ],
    [ 70, some ],
    [ 85, several ],
    [ 95, many ],
    [ 100, numerous ],
]);

export const list = Object.keys(quantity);

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

export default quantity;
