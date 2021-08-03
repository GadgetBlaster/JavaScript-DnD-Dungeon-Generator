// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';
import size from '../../attributes/size.js';

let { tiny } = size;

const defaults = {
    rarity: rarity.uncommon,
    type: type.chancery,
};

const config = [
    { name: 'Abacus', rarity: rarity.rare },
    { name: 'Book', rarity: rarity.common },
    { name: 'Chalk', size: tiny },
    { name: 'Hourglass', rarity: rarity.rare },
    { name: 'Ink pen', size: tiny },
    { name: 'Ink', size: tiny, variants: [ 'vial', 'bottle' ] },
    { name: 'Journal', variants: [ 'blank', 'adventurer’s', 'noble person’s', 'hermit’s', 'wizard’s', 'merchant’s' ] },
    { name: 'Letter opener', size: tiny },
    { name: 'Paper', quantity: 100 },
    { name: 'Paperweight', size: tiny },
    { name: 'Parchment', quantity: 100 },
    { name: 'Pencil', size: tiny },
    { name: 'Scale, merchant’s', rarity: rarity.rare },
    { name: 'Scroll', size: tiny, rarity: rarity.common },
    { name: 'Sealing wax', size: tiny },
    { name: 'Signet ring', size: tiny },
    { name: 'Wax seal', size: tiny },
];

export default config.map((item) => ({ ...defaults, ...item }));
