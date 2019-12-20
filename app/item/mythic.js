
import rarity from '../attribute/rarity';

const defaults = {
    containers,
    rarity: rarity.rare,
};

const config = [
    { name: 'Arcane focus', variants: [ 'Crystal', 'Orb', 'Rod', 'Staff', 'Wand' ] },
    { name: 'Druidic focus' },
    { name: 'Yew wand' },
];

export default config.map((item) => ({ ...defaults, ...item }));
