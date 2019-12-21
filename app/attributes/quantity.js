
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

const range = [ 0, 1, 2, 3, 5, 7, 13, 26, 99 ];

export const list = Object.values(quantity);

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
