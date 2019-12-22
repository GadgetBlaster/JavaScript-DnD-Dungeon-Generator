
import { Probability } from '../utility/roll';

const rarity = {
    abundant: 'abundant',
    common: 'common',
    average: 'average',
    uncommon: 'uncommon',
    rare: 'rare',
    exotic: 'exotic',
    legendary: 'legendary',
};

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
    [ 30, abundant ],
    [ 55, common ],
    [ 75, average ],
    [ 85, uncommon ],
    [ 93, rare ],
    [ 98, exotic ],
    [ 100, legendary ],
]);

export const list = Object.values(rarity);

export default rarity;
