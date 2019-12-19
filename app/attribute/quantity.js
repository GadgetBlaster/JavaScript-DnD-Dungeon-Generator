
import { lookup } from '/app/utility/config';

export const quantities = [
    'zero',
    'one',
    'couple',
    'few',
    'some',
    'several',
    'many',
    'numerous',
];

export const quantity = lookup(quantities);

const range = [ 0, 1, 2, 3, 5, 7, 13, 26, 99 ];

export const getRange = (value) => {
    let index = quantities.indexOf(value);

    if (index === -1) {
        throw `Invalid quantity value: ${value}`;
    }

    let min = range[index];
    let max = (range[index + 1] - 1);

    return { min, max };
};

console.log(quantity.one);

// export const list = (() => {
//     console.log('once');
//     return Object.keys(quantity)
// })();
