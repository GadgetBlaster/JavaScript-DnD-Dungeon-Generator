// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

let { rare } = rarity;

const defaults = {
    rarity: rare,
    type  : type.mysterious,
};

const config = [
    { name: 'Mysterious object' },
];

export default config.map((item) => ({ ...defaults, ...item }));
