// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';
import size from '../../attributes/size.js';

let { uncommon, rare } = rarity;

const defaults = {
    rarity: uncommon,
    type  : type.armor,
    size  : size.medium,
};

const config = [
    { name: 'Breastplate', rarity: rare },
    { name: 'Chain mail', rarity: rare },
    { name: 'Chain shirt' },
    { name: 'Half plate armor', rarity: rare },
    { name: 'Hide armor' },
    { name: 'Leather armor' },
    { name: 'Padded armor' },
    { name: 'Plate armor', rarity: rare },
    { name: 'Ring mail armor' },
    { name: 'Scale mail armor' },
    { name: 'Shield' },
    { name: 'Splint armor', rarity: rare },
    { name: 'Studded leather armor' },
];

export default config.map((item) => ({ ...defaults, ...item }));
