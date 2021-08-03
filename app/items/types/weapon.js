// @ts-check

import type from '../type.js';
import rarity from '../../attributes/rarity.js';
import size from '../../attributes/size.js';

let { abundant, common, average, uncommon, rare } = rarity;
let { tiny, small, medium, large } = size;

const defaults = {
    type  : type.weapon,
    rarity: uncommon,
    size  : medium,
};

const config = [
    { name: 'Battleaxe', rarity: average },
    { name: 'Blowgun' },
    { name: 'Caltrops', size: tiny, quantity: 20 },
    { name: 'Club', rarity: abundant },
    { name: 'Crossbow, hand', rarity: rare },
    { name: 'Crossbow, heavy ', rarity: rare },
    { name: 'Crossbow, light', rarity: rare },
    { name: 'Dagger', size: small, rarity: common },
    { name: 'Dart', size: tiny },
    { name: 'Flail' },
    { name: 'Glaive', size: large },
    { name: 'Greataxe', size: large },
    { name: 'Greatclub', size: large },
    { name: 'Greatsword', size: large },
    { name: 'Halberd', size: large },
    { name: 'Handaxe' },
    { name: 'Javelin' },
    { name: 'Lance' },
    { name: 'Light hammer' },
    { name: 'Longbow', size: large },
    { name: 'Longsword', size: large },
    { name: 'Mace' },
    { name: 'Maul' },
    { name: 'Morningstar' },
    { name: 'Net' },
    { name: 'Pike' },
    { name: 'Quarterstaff', size: large, rarity: common },
    { name: 'Rapier' },
    { name: 'Scimitar' },
    { name: 'Shortbow' },
    { name: 'Shortsword', rarity: average },
    { name: 'Sickle' },
    { name: 'Sling' },
    { name: 'Spear', size: large },
    { name: 'Trident', size: large },
    { name: 'War pick' },
    { name: 'Warhammer', size: large },
    { name: 'Whip' },
];

export default config.map((item) => ({ ...defaults, ...item }));
