// @ts-check

import rarity from '../../attributes/rarity.js';
import size from '../../attributes/size.js';
import type from '../type.js';

const {
    tiny,
    small,
    medium,
    large,
} = size;

const {
    abundant,
    common,
    uncommon,
    rare,
} = rarity;

/**
 * Number of small items that fit into a container or furnishing
 */
export const capacity = {
    [tiny]  : 0.5,
    [small] : 1,
    [medium]: 5,
    [large] : 10,
};

export const itemSizeSpace = {
    [tiny]  : 0.5,
    [small] : 1,
};

export const maxItemQuantitySmall = 10;

const defaults = {
    rarity: common,
    size  : small,
    type  : type.container,
};

const config = [
    { name: 'Backpack', size: medium },
    { name: 'Barrel, large', size: large },
    { name: 'Barrel, medium', size: medium },
    { name: 'Barrel, small' },
    { name: 'Basket, large', size: medium },
    { name: 'Basket, small', size: small },
    { name: 'Belt pouch, large' },
    { name: 'Belt pouch, small', size: tiny },
    { name: 'Bottle, glass', size: tiny },
    { name: 'Bowl', variants: [ 'wood', 'stone', 'glass' ] },
    { name: 'Box, large', size: large, variants: [ 'wood', 'stone', 'metal' ] },
    { name: 'Box, medium', size: medium, variants: [ 'wood', 'stone', 'metal' ] },
    { name: 'Box, small', variants: [ 'wood', 'stone', 'metal' ] },
    { name: 'Bucket' },
    { name: 'Case, crossbow bolt' },
    { name: 'Case, map or scroll' },
    { name: 'Chest, large', size: large },
    { name: 'Chest, medium', size: medium },
    { name: 'Chest, small' },
    { name: 'Component pouch', size: tiny, rarity: rare },
    { name: 'Crate' },
    { name: 'Flask', size: tiny },
    { name: 'Glass case', size: medium },
    { name: 'Jug' },
    { name: 'Pitcher' },
    { name: 'Pouch', size: tiny },
    { name: 'Quiver' },
    { name: 'Sack' },
    { name: 'Tankard', size: tiny, rarity: abundant },
    { name: 'Vial', size: tiny, rarity: uncommon },
    { name: 'Wagon', size: large },
    { name: 'Waterskin' },
];

export default config.map((item) => ({
    ...defaults,
    ...item,
    capacity: capacity[item.size] || capacity[defaults.size],
}));
