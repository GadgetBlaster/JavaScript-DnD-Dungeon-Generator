
import rarity from '../attribute/rarity';

const defaults = { 
    rarity: rarity.uncommon,
};

const config = [
    { name: 'Abacus', rarity: rarity.rare },
    { name: 'Book', rarity: rarity.common },
    { name: 'Journal', },
    { name: 'Paperweight', },
    { name: 'Pen', },
    { name: 'Pencil', },
    { name: 'Wax seal', },
    { name: 'Chalk' },
];

export default config.map((item) => ({ ...defaults, ...item }));
