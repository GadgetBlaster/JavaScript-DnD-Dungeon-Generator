// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

let { common, uncommon, rare } = rarity;

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
    rarity  : uncommon,
    type    : type.liquid,
    variants: variants,
};

const config = [
    { name: 'Acid' },
    { name: 'Alchemist’s fire' },
    { name: 'Ale' },
    { name: 'Antitoxin' },
    { name: 'Cider, apple' },
    { name: 'Cider, hard' },
    { name: 'Grog' },
    { name: 'Holy water' },
    { name: 'Oil, lamp' },
    { name: 'Poison, basic' },
    { name: 'Poison, deadly', rarity: rare },
    { name: 'Water, clean', rarity: common },
    { name: 'Water, dirty', rarity: common },
    { name: 'Whisky' },
    { name: 'Wine, common' },
    { name: 'Wine, fine', rarity: rare },
];

export default config.map((item) => ({ ...defaults, ...item }));
