// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

let {
    common,
    exotic,
    rare,
    uncommon,
} = rarity;

const defaults = {
    quantity: 100,
    type    : type.coin,
    rarity  : uncommon,
};

const config = [
    { name: 'Copper piece', rarity: common },
    { name: 'Silver piece' },
    { name: 'Electrum piece', rarity: exotic },
    { name: 'Gold piece', rarity: rare },
    { name: 'Platinum piece', rarity: exotic },
];

export default config.map((item) => ({ ...defaults, ...item }));
