
import rarity from '../../attributes/rarity'
import type from '../type';

const defaults = {
    rarity: rarity.uncommon,
    type: type.chancery,
};

const config = [
    { name: 'Abacus', rarity: rarity.rare },
    { name: 'Book', rarity: rarity.common },
    { name: 'Chalk' },
    { name: 'Hourglass', rarity: rarity.rare },
    { name: 'Ink pen' },
    { name: 'Ink', variants: [ 'vial', 'bottle' ] },
    { name: 'Journal', variants: [ 'blank', 'adventurer’s', 'noble person’s', 'hermit’s', 'wizard’s', 'merchant’s' ] },
    { name: 'Paper', quantity: 100 },
    { name: 'Paperweight' },
    { name: 'Parchment', quantity: 100 },
    { name: 'Pencil' },
    { name: 'Scale, merchant’s', rarity: rarity.rare },
    { name: 'Sealing wax' },
    { name: 'Signet ring' },
    { name: 'Wax seal' },
];

export default config.map((item) => ({ ...defaults, ...item }));
