// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

const defaults = {
    rarity: rarity.abundant,
    type: type.clothing,
};

const config = [
    { name: 'Belt' },
    { name: 'Boots', variants: [ 'riding', 'soft', 'combat' ] },
    { name: 'Breaches' },
    { name: 'Brooch' },
    { name: 'Cap' },
    { name: 'Cape', variants: [ 'cotton', 'canvas', 'fur', 'silk' ] },
    { name: 'Cloak', variants: [ 'cotton', 'canvas', 'fur', 'silk' ] },
    { name: 'Clothes, set', variants: [ 'common', 'costume', 'fine', 'traveler’s' ] },
    { name: 'Gloves' },
    { name: 'Gown' },
    { name: 'Hat' },
    { name: 'Hose' },
    { name: 'Jacket', variants: [ 'leather', 'fur', 'silk' ] },
    { name: 'Mittens' },
    { name: 'Robes', variants: [ 'common', 'embroidered' ] },
    { name: 'Sandals' },
    { name: 'Sash' },
    { name: 'Shoes' },
    { name: 'Surcoat' },
    { name: 'Tunic' },
    { name: 'Vest', variants: [ 'leather', 'fur', 'silk' ]  },
];

export default config.map((item) => ({ ...defaults, ...item }));
