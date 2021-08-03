// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

let { abundant, common, average, uncommon } = rarity;

const defaults = {
    rarity: abundant,
    type  : type.kitchen,
};

const config = [
    { name: 'Basin' },
    { name: 'Cauldron', rarity: average },
    { name: 'Cutting board' },
    { name: 'Fork' },
    { name: 'Kitchen knife' },
    { name: 'Ladle', rarity: common },
    { name: 'Mess kit' },
    { name: 'Pan, iron' },
    { name: 'Pot, iron' },
    { name: 'Soap', rarity: uncommon },
    { name: 'Spoon' },
    { name: 'Steak knife' },
    { name: 'Tub' },
];

export default config.map((item) => ({ ...defaults, ...item }));
