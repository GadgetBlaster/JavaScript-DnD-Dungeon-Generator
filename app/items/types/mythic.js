// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

const defaults = {
    rarity: rarity.rare,
    type  : type.mythic,
};

const config = [
    { name: 'Arcane focus', variants: [ 'crystal', 'orb', 'rod', 'staff', 'wand' ] },
    { name: 'Druidic focus' },
    { name: 'Holy symbol', variants: [ 'amulet', 'emblem', 'reliquary' ] },
    { name: 'Yew wand' },
    { name: 'Spellbook' },
];

export default config.map((item) => ({ ...defaults, ...item }));
