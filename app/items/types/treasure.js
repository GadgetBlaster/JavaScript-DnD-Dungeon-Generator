// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

let { legendary } = rarity;

const defaults = {
    rarity: legendary,
    type  : type.treasure,
};

const config = [
    { name: 'Treasure' }, // TODO more treasure types
];

export default config.map((item) => ({ ...defaults, ...item }));
