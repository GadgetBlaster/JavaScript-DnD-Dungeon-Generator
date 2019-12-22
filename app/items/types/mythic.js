
import rarity from '../../attributes/rarity';
import type from '../type';

const defaults = {
    rarity: rarity.rare,
    type: type.mythic,
};

const config = [
    { name: 'Arcane focus', variants: [ 'crystal', 'orb', 'rod', 'staff', 'wand' ] },
    { name: 'Druidic focus' },
    { name: 'Holy symbol', variants: [ 'amulet', 'emblem', 'reliquary' ] },
    { name: 'Yew wand' },
    { name: 'Spellbook' },
];

export default config.map((item) => ({ ...defaults, ...item }));
