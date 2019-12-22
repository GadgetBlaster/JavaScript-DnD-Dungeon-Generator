
import rarity from '../../attributes/rarity';
import type from '../type';

let {
    common,
    uncommon,
} = rarity;

const variants = [
    'barrel',
    'beaker',
    'bottle',
    'flask',
    'jar',
    'jug',
    'tankard',
    'vat',
    'vial',
    'waterskin',
];

const defaults = {
    rarity: uncommon,
    type: type.liquid,
    variants,
};

const config = [
    { name: 'Acid' },
    { name: 'Alchemist’s fire' },
    { name: 'Antitoxin' },
    { name: 'Holy water' },
    { name: 'Oil' },
    { name: 'Water', rarity: common },
    { name: 'Poison, basic' },
];

export default config.map((item) => ({ ...defaults, ...item }));
