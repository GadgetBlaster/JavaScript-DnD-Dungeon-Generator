// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

let { uncommon } = rarity;

const defaults = {
    rarity: uncommon,
    type  : type.tack,
};

const config = [
    { name: 'Barding', variants: [ 'chain', 'plage', 'scabb' ] },
    { name: 'Bit and bridle' },
    { name: 'Carriage' },
    { name: 'Cart' },
    { name: 'Chariot' },
    { name: 'Feed' },
    { name: 'Saddle', variants: [ 'Exotic', 'Military', 'Pack', 'Riding' ] },
    { name: 'Saddlebags' },
];

export default config.map((item) => ({ ...defaults, ...item }));
