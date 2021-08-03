// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

const defaults = {
    rarity: rarity.rare,
    type  : type.potion,
};

const config = [
    { name: 'Potion of healing' },
];

export default config.map((item) => ({ ...defaults, ...item }));
