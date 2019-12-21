
import rarity from '../../attributes/rarity'
import type from '../type';

const defaults = { 
    rarity: rarity.uncommon,
    type: type.chancery,
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
    { name: 'Hourglass' },
    { name: 'Ink', variants: [ 'Vial', 'Bottle' ] },
    { name: 'Ink pen' },
    { name: 'Paper', quantity: 100 },
    { name: 'Parchment', quantity: 100 },
    { name: 'Scale, merchant’s' },
    { name: 'Sealing wax' },
    { name: 'Signet ring' },
];

export default config.map((item) => ({ ...defaults, ...item }));
