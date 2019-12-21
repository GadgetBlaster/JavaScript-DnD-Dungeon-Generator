
import rarity from '../../attributes/rarity';
import type from '../type';

const defaults = {
    rarity: rarity.rare,
    type: type.mythic,
};

const config = [
    { name: 'Arcane focus', variants: [ 'Crystal', 'Orb', 'Rod', 'Staff', 'Wand' ] },
    { name: 'Druidic focus' },
    { name: 'Holy symbol', variants: [ 'Amulet', 'Emblem', 'Reliquary' ] },
    { name: 'Yew wand' },
    { name: 'Spellbook' },
];

export default config.map((item) => ({ ...defaults, ...item }));
